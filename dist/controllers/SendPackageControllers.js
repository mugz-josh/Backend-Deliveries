"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPackage = void 0;
const db_1 = __importDefault(require("../db")); // your database connection
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendPackage = async (req, res) => {
    const { sender, receiver, email, pickupAddress, deliveryAddress, weight, pickupLat, pickupLng, } = req.body;
    try {
        // 1️⃣ Save package info in database
        const query = "INSERT INTO packages (sender, receiver, email, pickupAddress, deliveryAddress, weight, pickupLat, pickupLng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await db_1.default.execute(query, [
            sender,
            receiver,
            email,
            pickupAddress,
            deliveryAddress,
            weight,
            pickupLat,
            pickupLng,
        ]);
        // 2️⃣ Send confirmation email
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail", // can use another SMTP service
            auth: {
                user: process.env.EMAIL_USER, // set in .env
                pass: process.env.EMAIL_PASS, // set in .env
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Package Confirmation",
            text: `Hi ${sender}, your package to ${receiver} has been scheduled for delivery!`,
        });
        res.status(200).json({ message: "Package sent successfully! Check your email." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
};
exports.sendPackage = sendPackage;
