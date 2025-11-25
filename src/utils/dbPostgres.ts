// src/dbPostgres.ts
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Check DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL missing in .env");
}

// Create connection pool with SSL for Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Render PostgreSQL
  },
});

export default pool;

// Optional test
async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW() AS current_time");
    console.log("✅ Connected to PostgreSQL successfully!", res.rows[0]);
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err);
  }
}

testConnection();
