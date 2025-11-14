"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// ---------------------
// Import Routes
// ---------------------
const OtpRoutes_1 = __importDefault(require("./routes/OtpRoutes"));
const DeliveriesRoutes_1 = __importDefault(require("./routes/DeliveriesRoutes"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const booking_1 = __importDefault(require("./routes/booking")); // ✅ Booking routes
const support_1 = __importDefault(require("./routes/support")); // ✅ New Support route
// ---------------------
// Load environment variables
// ---------------------
dotenv_1.default.config();
const app = (0, express_1.default)();
// ---------------------
// Middleware
// ---------------------
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
}));
app.use(body_parser_1.default.json());
// ---------------------
// Serve uploaded images
// ---------------------
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
// ---------------------
// Routes
// ---------------------
// Test route
app.get("/", (req, res) => {
    res.send(`✅ Backend is running! Clickable link: <a href="http://localhost:${process.env.PORT || 5000}">http://localhost:${process.env.PORT || 5000}</a>`);
});
// OTP routes (register, verify, login)
app.use("/api/otp", OtpRoutes_1.default);
// Deliveries routes
app.use("/api/deliveries", DeliveriesRoutes_1.default);
// User profile routes (update profile, upload avatar)
app.use("/api/user", UserRoutes_1.default);
// Booking routes (📦 new)
app.use("/api/bookings", booking_1.default);
// Support / Donate routes
app.use("/api/support", support_1.default);
// 404 fallback for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// ---------------------
// Start server
// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map