// src/db.ts
import dotenv from "dotenv"; // ✅ MUST import dotenv first
dotenv.config(); // ✅ Load .env variables immediately

import mysql from "mysql2/promise";

// Check for required MySQL environment variables (allow empty password)
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Optional: test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL successfully!");
    const [rows] = await connection.execute("SELECT NOW() AS `current_time`");
    console.log("Query test result:", rows);
    connection.release();
  } catch (err: unknown) {
    if (err instanceof Error) console.error("❌ MySQL connection error:", err.message);
    else console.error("❌ MySQL connection error:", err);
  }
}

// Run test immediately
testConnection();

export default pool;
