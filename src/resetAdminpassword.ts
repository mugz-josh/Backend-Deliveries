import { createPool } from "mysql2/promise";
import bcrypt from "bcryptjs";

const db = createPool({
  host: "127.0.0.1",
  user: "delivery_user",           // <- your DB user
  password: "StrongPassword123!",  // <- your DB password
  database: "deliveries",
  port: 3306
});

async function resetAdminPassword() {
  try {
    const hashedPassword = await bcrypt.hash("Admin123456!", 10);

    const [result] = await db.query(
      "UPDATE otp_users SET password = ? WHERE email = ?",
      [hashedPassword, "mugishajoshua81@gmail.com"]
    );

    console.log("✅ Admin password updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating Admin password:", err);
    process.exit(1);
  }
}

resetAdminPassword();
