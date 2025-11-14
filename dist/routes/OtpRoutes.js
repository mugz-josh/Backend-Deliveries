"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/OtpRoutes.ts
const express_1 = require("express");
const OtpControllers_1 = require("../controllers/OtpControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const AdminControllers_1 = require("../controllers/AdminControllers");
const router = (0, express_1.Router)();
// -------------------------
// Public routes
// -------------------------
// Check if email exists
router.post("/check-email", OtpControllers_1.checkEmail);
// Generate OTP for existing email
router.post("/generate-otp", OtpControllers_1.generateOtpForEmail);
// Register a new user (OTP sent automatically for non-admins)
router.post("/register", OtpControllers_1.registerUser);
// Verify OTP
router.post("/verify", OtpControllers_1.verifyOtp);
// Login
router.post("/login", OtpControllers_1.loginUser);
// -------------------------
// Admin-only routes
// -------------------------
// Get all users
router.get("/users", authMiddleware_1.verifyToken, (0, authMiddleware_1.authorizeRoles)(["admin"]), AdminControllers_1.getAllUsers);
// Update a user's role
router.patch("/users/:id/role", authMiddleware_1.verifyToken, (0, authMiddleware_1.authorizeRoles)(["admin"]), AdminControllers_1.updateUserRole);
// Delete a user
router.delete("/users/:id", authMiddleware_1.verifyToken, (0, authMiddleware_1.authorizeRoles)(["admin"]), AdminControllers_1.deleteUser);
// -------------------------
// User routes
// -------------------------
// Get own profile
router.get("/profile", authMiddleware_1.verifyToken, (0, authMiddleware_1.authorizeRoles)(["user", "admin"]), (req, res) => {
    const user = req.user; // injected by verifyToken middleware
    res.json({ message: "This is your profile", user });
});
exports.default = router;
//# sourceMappingURL=OtpRoutes.js.map