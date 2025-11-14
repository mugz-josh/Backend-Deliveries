// src/services/OtpService.ts
import { pool } from '../db';
import { generateOtp } from '../utils/generateOtp';

// Function to create and save OTP for an email
export const createOtp = async (email: string) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

  // Save OTP in DB
  await pool.query(
    'INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)',
    [email, otp, expiresAt]
  );

  return otp;
};

// Function to verify OTP
export const verifyOtp = async (email: string, otp: string) => {
  const [rows]: any = await pool.query(
    'SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW()',
    [email, otp]
  );

  if (rows.length === 0) {
    return false; // OTP is invalid or expired
  }

  // Delete OTP after successful verification
  await pool.query('DELETE FROM otps WHERE email = ?', [email]);

  return true;
};
