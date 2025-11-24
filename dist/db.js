"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
// src/db.ts
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env
// Ensure required environment variables exist
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    throw new Error('❌ Database environment variables missing in .env');
}
// Create a named export pool
exports.pool = promise_1.default.createPool({
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
exports.default = exports.pool;
// Optional: quick test connection
async function testConnection() {
    try {
        const conn = await exports.pool.getConnection();
        console.log("✅ Database connected successfully!");
        const [rows] = await conn.query('SELECT 1 + 1 AS result');
        console.log("Query test result:", rows);
        conn.release();
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("❌ Connection error:", err.message);
        }
        else {
            console.error("❌ Connection error:", err);
        }
    }
}
// Run test immediately (optional)
testConnection();
