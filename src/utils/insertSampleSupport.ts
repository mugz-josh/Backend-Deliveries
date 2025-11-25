import pool from "./dbPostgres";

const insertSampleSupport = async () => {
  try {
    console.log("⏳ Inserting sample support submissions...");

    const submissions = [
      { name: "Alice Johnson", email: "alice@example.com", phone: "1234567890", amount: 100, message: "Need help with delivery" },
      { name: "Bob Smith", email: "bob@example.com", phone: "0987654321", amount: 50, message: "Query about payment" },
    ];

    for (const s of submissions) {
      await pool.query(
        `INSERT INTO support_submissions (name, email, phone, amount, message) VALUES ($1,$2,$3,$4,$5)`,
        [s.name, s.email, s.phone, s.amount, s.message]
      );
    }

    console.log("✅ Sample support submissions inserted!");

    const res = await pool.query("SELECT * FROM support_submissions;");
    console.log("📦 Current support_submissions table data:", res.rows);

    process.exit();
  } catch (err) {
    console.error("❌ Error inserting sample support submissions:", err);
    process.exit(1);
  }
};

insertSampleSupport();
