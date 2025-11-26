// backend/src/routes/OtpRoutes.ts
import { Router } from "express";
// ✅ USE THE GOOD DATABASE-BASED CONTROLLERS
import { 
  registerUser, 
  sendOtp, 
  verifyOtp, 
  loginUser 
} from "../controllers/authControllers";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/AdminControllers";  // PostgreSQL
import db from "../db";
 // ✅ correct one



const router = Router();

// -------------------------
// Check Email Existence
// -------------------------
const checkEmail = async (req: any, res: any) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM otp_users WHERE email = ?",
      [email]
    );
    
    res.json({ exists: rows.length > 0 });
  } catch (error) {
    console.error("❌ Error checking email:", error);
    res.status(500).json({ error: "Failed to check email" });
  }
};

// -------------------------
// Public routes
// -------------------------

// Check if email exists
router.post("/check-email", checkEmail);

// Generate OTP for existing email
router.post("/generate-otp", sendOtp); // ✅ Use sendOtp from authControllers

// Register a new user
router.post("/register", registerUser); // ✅ Use registerUser from authControllers

// Verify OTP
router.post("/verify", verifyOtp); // ✅ Use verifyOtp from authControllers

// Login
router.post("/login", loginUser); // ✅ Use loginUser from authControllers

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
  res.json({ 
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

export default router;