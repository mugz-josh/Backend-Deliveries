// src/utils/dbConnector.ts
import dotenv from "dotenv";

dotenv.config(); // load .env variables

let db: any;

// Detect which database to use based on DB_TYPE
if (process.env.DB_TYPE === "postgres") {
  // Use PostgreSQL connection
  const dbPostgres = require("./dbPostgres").default;
  db = dbPostgres;
  console.log("✅ Using PostgreSQL database");
} else {
  // Default: use MySQL connection
  const dbMysql = require("./db").default;
  db = dbMysql;
  console.log("✅ Using MySQL database");
}

export default db;
