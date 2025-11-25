import pool from "./dbPostgres";

const insertSampleSearches = async () => {
  try {
    console.log("⏳ Inserting sample searches...");

    const searches = [
      { name: "Laptop", category: "Electronics", sku: "SKU001", price: 1200.0, image: "", deliveryTime: "3-5 days" },
      { name: "Book", category: "Education", sku: "SKU002", price: 20.0, image: "", deliveryTime: "1-2 days" },
    ];

    for (const s of searches) {
      await pool.query(
        `INSERT INTO searches (name, category, sku, price, image, deliveryTime) VALUES ($1,$2,$3,$4,$5,$6)`,
        [s.name, s.category, s.sku, s.price, s.image, s.deliveryTime]
      );
    }

    console.log("✅ Sample searches inserted!");

    const res = await pool.query("SELECT * FROM searches;");
    console.log("📦 Current searches table data:", res.rows);

    process.exit();
  } catch (err) {
    console.error("❌ Error inserting sample searches:", err);
    process.exit(1);
  }
};

insertSampleSearches();
