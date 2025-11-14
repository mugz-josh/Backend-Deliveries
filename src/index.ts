// backend/src/index.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";

// ---------------------
// Import Routes
// ---------------------
import OtpRoutes from "./routes/OtpRoutes";
import DeliveriesRoutes from "./routes/DeliveriesRoutes";
import UserRoutes from "./routes/UserRoutes";
import BookingRoutes from "./routes/booking";
import SupportRoutes from "./routes/support";

// ---------------------
// Load environment variables
// ---------------------
dotenv.config();

const app = express();

// ---------------------
// Middleware
// ---------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());

// ---------------------
// Serve uploaded images
// ---------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------
// Routes
// ---------------------

// Test route
app.get("/", (req, res) => {
  res.json({ 
    message: "✅ Backend is running successfully on Railway!",
    status: "active",
    timestamp: new Date().toISOString()
  });
});

// OTP routes (register, verify, login)
app.use("/api/otp", OtpRoutes);

// Deliveries routes
app.use("/api/deliveries", DeliveriesRoutes);

// User profile routes (update profile, upload avatar)
app.use("/api/user", UserRoutes);

// Booking routes
app.use("/api/bookings", BookingRoutes);

// Support / Donate routes
app.use("/api/support", SupportRoutes);

// 404 fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---------------------
// Start server
// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});