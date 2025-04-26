// Import required modules
import express from "express";
import cors from "cors";
import authLogic from "./routes/authLogic.js"; // Custom route handler
import "./config/db.js"; // Triggers DB connection on app startup
import productLogic from "./routes/newProductLogic.js";

// Create Express app instance
const app = express();

// Set the server port
const PORT = 5000;

// CORS configuration to allow requests from your React frontend
const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL (Vite default)
  credentials: true, // Allows cookies/session if needed
};

// Apply middlewares
app.use(cors(corsOptions)); // Enable CORS with specified options
app.use(express.json()); // Parse incoming JSON bodies

// API routes
app.use("/api/auth", authLogic); // All auth-related routes prefixed with /api/auth

// to call this use http://localhost:5000/api/products
app.use("/api/products", productLogic);

app.use("/uploads", express.static("public/uploads"));

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
