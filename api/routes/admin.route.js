// routes/admin.routes.js
import express from "express";
import { verifyAdmin } from "../utils/verifyUser.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllNotes,
  getPendingNotes,
  reviewNote,
  deleteNote,
  getSiteStats,
  getNotesByCollege,
} from "../controllers/admin.controller.js";

const router = express.Router();

// User management routes
router.get("/users", verifyAdmin, getAllUsers);
router.get("/users/:id", verifyAdmin, getUserById);
router.put("/users/:id", verifyAdmin, updateUser);
router.delete("/users/:id", verifyAdmin, deleteUser);

router.get("/notes", verifyAdmin, getAllNotes);
router.get("/notes/pending", verifyAdmin, getPendingNotes);
router.put("/notes/:id/review", verifyAdmin, reviewNote);
router.delete("/notes/:id", verifyAdmin, deleteNote);

router.get("/stats", verifyAdmin, getSiteStats);
router.get("/notes/college/:collegeName", verifyAdmin, getNotesByCollege);

export default router;
