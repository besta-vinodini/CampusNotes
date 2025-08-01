import express from "express";
import {
  notesUploading,
  deleteNotes,
  updateNotes,
  getNotes,
  uploadMiddleware,
} from "../controllers/uploading.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Middleware to check if there's any file content
const ensureFileContent = (req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");

  if (!req.file && !req.body.fileUrl && req.route.path !== "/update/:id") {
    return res.status(400).json({
      success: false,
      message:
        "No file content provided. Please upload a file or provide a file URL.",
    });
  }
  next();
};

// Handle preflight OPTIONS request
router.options("/create", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, credentials"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// Routes
router.post(
  "/create",
  verifyToken,
  uploadMiddleware,
  ensureFileContent,
  notesUploading
);

router.delete("/delete/:id", verifyToken, deleteNotes);

router.post("/update/:id", verifyToken, uploadMiddleware, updateNotes);

// ✅ Fix: Proper route definition for fetching a single note
router.get("/get/:id", getNotes);

export default router;
