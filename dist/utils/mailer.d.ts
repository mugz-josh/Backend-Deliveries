import nodemailer from "nodemailer";
export declare const transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options>;
/**
 * Generate a 6-digit OTP
 */
export declare const generateOTP: () => string;
/**
 * Send OTP email
 * @param to Recipient email
 * @param otp OTP code
 */
export declare const sendOTPEmail: (to: string, otp: string) => Promise<void>;
/**
 * Send delivery order notification email
 * @param formData All order details from frontend OrderForm
 */
export declare const sendDeliveryEmail: (formData: {
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
}) => Promise<void>;
//# sourceMappingURL=mailer.d.ts.map