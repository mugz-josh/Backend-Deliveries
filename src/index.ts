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
// CORS Configuration
// ---------------------
const allowedOrigins = [
  "http://localhost:3000",
  "https://deliveries-app-beta.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ---------------------
// Middleware
// ---------------------
app.use(bodyParser.json());

// ---------------------
// Serve uploaded images
// ---------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------
// Test route
// ---------------------
app.get("/", (req, res) => {
  res.json({ 
    message: "✅ Backend is running successfully!",
    status: "active",
    timestamp: new Date().toISOString()
  });
});

// ---------------------
// Routes
// ---------------------
app.use("/api/otp", OtpRoutes);
app.use("/api/deliveries", DeliveriesRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/bookings", BookingRoutes);
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
