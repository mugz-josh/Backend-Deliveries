"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.verifyOtp = exports.sendOtp = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const mailer_1 = require("../utils/mailer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET)
    throw new Error("JWT_SECRET not defined in .env");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
// -------------------------
// REGISTER USER
// -------------------------
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ message: "All fields are required" });
    try {
        const [rows] = await db_1.default.query("SELECT * FROM otp_users WHERE email = ?", [email]);
        if (rows.length > 0) {
            return res.status(400).json({
                message: "Email already registered. Please request OTP.",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // By default, new users have role 'user'
        await db_1.default.query("INSERT INTO otp_users (name, email, password, role) VALUES (?, ?, ?, 'user')", [name, email, hashedPassword]);
        return res.json({
            success: true,
            message: "Registered successfully. Please request OTP.",
        });
    }
    catch (error) {
        console.error("❌ Error registering user:", error);
        return res.status(500).json({ message: "Server error during registration" });
    }
};
exports.registerUser = registerUser;
// -------------------------
// SEND OTP
// -------------------------
const sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ message: "Email is required" });
    try {
        const [rows] = await db_1.default.query("SELECT * FROM otp_users WHERE email = ?", [email]);
        if (!rows.length)
            return res.status(404).json({ message: "User not found" });
        const otp = (0, mailer_1.generateOTP)();
        const hashedOtp = await bcryptjs_1.default.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        await db_1.default.query("UPDATE otp_users SET otp_code=?, otp_expires_at=? WHERE email=?", [hashedOtp, expiresAt, email]);
        try {
            await (0, mailer_1.sendOTPEmail)(email, otp);
            console.log(`✅ OTP sent to ${email}: ${otp}`);
        }
        catch (mailError) {
            console.error("❌ Failed to send OTP email:", mailError);
            return res.status(500).json({ message: "Could not send OTP email" });
        }
        return res.json({ success: true, message: "OTP sent successfully" });
    }
    catch (error) {
        console.error("❌ Error sending OTP:", error);
        return res.status(500).json({ message: "Server error during OTP sending" });
    }
};
exports.sendOtp = sendOtp;
// -------------------------
// VERIFY OTP
// -------------------------
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp)
        return res.status(400).json({ message: "Email and OTP required" });
    try {
        const [rows] = await db_1.default.query("SELECT * FROM otp_users WHERE email=?", [email]);
        if (!rows.length)
            return res.status(404).json({ message: "User not found" });
        const dbUser = rows[0];
        if (!dbUser.otp_code)
            return res.status(400).json({ message: "OTP not generated" });
        if (new Date(dbUser.otp_expires_at) < new Date())
            return res.status(400).json({ message: "OTP expired" });
        const valid = await bcryptjs_1.default.compare(otp, dbUser.otp_code);
        if (!valid)
            return res.status(400).json({ message: "Invalid OTP" });
        // Clear OTP
        await db_1.default.query("UPDATE otp_users SET otp_code=NULL, otp_expires_at=NULL WHERE email=?", [email]);
        // Include role in payload and response
        const payload = { id: dbUser.id, email: dbUser.email, name: dbUser.name, role: dbUser.role };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return res.json({
            success: true,
            message: "OTP verified",
            token,
            user: { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role }
        });
    }
    catch (err) {
        console.error("❌ Error verifying OTP:", err);
        return res.status(500).json({ message: "Server error while verifying OTP" });
    }
};
exports.verifyOtp = verifyOtp;
// -------------------------
// LOGIN USER
// -------------------------
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password are required" });
    try {
        const [rows] = await db_1.default.query("SELECT * FROM otp_users WHERE email=?", [email]);
        if (!rows.length)
            return res.status(404).json({ message: "User not found" });
        const user = rows[0];
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        // Include role in payload and response
        const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    }
    catch (err) {
        console.error("❌ Error logging in:", err);
        return res.status(500).json({ message: "Server error during login" });
    }
};
exports.loginUser = loginUser;
