"use strict";
// src/utils/generateOtp.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
/**
 * Generate a numeric OTP (default: 6 digits).
 * Example output: "482913"
 */
const generateOtp = (length = 6) => {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
};
exports.generateOtp = generateOtp;
