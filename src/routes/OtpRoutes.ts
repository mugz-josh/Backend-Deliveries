// backend/src/routes/OtpRoutes.ts
import { Router } from "express";
import { registerUser, verifyOtp, loginUser, checkEmail, generateOtpForEmail } from "../controllers/OtpControllers";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/AdminControllers";

const router = Router();

// -------------------------
// Public routes
// -------------------------

// Check if email exists
router.post("/check-email", checkEmail);

// Generate OTP for existing email
router.post("/generate-otp", generateOtpForEmail);

// Register a new user (OTP sent automatically for non-admins)
router.post("/register", registerUser);

// Verify OTP
router.post("/verify", verifyOtp);

// Login
router.post("/login", loginUser);

// -------------------------
// Admin-only routes
// -------------------------

// Get all users
router.get("/users", verifyToken, authorizeRoles(["admin"]), getAllUsers);

// Update a user's role
router.patch("/users/:id/role", verifyToken, authorizeRoles(["admin"]), updateUserRole);

// Delete a user
router.delete("/users/:id", verifyToken, authorizeRoles(["admin"]), deleteUser);

// -------------------------
// User routes
// -------------------------

// Get own profile
router.get("/profile", verifyToken, authorizeRoles(["user", "admin"]), (req, res) => {
  const user = (req as any).user; // injected by verifyToken middleware
  res.json({ message: "This is your profile", user });
});

export default router;
