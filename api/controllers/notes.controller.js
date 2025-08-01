import Notes from "../models/uploading.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Upload note
export const uploadNote = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { title, subjectName, collegeName, courseName, semester, batch } = req.body;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const streamUpload = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "notes", resource_type: "raw" },
          (error, result) => (result ? resolve(result) : reject(error))
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });

    const result = await streamUpload(req.file.buffer);

    const note = new Notes({
      title,
      subjectName,
      collegeName,
      courseName,
      semester,
      batch,
      fileUrl: result.secure_url,
      uploader: req.user.id,
    });

    await note.save();

    res.status(201).json({ success: true, message: "Note uploaded successfully", note });
  } catch (error) {
    console.error("Upload failed:", error.message);
    next(error);
  }
};

// Archive note
export const archiveNote = async (req, res, next) => {
  try {
    const { id: noteId } = req.params;
    const userId = req.user.id;

    const note = await Notes.findById(noteId);
    if (!note) return next(errorHandler(404, "Note not found"));

    const user = await User.findById(userId);
    if (!user.archivedNotes.includes(noteId)) {
      user.archivedNotes.push(noteId);
      await user.save();
    }

    res.status(200).json({ success: true, message: "Note archived successfully" });
  } catch (error) {
    next(error);
  }
};

// Remove from archive
export const removeArchiveNote = async (req, res, next) => {
  try {
    const { id: noteId } = req.params;

    const note = await Notes.findById(noteId);
    if (!note) return next(errorHandler(404, "Note not found"));

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { archivedNotes: noteId },
    });

    res.status(200).json({ success: true, message: "Note removed from archive." });
  } catch (error) {
    next(error);
  }
};

// Get user's archived notes
export const getArchives = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("archivedNotes");
    res.status(200).json(user.archivedNotes);
  } catch (error) {
    next(error);
  }
};

// Get all notes (with filters)
export const getAllNotes = async (req, res, next) => {
  try {
    const { search, subject, college, semester, course, batch } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { subjectName: new RegExp(search, "i") },
        { collegeName: new RegExp(search, "i") },
        { courseName: new RegExp(search, "i") },
      ];
    }

    if (subject) query.subjectName = subject;
    if (college) query.collegeName = college;
    if (semester) query.semester = semester;
    if (course) query.courseName = course;
    if (batch) query.batch = batch;

    const notes = await Notes.find(query)
      .populate("uploader", "username avatar")
      .populate("comments.user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notes });
  } catch (err) {
    next(err);
  }
};

// Like/unlike a note
export const likeNote = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.id;

  try {
    const note = await Notes.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const isLiked = note.likes.includes(userId);

    if (isLiked) {
      // remove like
      note.likes = note.likes.filter(id => id.toString() !== userId);
    } else {
      // add like
      note.likes.push(userId);
    }

    await note.save();
    res.status(200).json({ success: true, likes: note.likes.length });
  } catch (err) {
    console.error("Error in likeNote:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a comment
export const commentOnNote = async (req, res, next) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (!req.body.text || req.body.text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required." });
    }

    const comment = {
      user: req.user.id,
      text: req.body.text.trim(),
      commentedAt: new Date(),
    };

    note.comments.push(comment);
    await note.save();

    const updatedNote = await Notes.findById(req.params.id).populate("comments.user", "username");

    res.status(200).json({ success: true, comments: updatedNote.comments });
  } catch (err) {
    next(err);
  }
};

// Track downloads
export const incrementDownload = async (req, res, next) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.downloadCount += 1;
    await note.save();

    res.status(200).json({ success: true, downloadCount: note.downloadCount });
  } catch (err) {
    next(err);
  }
};
