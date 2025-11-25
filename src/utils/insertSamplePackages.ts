import pool from "./dbPostgres";

const insertSamplePackages = async () => {
  try {
    console.log("⏳ Inserting sample packages...");

    const packages = [
      {
        sender: "Alice Johnson",
        receiver: "Charlie Brown",
        email: "alice@example.com",
        pickupAddress: "123 Main St",
        deliveryAddress: "456 Elm St",
        pickupLat: 40.7128,
        pickupLng: -74.0060,
        weight: 2.5,
      },
      {
        sender: "Bob Smith",
        receiver: "Diana Prince",
        email: "bob@example.com",
        pickupAddress: "789 Oak St",
        deliveryAddress: "101 Pine St",
        pickupLat: 34.0522,
        pickupLng: -118.2437,
        weight: 0.2,
      },
    ];

    for (const p of packages) {
      await pool.query(
        `INSERT INTO packages (sender, receiver, email, pickupAddress, deliveryAddress, pickupLat, pickupLng, weight)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [p.sender, p.receiver, p.email, p.pickupAddress, p.deliveryAddress, p.pickupLat, p.pickupLng, p.weight]
      );
    }

    console.log("✅ Sample packages inserted!");

    const res = await pool.query("SELECT * FROM packages;");
    console.log("📦 Current packages table data:", res.rows);

    process.exit();
  } catch (err) {
    console.error("❌ Error inserting sample packages:", err);
    process.exit(1);
  }
};

insertSamplePackages();
