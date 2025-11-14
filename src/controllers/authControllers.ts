// src/controllers/authControllers.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import db from "../db";
import { generateOTP, sendOTPEmail } from "../utils/mailer";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined in .env");

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// -------------------------
// REGISTER USER
// -------------------------
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM otp_users WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return res.status(400).json({
        message: "Email already registered. Please request OTP.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // By default, new users have role 'user'
    await db.query(
      "INSERT INTO otp_users (name, email, password, role) VALUES (?, ?, ?, 'user')",
      [name, email, hashedPassword]
    );

    return res.json({
      success: true,
      message: "Registered successfully. Please request OTP.",
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

// -------------------------
// SEND OTP
// -------------------------
export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM otp_users WHERE email = ?",
      [email]
    );

    if (!rows.length) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await db.query(
      "UPDATE otp_users SET otp_code=?, otp_expires_at=? WHERE email=?",
      [hashedOtp, expiresAt, email]
    );

    try {
      await sendOTPEmail(email, otp);
      console.log(`✅ OTP sent to ${email}: ${otp}`);
    } catch (mailError) {
      console.error("❌ Failed to send OTP email:", mailError);
      return res.status(500).json({ message: "Could not send OTP email" });
    }

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    return res.status(500).json({ message: "Server error during OTP sending" });
  }
};

// -------------------------
// VERIFY OTP
// -------------------------
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM otp_users WHERE email=?",
      [email]
    );

    if (!rows.length) return res.status(404).json({ message: "User not found" });

    const dbUser = rows[0];

    if (!dbUser.otp_code) return res.status(400).json({ message: "OTP not generated" });
    if (new Date(dbUser.otp_expires_at) < new Date()) return res.status(400).json({ message: "OTP expired" });

    const valid = await bcrypt.compare(otp, dbUser.otp_code);
    if (!valid) return res.status(400).json({ message: "Invalid OTP" });

    // Clear OTP
    await db.query(
      "UPDATE otp_users SET otp_code=NULL, otp_expires_at=NULL WHERE email=?",
      [email]
    );

    // Include role in payload and response
    const payload = { id: dbUser.id, email: dbUser.email, name: dbUser.name, role: dbUser.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);

    return res.json({
      success: true,
      message: "OTP verified",
      token,
      user: { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role }
    });
  } catch (err) {
    console.error("❌ Error verifying OTP:", err);
    return res.status(500).json({ message: "Server error while verifying OTP" });
  }
};

// -------------------------
// LOGIN USER
// -------------------------
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM otp_users WHERE email=?",
      [email]
    );

    if (!rows.length) return res.status(404).json({ message: "User not found" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Include role in payload and response
    const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("❌ Error logging in:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};
