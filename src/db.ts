// src/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Ensure DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL is missing in .env');
}

// Create PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Render
  },
});

// Optional: quick test connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL successfully!");
    const res = await client.query('SELECT 1 + 1 AS result');
    console.log("Query test result:", res.rows);
    client.release();
  } catch (err: unknown) {
    if (err instanceof Error) console.error("❌ Connection error:", err.message);
    else console.error("❌ Connection error:", err);
  }
}

// Run test immediately
testConnection();

export default pool;
