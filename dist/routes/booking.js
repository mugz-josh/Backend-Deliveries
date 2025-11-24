"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = (0, express_1.Router)();
// -----------------------
// Helper: generate tracking ID
// -----------------------
const generateTrackingId = () => {
    const prefix = "QD"; // QuickDeliver prefix
    const random = Math.floor(100000000 + Math.random() * 900000000); // 9-digit number
    return `${prefix}${random}`;
};
// ===================
// CREATE NEW BOOKING
// ===================
router.post("/", async (req, res) => {
    try {
        const { service, customer_name, email, phone } = req.body;
        if (!service || !customer_name || !email) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const tracking_id = generateTrackingId();
        // Insert booking into database
        await db_1.default.query("INSERT INTO bookings (service, customer_name, email, phone, tracking_id) VALUES (?, ?, ?, ?, ?)", [service, customer_name, email, phone || null, tracking_id]);
        // Send email notification
        const transporter = nodemailer_1.default.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Booking Confirmation - Tracking ID: ${tracking_id}`,
            text: `
Hello ${customer_name},

Your booking for "${service}" has been confirmed!

Tracking ID: ${tracking_id}

You can use this tracking ID to track your package in real-time.

Thank you for choosing QuickDeliver!
      `,
        });
        res.status(201).json({
            message: "Booking created successfully!",
            tracking_id,
        });
    }
    catch (err) {
        console.error("Booking error:", err);
        res.status(500).json({ error: "Failed to create booking" });
    }
});
// ===================
// GET BOOKING BY TRACKING ID
// ===================
router.get("/:tracking_id", async (req, res) => {
    try {
        const { tracking_id } = req.params;
        const [rows] = await db_1.default.query("SELECT * FROM bookings WHERE tracking_id = ?", [tracking_id]);
        // Check if any booking exists
        if (!rows || rows.length === 0 || !rows[0]) {
            return res.status(404).json({ error: "Tracking ID not found" });
        }
        const bookingRow = rows[0];
        // Create timeline based on booking creation date
        const createdDate = new Date(bookingRow.created_at);
        const timeline = [
            {
                status: "Package received",
                date: createdDate.toISOString(),
                completed: true
            },
            {
                status: "In transit to distribution center",
                date: new Date(createdDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
                completed: true
            },
            {
                status: "Arrived at distribution center",
                date: new Date(createdDate.getTime() + 48 * 60 * 60 * 1000).toISOString(),
                completed: true
            },
            {
                status: "Out for delivery",
                date: new Date(createdDate.getTime() + 72 * 60 * 60 * 1000).toISOString(),
                completed: false
            },
            {
                status: "Delivered",
                date: "Pending",
                completed: false
            },
        ];
        // Map to BookingWithTimeline - this should now work without type errors
        const booking = {
            id: bookingRow.id,
            service: bookingRow.service,
            customer_name: bookingRow.customer_name,
            email: bookingRow.email,
            phone: bookingRow.phone,
            created_at: bookingRow.created_at,
            tracking_id: bookingRow.tracking_id,
            timeline: timeline,
            status: "In Transit",
        };
        res.json(booking);
    }
    catch (err) {
        console.error("Tracking error:", err);
        res.status(500).json({ error: "Failed to retrieve tracking info" });
    }
});
exports.default = router;
