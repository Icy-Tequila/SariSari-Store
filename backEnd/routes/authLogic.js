import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";

const router = express.Router();

// ✅ Ensure the users table exists before any signup/login
const ensureUserTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);
    console.log("🛠️ 'users' table checked/created");
  } catch (err) {
    console.error("❌ Error creating users table:", err.message);
  }
};
ensureUserTable();

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hashedPassword,
    ]);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Signup Error:", err.message);
    res.status(500).json({ error: "Internal server error during signup" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const userResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ error: "Internal server error during login" });
  }
});

export default router;
