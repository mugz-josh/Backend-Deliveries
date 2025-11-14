// src/db.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// Ensure required environment variables exist
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  throw new Error('❌ Database environment variables missing in .env');
}

// Create a named export pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1', // safer than localhost
  user: process.env.DB_USER || 'delivery_user',
  password: process.env.DB_PASSWORD || 'StrongPassword123!',
  database: process.env.DB_NAME || 'deliveries',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Default export (optional)
export default pool;

// Optional: quick test connection
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Database connected successfully!");
    const [rows] = await conn.query('SELECT 1 + 1 AS result');
    console.log("Query test result:", rows);
    conn.release();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Connection error:", err.message);
    } else {
      console.error("❌ Connection error:", err);
    }
  }
}

// Run test immediately (optional)
testConnection();
