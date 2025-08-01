
import mongoose from "mongoose";

// Sub-schema for comments
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  commentedAt: {
    type: Date,
    default: Date.now,
  },
});

// Main Notes schema
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },

    // ✅ Fixed likes field
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ✅ Download count
    downloadCount: {
      type: Number,
      default: 0,
    },

    // ✅ Admin approval
    approved: {
      type: Boolean,
      default: false,
    },

    // ✅ Comments
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Notes = mongoose.model("Notes", noteSchema);
export default Notes;
