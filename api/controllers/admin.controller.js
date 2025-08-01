import User from "../models/user.model.js";
import Notes from "../models/uploading.model.js";
import { errorHandler } from "../utils/error.js";

// Get all users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        errorHandler(403, "Access denied: Admin privileges required")
      );
    }

    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get user by ID (admin only)
export const getUserById = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        errorHandler(403, "Access denied: Admin privileges required")
      );
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update user (admin only)
export const updateUser = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        errorHandler(403, "Access denied: Admin privileges required")
      );
    }

    const { username, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        errorHandler(403, "Access denied: Admin privileges required")
      );
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    await Notes.deleteMany({ uploader: req.params.id });

    res.status(200).json({
      message: "User and all associated content deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get all notes (admin only)
export const getAllNotes = async (req, res, next) => {
  try {
    // console.log(req.user);
    if (req.user.role !== "admin") {
      return next(
        errorHandler(403, "Access denied: Admin privileges required")
      );
    }

    const notes = await Notes.find().populate("uploader", "username email");
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

// Get pending approval notes (admin only)
export const getPendingNotes = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        errorHandler(403, "Access denied: Admin privileges required")
      );
    }

    const pendingNotes = await Notes.find({ approved: false }).populate(
      "uploader",
      "username email"
    );
    res.status(200).json(pendingNotes);
  } catch (error) {
    next(error);
  }
};

// Approve or reject note (admin only)
export const reviewNote = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        errorHandler(403, "Access denied: Admin privileges required")
      );
    }

    const { approved } = req.body;
    const updatedNote = await Notes.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true }
    );

    if (!updatedNote) {
      return next(errorHandler(404, "Note not found"));
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// Delete note (admin only)
export const deleteNote = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        errorHandler(403, "Access denied: Admin privileges required")
      );
    }

    const note = await Notes.findByIdAndDelete(req.params.id);
    if (!note) {
      return next(errorHandler(404, "Note not found"));
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get site statistics (admin only)
export const getSiteStats = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        errorHandler(403, "Access denied: Admin privileges required")
      );
    }

    const totalUsers = await User.countDocuments();
    const totalNotes = await Notes.countDocuments();
    const pendingApprovals = await Notes.countDocuments({ approved: false });
    const totalDownloads = await Notes.aggregate([
      { $group: { _id: null, total: { $sum: "$downloadCount" } } },
    ]);

    const mostDownloadedNotes = await Notes.find()
      .sort({ downloadCount: -1 })
      .limit(5)
      .populate("uploader", "username");

    res.status(200).json({
      totalUsers,
      totalNotes,
      pendingApprovals,
      totalDownloads: totalDownloads[0]?.total || 0,
      mostDownloadedNotes,
    });
  } catch (error) {
    next(error);
  }
};

// Get notes by college (admin filter)
export const getNotesByCollege = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        errorHandler(403, "Access denied: Admin privileges required")
      );
    }

    const { collegeName } = req.params;
    const notes = await Notes.find({ collegeName }).populate(
      "uploader",
      "username email"
    );
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};
