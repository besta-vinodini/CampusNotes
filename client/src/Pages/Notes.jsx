import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoMdDownload, IoMdShare, IoMdArchive, IoMdEye } from "react-icons/io";
import {
  FaEdit,
  FaTrash,
  FaHeart,
  FaComment,
  FaCheckCircle,
} from "react-icons/fa";

const Notes = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notes, setNotes] = useState(null);
  const [copied, setCopied] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleArchive = async (noteId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/archive/${noteId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Note archived successfully");
      } else {
        alert(data.message || "Failed to archive the note");
      }
    } catch (error) {
      console.error("Error archiving note:", error);
      alert("Something went wrong while archiving");
    }
  };

  const startEditComment = (commentId, commentText) => {
    setEditingCommentId(commentId);
    setEditedCommentText(commentText);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditedCommentText("");
  };

  const saveEditedComment = async (commentId) => {
    if (!editedCommentText.trim()) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/comments/${
          notes._id
        }/${commentId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ text: editedCommentText }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        // Update the comments in state
        setNotes({
          ...notes,
          comments: notes.comments.map((comment) =>
            comment._id === commentId
              ? { ...comment, text: editedCommentText }
              : comment
          ),
        });
        setEditingCommentId(null);
        setEditedCommentText("");
      } else {
        alert(data.message || "Failed to update comment ");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Something went wrong while updating comment ");
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/comments/${
          notes._id
        }/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        // Remove the comment from state
        setNotes({
          ...notes,
          comments: notes.comments.filter(
            (comment) => comment._id !== commentId
          ),
        });
      } else {
        alert(data.message || "Failed to delete comment ");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Something went wrong while deleting comment ");
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/uploading/get/${params.notesId}`
        );
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          return;
        }
        setNotes(data.note);
        setError(false);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [params.notesId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center p-8 rounded-lg bg-white shadow-lg">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-indigo-700">
            Loading Notes...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-white">
        <div className="text-center p-8 rounded-lg bg-white shadow-lg max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-3xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn't load the notes you requested. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!notes) return null;

  return (
    <main className="bg-gradient-to-br from-indigo-50 to-white min-h-screen py-8 px-4 sm:px-6 ">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Top colored banner */}
          <div className="h-16 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

          {/* Title area */}
          <div className="px-6 py-5 sm:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {notes.title}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                {notes.subjectName}
              </span>
              <span>•</span>
              <span>{notes.courseName}</span>
              <span>•</span>
              <span>
                {new Date(notes.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Description */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-indigo-500 rounded mr-3"></span>
                Description
              </h2>
              <div className="bg-gray-50 p-5 rounded-xl mb-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {notes.description}
                </p>
              </div>

              {notes.fileUrl && (
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start mt-6">
                  <a
                    href={notes.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    <IoMdEye className="mr-2" /> View Notes
                  </a>
                  <a
                    href={notes.fileUrl}
                    download
                    className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    <IoMdDownload className="mr-2" /> Download
                  </a>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    <IoMdShare className="mr-2" />{" "}
                    {copied ? "Copied!" : "Share"}
                  </button>
                  <button
                    onClick={() => handleArchive(notes._id)}
                    className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    <IoMdArchive className="mr-2" /> Archive
                  </button>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-indigo-500 rounded mr-3"></span>
                <FaComment className="mr-2" /> Comments ({notes.comments.length}
                )
              </h2>

              {notes.comments.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {notes.comments.map((comment) => (
                    <li
                      key={
                        comment._id || comment.id || Math.random().toString()
                      }
                      className="bg-gray-50 p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium mr-3">
                            {(comment.username || "User")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="font-medium text-sm text-gray-700">
                            {comment.username || "Anonymous User"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              startEditComment(comment._id, comment.text)
                            }
                            className="text-gray-500 hover:text-indigo-600 transition-colors p-1"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteComment(comment._id)}
                            className="text-gray-500 hover:text-red-600 transition-colors p-1"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      {editingCommentId === comment._id ? (
                        <div className="mt-2">
                          <textarea
                            value={editedCommentText}
                            onChange={(e) =>
                              setEditedCommentText(e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            rows="3"
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={cancelEditComment}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveEditedComment(comment._id)}
                              className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700">{comment.text}</p>
                      )}

                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(comment.commentedAt).toLocaleString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right column - Info cards */}
          <div className="space-y-6">
            {/* Stats card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-indigo-500 rounded mr-3"></span>
                Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-4 rounded-xl text-center">
                  <div className="flex items-center justify-center text-indigo-600 mb-1">
                    <FaHeart />
                  </div>
                  <p className="font-bold text-xl text-indigo-700">
                    {notes.likes?.length || 0}
                  </p>
                  <p className="text-xs text-gray-600">Likes</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <div className="flex items-center justify-center text-green-600 mb-1">
                    <IoMdDownload />
                  </div>
                  <p className="font-bold text-xl text-green-700">
                    {notes.downloadCount || 0}
                  </p>
                  <p className="text-xs text-gray-600">Downloads</p>
                </div>
              </div>
              {notes.approved && (
                <div className="mt-4 bg-blue-50 p-3 rounded-xl flex items-center justify-center">
                  <FaCheckCircle className="text-blue-600 mr-2" />
                  <span className="text-blue-700 text-sm font-medium">
                    Approved by Admin
                  </span>
                </div>
              )}
              {!notes.approved && (
                <div className="mt-4 bg-blue-50 p-3 rounded-xl flex items-center justify-center">
                  <span className="yellow-blue-700 text-sm font-medium">
                    Pending Approval
                  </span>
                </div>
              )}
            </div>

            {/* Details card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-indigo-500 rounded mr-3"></span>
                Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between gap-1">
                  <span className="text-gray-600">Subject</span>
                  <span className="font-medium text-gray-800">
                    {notes.subjectName}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-gray-600">Course</span>
                  <span className="font-medium text-gray-800">
                    {notes.courseName}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-gray-600">Semester</span>
                  <span className="font-medium text-gray-800">
                    {notes.semester}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-gray-600">Batch</span>
                  <span className="font-medium text-gray-800">
                    {notes.batch}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-gray-600">College</span>
                  <span className="font-medium text-gray-800">
                    {notes.collegeName}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-gray-600">Uploaded</span>
                  <span className="font-medium text-gray-800">
                    {new Date(notes.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Notes;
