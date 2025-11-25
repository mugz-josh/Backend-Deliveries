import pool from "./dbPostgres";

const insertSampleBookings = async () => {
  try {
    console.log("⏳ Inserting sample bookings...");

    // Insert 2 sample bookings
    await pool.query(`
      INSERT INTO bookings (service, customer_name, email, phone, tracking_id)
      VALUES
        ('Delivery', 'Alice Johnson', 'alice@example.com', '1234567890', 'TRK001'),
        ('Pickup', 'Bob Smith', 'bob@example.com', '0987654321', 'TRK002')
      ON CONFLICT (tracking_id) DO NOTHING;
    `);

    console.log("✅ Sample bookings inserted!");

    // Query the table to confirm
    const result = await pool.query("SELECT * FROM bookings;");
    console.log("📦 Current bookings table data:", result.rows);

    process.exit();
  } catch (err) {
    console.error("❌ Error inserting sample bookings:", err);
    process.exit(1);
  }
};

insertSampleBookings();
