// src/db.ts
import dotenv from "dotenv"; // ✅ MUST import dotenv first
dotenv.config(); // ✅ Load .env variables immediately

import { Pool } from "pg";

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing in .env!");
  process.exit(1); // stop execution if DATABASE_URL not set
}

// Create PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Render
  },
});

// Optional: test connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL successfully!");
    const res = await client.query("SELECT NOW() AS current_time");
    console.log("Query test result:", res.rows[0]);
    client.release();
  } catch (err: unknown) {
    if (err instanceof Error) console.error("❌ PostgreSQL connection error:", err.message);
    else console.error("❌ PostgreSQL connection error:", err);
  }
}

// Run test immediately
testConnection();

export default pool;
