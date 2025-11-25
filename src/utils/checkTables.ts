import pool from "./dbPostgres";

async function checkTables() {
  try {
    // List tables
    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `);
    console.log("📋 Tables:", tables.rows);

    // See bookings table data
    const bookings = await pool.query(`SELECT * FROM bookings;`);
    console.log("📦 Bookings data:", bookings.rows);

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

checkTables();
