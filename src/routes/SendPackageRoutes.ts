// backend/src/routes/sendPackageRoutes.ts
import express from "express";
import db from "../db";
import nodemailer from "nodemailer";

const router = express.Router();

// POST endpoint for sending package
router.post("/", async (req, res) => {
  try {
    const {
      sender,
      receiver,
      email,
      pickupAddress,
      deliveryAddress,
      weight,
      pickupLat,
      pickupLng
    } = req.body;

    // Validate required fields
    if (!sender || !receiver || !email || !pickupAddress || !deliveryAddress || !weight) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // Insert into database
    const [result] = await db.query(
      `INSERT INTO send_packages 
       (sender, receiver, email, pickup_address, delivery_address, weight, pickup_lat, pickup_lng, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [sender, receiver, email, pickupAddress, deliveryAddress, weight, pickupLat || null, pickupLng || null]
    );

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Package Sent Successfully!",
      text: `
Hello ${sender},

Your package has been scheduled for delivery!

Package Details:
- From: ${sender}
- To: ${receiver}
- Pickup: ${pickupAddress}
- Delivery: ${deliveryAddress}
- Weight: ${weight}kg

We'll notify you when your package is on the way!

Thank you for using QuickDeliver!
      `,
    });

    res.status(201).json({
      message: "Package sent successfully! Check your email for confirmation.",
      packageId: (result as any).insertId
    });

  } catch (err) {
    console.error("Error sending package:", err);
    res.status(500).json({ error: "Failed to send package" });
  }
});

export default router;