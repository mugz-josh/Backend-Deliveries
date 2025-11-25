// src/utils/createTables.ts
import pool from "./dbPostgres";

const createTables = async () => {
  try {
    console.log("⏳ Creating tables...");

    // BOOKINGS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        service VARCHAR(100) NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        tracking_id VARCHAR(20) UNIQUE
      );
    `);
    console.log("✅ Bookings table created!");

    // DELIVERIES TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deliveries (
        id SERIAL PRIMARY KEY,
        senderName VARCHAR(100) NOT NULL,
        senderPhone VARCHAR(20) NOT NULL,
        senderAddress VARCHAR(255) NOT NULL,
        receiverName VARCHAR(100) NOT NULL,
        receiverPhone VARCHAR(20) NOT NULL,
        receiverAddress VARCHAR(255) NOT NULL,
        packageType VARCHAR(50) NOT NULL,
        packageWeight NUMERIC(10,2) NOT NULL,
        packageDescription TEXT NOT NULL,
        pickupDate DATE NOT NULL,
        deliveryType VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Deliveries table created!");

    // PACKAGES TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id SERIAL PRIMARY KEY,
        sender VARCHAR(100) NOT NULL,
        receiver VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        pickupAddress VARCHAR(255) NOT NULL,
        deliveryAddress VARCHAR(255) NOT NULL,
        pickupLat REAL NOT NULL,
        pickupLng REAL NOT NULL,
        weight REAL NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Packages table created!");

    // SEARCHES TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS searches (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        sku VARCHAR(100) UNIQUE NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image VARCHAR(500),
        deliveryTime VARCHAR(100),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Searches table created!");

    // SUPPORT SUBMISSIONS TABLE (converted from your MySQL structure)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS support_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        amount DECIMAL(10,2) NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Support Submissions table created!");

    console.log("🎉 All tables created successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error creating tables:", err);
    process.exit(1);
  }
};

createTables();
