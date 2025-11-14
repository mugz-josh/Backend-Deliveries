const { pool } = require('./db');

const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()'); // simple query to test connection
    console.log('Database connection is working. Current time:', result.rows[0]);
    process.exit(0); // exit successfully
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // exit with failure
  }
};

testConnection();
