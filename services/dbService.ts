// backend/src/services/dbService.ts
import db from "../db"; // your db.ts file

export const saveOtpToDatabase = async (email: string, otp: string) => {
  await db.query("INSERT INTO otp_users (email, otp) VALUES (?, ?)", [email, otp]);
};

export const verifyOtpInDatabase = async (email: string, otp: string) => {
  const [rows] = await db.query("SELECT * FROM otp_users WHERE email=? AND otp=?", [email, otp]);
  return (rows as any[]).length > 0;
};

export const registerNewUser = async (email: string, password: string) => {
  await db.query("INSERT INTO registers (email, password) VALUES (?, ?)", [email, password]);
};
