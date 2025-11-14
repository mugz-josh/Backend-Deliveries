// src/utils/generateOtp.ts

/**
 * Generate a numeric OTP (default: 6 digits).
 * Example output: "482913"
 */
export const generateOtp = (length: number = 6): string => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};
