// src/utils/insertSampleDeliveries.ts
import pool from "./dbPostgres";

const insertSampleDeliveries = async () => {
  try {
    console.log("⏳ Inserting sample deliveries...");

    // Sample data
    const deliveries = [
      {
        senderName: "Alice Johnson",
        senderPhone: "1234567890",
        senderAddress: "123 Main St",
        receiverName: "Charlie Brown",
        receiverPhone: "1112223333",
        receiverAddress: "456 Elm St",
        packageType: "Box",
        packageWeight: 2.5,
        packageDescription: "Electronics",
        pickupDate: "2025-11-26",
        deliveryType: "Standard",
      },
      {
        senderName: "Bob Smith",
        senderPhone: "0987654321",
        senderAddress: "789 Oak St",
        receiverName: "Diana Prince",
        receiverPhone: "4445556666",
        receiverAddress: "101 Pine St",
        packageType: "Envelope",
        packageWeight: 0.2,
        packageDescription: "Documents",
        pickupDate: "2025-11-27",
        deliveryType: "Express",
      },
    ];

    // Insert each delivery
    for (const d of deliveries) {
      await pool.query(
        `
        INSERT INTO deliveries 
        (senderName, senderPhone, senderAddress, receiverName, receiverPhone, receiverAddress, packageType, packageWeight, packageDescription, pickupDate, deliveryType)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `,
        [
          d.senderName,
          d.senderPhone,
          d.senderAddress,
          d.receiverName,
          d.receiverPhone,
          d.receiverAddress,
          d.packageType,
          d.packageWeight,
          d.packageDescription,
          d.pickupDate,
          d.deliveryType,
        ]
      );
    }

    console.log("✅ Sample deliveries inserted!");

    // Print current data
    const res = await pool.query("SELECT * FROM deliveries;");
    console.log("📦 Current deliveries table data:", res.rows);

    process.exit();
  } catch (err) {
    console.error("❌ Error inserting sample deliveries:", err);
    process.exit(1);
  }
};

insertSampleDeliveries();
