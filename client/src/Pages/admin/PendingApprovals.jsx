// src/components/admin/PendingApprovals.jsx
import { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle, Trash2 } from "lucide-react";

const PendingApprovals = () => {
  const [pendingNotes, setPendingNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);

  useEffect(() => {
    fetchPendingNotes();
  }, []);

  const fetchPendingNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/notes/pending`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pending notes");
      }

      const data = await response.json();
      setPendingNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (noteId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/notes/${noteId}/review`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ approved: true }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve note");
      }

      // Remove from pending list
      setPendingNotes(pendingNotes.filter((note) => note._id !== noteId));

      if (viewingNote && viewingNote._id === noteId) {
        setViewingNote(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/notes/${noteId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete note");
        }

        // Remove from pending list
        setPendingNotes(pendingNotes.filter((note) => note._id !== noteId));

        if (viewingNote && viewingNote._id === noteId) {
          setViewingNote(null);
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading pending notes...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Pending Approvals</h2>
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
          {pendingNotes.length} Notes Pending
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">{error}</div>
      )}

      {viewingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{viewingNote.title}</h3>
                <button
                  onClick={() => setViewingNote(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{viewingNote.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">College</p>
                  <p className="font-medium">{viewingNote.collegeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Uploaded By</p>
                  <p className="font-medium">
                    {viewingNote.uploader?.username || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Uploaded Date</p>
                  <p className="font-medium">
                    {new Date(viewingNote.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500">Description</p>
                <p className="mt-1">
                  {viewingNote.description || "No description provided"}
                </p>
              </div>

              {viewingNote.fileUrl && (
                <div className="mt-6">
                  <a
                    href={viewingNote.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Download Note
                  </a>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => handleApprove(viewingNote._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(viewingNote._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {pendingNotes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-lg text-gray-600">No notes pending approval!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingNotes.map((note) => (
            <div
              key={note._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 truncate">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {note.subject} • {note.collegeName}
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {note.description || "No description provided"}
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Uploaded by: {note.uploader?.username || "Unknown"}</p>
                  <p>Date: {new Date(note.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setViewingNote(note)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleApprove(note._id)}
                    className="p-2 text-green-600 hover:text-green-800"
                    title="Approve"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleReject(note._id)}
                    className="p-2 text-red-600 hover:text-red-800"
                    title="Reject"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
