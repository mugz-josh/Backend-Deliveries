"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDeliveryEmail = exports.sendOTPEmail = exports.generateOTP = exports.transporter = void 0;
// backend/src/utils/mailer.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load .env variables
// ---------------------
// Create transporter
// ---------------------
exports.transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true" || false,
    auth: {
        user: process.env.EMAIL_USER || "joshua.mugisha.upti@gmail.com",
        pass: process.env.EMAIL_PASS || "vqxuynytjsmdfxyv", // Gmail App Password
    },
});
// Verify transporter
exports.transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Email transporter error:", error);
    }
    else {
        console.log("✅ Email transporter ready");
    }
});
// ---------------------
// OTP Functions
// ---------------------
/**
 * Generate a 6-digit OTP
 */
const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("🔑 Generated OTP (for testing):", otp); // OTP logged in terminal
    return otp;
};
exports.generateOTP = generateOTP;
/**
 * Send OTP email
 * @param to Recipient email
 * @param otp OTP code
 */
const sendOTPEmail = async (to, otp) => {
    try {
        const info = await exports.transporter.sendMail({
            from: process.env.EMAIL_USER || "joshua.mugisha.upti@gmail.com",
            to,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}`,
        });
        console.log("✅ Email sent:", info.response);
    }
    catch (error) {
        console.error("❌ Error sending email:", error);
    }
};
exports.sendOTPEmail = sendOTPEmail;
// ---------------------
// Delivery Order Email Function
// ---------------------
/**
 * Send delivery order notification email
 * @param formData All order details from frontend OrderForm
 */
const sendDeliveryEmail = async (formData) => {
    try {
        await exports.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // YOU will receive the email
            subject: `New Delivery Order from ${formData.senderName}`,
            text: `
New delivery order received!

Sender Information:
  Name: ${formData.senderName}
  Phone: ${formData.senderPhone}
  Address: ${formData.senderAddress}

Receiver Information:
  Name: ${formData.receiverName}
  Phone: ${formData.receiverPhone}
  Address: ${formData.receiverAddress}

Package Details:
  Type: ${formData.packageType}
  Weight: ${formData.packageWeight} kg
  Description: ${formData.packageDescription}
  Delivery Type: ${formData.deliveryType}
  Pickup Date: ${formData.pickupDate}
  Status: ${formData.status || "pending"}
`,
        });
        console.log("✅ Delivery email sent!");
    }
    catch (error) {
        console.error("❌ Error sending delivery email:", error);
    }
};
exports.sendDeliveryEmail = sendDeliveryEmail;
