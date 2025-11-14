"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db = (0, promise_1.createPool)({
    host: "127.0.0.1",
    user: "delivery_user", // <- your DB user
    password: "StrongPassword123!", // <- your DB password
    database: "deliveries",
    port: 3306
});
async function resetAdminPassword() {
    try {
        const hashedPassword = await bcryptjs_1.default.hash("Admin123456!", 10);
        const [result] = await db.query("UPDATE otp_users SET password = ? WHERE email = ?", [hashedPassword, "mugishajoshua81@gmail.com"]);
        console.log("✅ Admin password updated successfully!");
        process.exit(0);
    }
    catch (err) {
        console.error("❌ Error updating Admin password:", err);
        process.exit(1);
    }
}
resetAdminPassword();
//# sourceMappingURL=resetAdminpassword.js.map