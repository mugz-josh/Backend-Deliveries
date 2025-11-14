// backend/src/utils/mailer.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

// ---------------------
// Create transporter
// ---------------------
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true" || false,
  auth: {
    user: process.env.EMAIL_USER || "joshua.mugisha.upti@gmail.com",
    pass: process.env.EMAIL_PASS || "vqxuynytjsmdfxyv", // Gmail App Password
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter ready");
  }
});

// ---------------------
// OTP Functions
// ---------------------

/**
 * Generate a 6-digit OTP
 */
export const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("🔑 Generated OTP (for testing):", otp); // OTP logged in terminal
  return otp;
};

/**
 * Send OTP email
 * @param to Recipient email
 * @param otp OTP code
 */
export const sendOTPEmail = async (to: string, otp: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || "joshua.mugisha.upti@gmail.com",
      to,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// ---------------------
// Delivery Order Email Function
// ---------------------

/**
 * Send delivery order notification email
 * @param formData All order details from frontend OrderForm
 */
export const sendDeliveryEmail = async (formData: {
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  packageType: string;
  packageWeight: string;
  packageDescription: string;
  pickupDate: string;
  deliveryType: string;
  status?: string;
}) => {
  try {
    await transporter.sendMail({
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
  } catch (error) {
    console.error("❌ Error sending delivery email:", error);
  }
};
