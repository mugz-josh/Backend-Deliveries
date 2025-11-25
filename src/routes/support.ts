import express from "express";
import nodemailer from "nodemailer";
import db from "../utils/dbPostgres";   // PostgreSQL
 // ✅ Use your existing database connection

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, phone, amount, message } = req.body;

  if (!name || !email || !amount) {
    return res.status(400).json({ error: "Name, email, and amount are required." });
  }

  try {
    // 1️⃣ Save the data in MySQL using your existing db connection
    await db.query(
      `INSERT INTO support_submissions (name, email, phone, amount, message, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, email, phone || null, amount, message || null]
    );

    // 2️⃣ Send emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send to admin
    await transporter.sendMail({
      from: `"Support Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Support: ${amount} from ${name}`,
      text: `You received support from ${name} (${email})\nPhone: ${phone || "Not provided"}\nAmount: ${amount}\nMessage: ${message || "No message"}`,
    });

    // Send to supporter
    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for your support!",
      text: `Hi ${name},\n\nThank you for supporting us with ${amount}. We really appreciate it!\n\n- Your Team`,
    });

    res.json({ message: "Support submitted successfully!" });
  } catch (err) {
    console.error("❌ Error in support route:", err);
    res.status(500).json({ error: "Failed to send support email or save data." });
  }
});

export default router;