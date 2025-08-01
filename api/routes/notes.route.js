
import express from "express";
import {
  uploadNote,
  getAllNotes,
  likeNote,
  commentOnNote,
  incrementDownload,
  archiveNote,
  getArchives,
  removeArchiveNote,
} from "../controllers/notes.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import upload from "../utils/multer.js"; // ✅ multer config with memory storage


const router = express.Router();

//Route to upload notes (user/admin)
router.post("/upload", verifyToken, upload.single("file"), uploadNote);

//Archive routes
router.post("/archive/:id", verifyToken, archiveNote);
router.post("/remove-archive/:id", verifyToken, removeArchiveNote);
router.get("/archived/:id", verifyToken, getArchives);

router.get("/", getAllNotes); // Get all notes
// POST /api/notes/:id/like
router.put('/:id/like', verifyToken,likeNote);

router.post("/:id/comment", verifyToken, commentOnNote); // Comment
router.put("/:id/download", incrementDownload); // Increment download count

export default router;









