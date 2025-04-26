import express from "express";
import multer from "multer";
import pool from "../config/db.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/uploads";
    fs.mkdirSync(uploadDir, { recursive: true }); // Ensure folder exists
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// Create table if not exists
const createTableIfNotExists = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_table (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price NUMERIC NOT NULL,
      stock INTEGER NOT NULL,
      image TEXT
    );
  `);
};

// POST route with file upload
router.post("/add", upload.single("image"), async (req, res) => {
  const { name, description, price, stock } = req.body;
  const image = req.file?.filename;

  try {
    await createTableIfNotExists();
    await pool.query(
      "INSERT INTO product_table (name, description, price, stock, image) VALUES ($1, $2, $3, $4, $5)",
      [name, description, price, stock, image]
    );
    res.status(201).json({ message: "✅ Product added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all products
router.get("/all", async (req, res) => {
  try {
    await createTableIfNotExists();
    const result = await pool.query("SELECT * FROM product_table");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
