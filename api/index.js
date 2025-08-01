import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

// Routers
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import uploadingRouter from "./routes/uploading.route.js";
import notesRouter from "./routes/notes.route.js";
import adminRoutes from "./routes/admin.route.js";

// Middleware
import { verifyToken } from "./utils/verifyUser.js";

// Optional require usage (for ESM compatibility)
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const coreJs = require("core-js");

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

const app = express();

// Define allowed origins
const allowedOrigins = [
 
  "http://localhost:3000", // Local frontend
  "https://campusnotes-client.onrender.com", // Your deployed frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(
  cors({
    origin: [
      "http://localhost:5173",                      
      "https://campusnotes-client.onrender.com"  
    ],
    credentials: true,
  })
);


// --- Middlewares ---
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// For Google Login Popups
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// --- Routes ---
app.get("/", (req, res) => {
  res.send("Hello from Campus Notes API 🚀");
});

// Test CORS endpoint
app.get("/api/test-cors", (req, res) => {
  res.json({ success: true, message: "CORS is working correctly!" });
});

app.use("/api/notes", notesRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/uploading", uploadingRouter);
app.use("/api/admin", adminRoutes);


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// --- Server Listen ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
