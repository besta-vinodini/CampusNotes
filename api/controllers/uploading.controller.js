import Note from "../models/uploading.model.js";
import { errorHandler } from "../utils/error.js";
import fs from "fs";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
import https from "https";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Use memory storage instead of disk storage for Railway deployment
const storage = multer.memoryStorage();

// File filter to validate and log incoming files
const fileFilter = (req, file, cb) => {
  // Log incoming file details
  console.log("Processing file:", file.originalname, file.mimetype);
  cb(null, true);
};

// Configure multer with memory storage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = async (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          
          resource_type: "raw", // ✅ explicitly set to raw for binary files like PDFs
          public_id: "notes/"+Date.now(), 
          format: "pdf", // ✅ enforce format
          filename_override: originalname,
         
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(fileBuffer);
  });
};

export const notesUploading = async (req, res, next) => {
  // Set CORS headers for this specific route to ensure they're sent even on error
 
  const allowedOrigins = [
    "https://campusnotes-client.onrender.com",
    "https://campusnotes-backend-ghgi.onrender.com", // backend
  ];
  
  res.header("Access-Control-Allow-Origin", allowedOrigins.includes(req.headers.origin) ? req.headers.origin : "");
  res.header("Access-Control-Allow-Credentials", "true");

  try {
    // Check if we have a file or fileUrl
    let fileUrl = "";
    let fileName = "";
    let fileType = "";

    if (req.file) {
      try {
        console.log("File received, uploading to Cloudinary...");

        // Upload buffer to Cloudinary
        const result = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname
        );

        // Use the Cloudinary result
        fileUrl = result.secure_url;
        fileName = req.file.originalname || "Uploaded File";
        fileType = req.file.mimetype || "application/octet-stream";

        console.log("Cloudinary upload successful:", fileUrl);
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({
          success: false,
          message: "Error uploading file to cloud storage",
        });
      }
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
      fileName = req.body.fileName || "Unnamed from URL";
      fileType = req.body.fileType || "application/octet-stream";
    } else {
      return res.status(400).json({
        success: false,
        message: "No file or file URL provided",
      });
    }

    // Get other form fields with default values if missing
    const title = req.body.title || "";
    const description = req.body.description || "";
    const collegeName = req.body.collegeName || "";
    const courseName = req.body.courseName || "";
    const batch = req.body.batch || "";
    const subjectName = req.body.subjectName || "";
    const semester = req.body.semester || "";
    const uploader = req.body.uploader || req.user?.id; // Fallback to the authenticated user's ID

    // Validate required fields
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!collegeName) missingFields.push("collegeName");
    if (!courseName) missingFields.push("courseName");
    if (!batch) missingFields.push("batch");
    if (!subjectName) missingFields.push("subjectName");
    if (!semester) missingFields.push("semester");
    if (!uploader) missingFields.push("uploader");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Create a new note document
    const uploading = await Note.create({
      title,
      description,
      collegeName,
      courseName,
      batch,
      subjectName,
      semester,
      uploader,
      fileUrl,
      fileName,
      fileType,
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Note uploaded successfully",
      data: uploading,
    });
  } catch (error) {
    console.error("Error uploading note:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error occurred",
    });
  }
};

// Export multer middleware with memory storage
export const uploadMiddleware = upload.single("file");
export const deleteNotes = async (req, res, next) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(errorHandler(404, "Notes not found"));
  }

  if (req.user.id !== note.uploader.toString()) {
    return next(errorHandler(401, "You can only delete your own uploads"));
  }

  try {
    // If the file is on Cloudinary, delete it
    if (note.fileUrl && note.fileUrl.includes("cloudinary.com")) {
      const publicId = note.fileUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json("Notes has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateNotes = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return next(errorHandler(404, "Notes not found"));
    }

    if (req.user.id !== note.uploader.toString()) {
      return next(errorHandler(401, "You can only update your own uploads"));
    }

    // Update file if present
    if (req.file) {
      try {
        // Delete old file if it exists on Cloudinary
        if (note.fileUrl && note.fileUrl.includes("cloudinary.com")) {
          const publicId = note.fileUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }

        // Upload new file to Cloudinary
        const result = await uploadToCloudinary(req.file.path, req.file.originalname);
        console.log("Uploaded file URL",result.secure_url);

        note.fileUrl = result.secure_url;
        note.fileName = req.file.originalname || "Uploaded File";
        note.fileType = req.file.mimetype || "application/octet-stream";
      } catch (cloudinaryError) {
        console.error("Cloudinary update error:", cloudinaryError);
        return res.status(500).json({
          success: false,
          message: "Error updating file in cloud storage",
        });
      }
    } else if (req.body.fileUrl) {
      note.fileUrl = req.body.fileUrl;
      note.fileName = req.body.fileName || "File from URL";
      note.fileType = req.body.fileType || "application/octet-stream";
    }

    // Update other fields
    if (req.body.title) note.title = req.body.title;
    if (req.body.description) note.description = req.body.description;
    if (req.body.subjectName) note.subjectName = req.body.subjectName;
    if (req.body.collegeName) note.collegeName = req.body.collegeName;
    if (req.body.courseName) note.courseName = req.body.courseName;
    if (req.body.batch) note.batch = req.body.batch;
    if (req.body.semester) note.semester = req.body.semester;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    console.error("Detailed error:", error);
    next(error);
  }
};

export const getNotes = async (req, res, next) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(errorHandler(404, "Notes not found"));
  }

  try {
    
   
    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

// Export multer middleware for use in routes

// New function to get all notes with filtering
export const getAllNotes = async (req, res, next) => {
  try {
    const { search, subject, course, semester, college } = req.query;

    // Build filter object
    const filter = {};

    // Add search filter (searches title, description, and subject)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { subjectName: { $regex: search, $options: "i" } },
      ];
    }

    // Add other filters
    if (subject) filter.subjectName = { $regex: subject, $options: "i" };
    if (course) filter.courseName = { $regex: course, $options: "i" };
    if (semester) filter.semester = { $regex: semester, $options: "i" };
    if (college) filter.collegeName = { $regex: college, $options: "i" };

    // Get notes with populated user data
    const notes = await Note.find(filter)
      .populate("uploader", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// Function to download a file
export const downloadNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return next(errorHandler(404, "Note not found"));
    }

    if (!note.fileUrl) {
      return next(errorHandler(404, "File not found for this note"));
    }

    // Set the appropriate headers for download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${note.fileName}"`
    );

    // If you want to set the content type based on the file's type
    if (note.fileType) {
      res.setHeader("Content-Type", note.fileType);
    }

    https
      .get(note.fileUrl, (fileResponse) => {
        // Pipe the file data directly to the response
        fileResponse.pipe(res);

        // Handle any errors in the file download stream
        fileResponse.on("error", (err) => {
          console.error("Error downloading file from Cloudinary:", err);
          next(errorHandler(500, "Error downloading file"));
        });
      })
      .on("error", (err) => {
        console.error("Error connecting to Cloudinary:", err);
        next(errorHandler(500, "Error connecting to file server"));
      });
  } catch (error) {
    console.error("Download error:", error);
    next(error);
  }
};
