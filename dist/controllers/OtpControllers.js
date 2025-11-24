"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmail = exports.loginUser = exports.verifyOtp = exports.generateOtpForEmail = exports.registerUser = void 0;
// Temporary storage for users and OTPs
const users = [];
const otpStore = [];
const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Check if user exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }
        // Create user
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password,
            isVerified: false
        };
        users.push(newUser);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: newUser.id
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration error'
        });
    }
};
exports.registerUser = registerUser;
const generateOtpForEmail = async (req, res) => {
    try {
        const { email } = req.body;
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Store OTP
        const otpEntry = {
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        };
        otpStore.push(otpEntry);
        res.status(200).json({
            success: true,
            message: 'OTP generated',
            otp: otp // Remove this in production
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'OTP generation failed'
        });
    }
};
exports.generateOtpForEmail = generateOtpForEmail;
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        // Find OTP
        const otpEntry = otpStore.find(entry => entry.email === email && entry.otp === otp);
        if (!otpEntry) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }
        // Check if expired
        if (new Date() > otpEntry.expiresAt) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired'
            });
        }
        // Mark user as verified
        const user = users.find(user => user.email === email);
        if (user)
            user.isVerified = true;
        res.status(200).json({
            success: true,
            message: 'OTP verified'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'OTP verification failed'
        });
    }
};
exports.verifyOtp = verifyOtp;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(user => user.email === email && user.password === password);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};
exports.loginUser = loginUser;
const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const exists = users.some(user => user.email === email);
        res.status(200).json({
            exists: exists
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Email check failed'
        });
    }
};
exports.checkEmail = checkEmail;
