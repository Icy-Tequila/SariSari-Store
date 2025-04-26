// Import 'pg' (PostgreSQL client) and 'dotenv' to handle environment variables
import pkg from "pg";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Destructure Pool from the pg package (because pg is a CommonJS module)
const { Pool } = pkg;

// Create a new PostgreSQL connection pool using environment variables
const pool = new Pool({
  host: process.env.DB_HOST, // DB host (e.g., localhost)
  port: Number(process.env.DB_PORT), // DB port (converted from string to number)
  user: process.env.DB_USER, // DB username
  password: process.env.DB_PASS, // DB password
  database: process.env.DB_DATABASE, // DB name
});

// Function to test and verify the database connection
const testConnection = async () => {
  try {
    // Get a client from the pool
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL successfully!");

    // Run a simple query to test the connection
    const res = await client.query("SELECT NOW()");
    console.log("📅 Current timestamp:", res.rows[0]);

    // Release the client back to the pool
    client.release();
  } catch (error) {
    // Log any connection errors
    console.error("❌ Database connection error:", error.message);
  }
};

// Run the test connection function immediately
testConnection();

// Export the pool to use it in other parts of the app (e.g., for queries)
export default pool;
