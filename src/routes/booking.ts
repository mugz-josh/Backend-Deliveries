// src/routes/booking.ts
import { Router } from "express";
import db from "../db";
import nodemailer from "nodemailer";
import { RowDataPacket } from "mysql2";



const router = Router();

// -----------------------
// Types
// -----------------------
interface BookingRow extends RowDataPacket {
  id: number;
  service: string;
  customer_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  tracking_id: string;
}

interface TimelineEvent {
  status: string;
  date: string;
  completed: boolean;
}

interface BookingWithTimeline extends BookingRow {
  timeline: TimelineEvent[];
  status: string;
}

// -----------------------
// Helper: generate tracking ID
// -----------------------
const generateTrackingId = (): string => {
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
    await db.query(
      "INSERT INTO bookings (service, customer_name, email, phone, tracking_id) VALUES (?, ?, ?, ?, ?)",
      [service, customer_name, email, phone || null, tracking_id]
    );

    // Send email notification
    const transporter = nodemailer.createTransport({
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
  } catch (err: any) {
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

    const [rows] = await db.query<BookingRow[]>(
      "SELECT * FROM bookings WHERE tracking_id = ?",
      [tracking_id]
    );

    // Check if any booking exists
    if (!rows || rows.length === 0 || !rows[0]) {
      return res.status(404).json({ error: "Tracking ID not found" });
    }

    const bookingRow = rows[0];

    // Map to BookingWithTimeline
    const booking: BookingWithTimeline = {
      id: bookingRow.id,
      service: bookingRow.service,
      customer_name: bookingRow.customer_name,
      email: bookingRow.email,
      phone: bookingRow.phone,
      created_at: bookingRow.created_at,
      tracking_id: bookingRow.tracking_id,
      timeline: [
        { status: "Package received", date: bookingRow.created_at, completed: true },
        { status: "In transit to distribution center", date: "2025-10-03 12:00", completed: true },
        { status: "Arrived at distribution center", date: "2025-10-04 08:00", completed: true },
        { status: "Out for delivery", date: "2025-10-05 10:00", completed: false },
        { status: "Delivered", date: "Pending", completed: false },
      ],
      status: "In Transit",
    };

    res.json(booking);
  } catch (err) {
    console.error("Tracking error:", err);
    res.status(500).json({ error: "Failed to retrieve tracking info" });
  }
});

export default router;
