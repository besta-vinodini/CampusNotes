// src/components/admin/NotesManagement.jsx
import { useState, useEffect } from "react";
import {
  Eye,
  Download,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react";

const NotesManagement = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");
  const [colleges, setColleges] = useState([]);
  const [viewingNote, setViewingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/notes`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();
      setNotes(data);

      // Extract unique colleges
      const uniqueColleges = [
        ...new Set(data.map((note) => note.collegeName)),
      ].filter(Boolean);
      setColleges(uniqueColleges);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
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

        // Remove note from list
        setNotes(notes.filter((note) => note._id !== noteId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleApproveReject = async (noteId, approved) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/notes/${noteId}/review`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ approved }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update note status");
      }

      const updatedNote = await response.json();

      // Update note in list
      setNotes(notes.map((note) => (note._id === noteId ? updatedNote : note)));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.uploader?.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCollege = collegeFilter
      ? note.collegeName === collegeFilter
      : true;

    return matchesSearch && matchesCollege;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading notes...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Notes Management</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
          >
            <option value="">All Colleges</option>
            {colleges.map((college) => (
              <option key={college} value={college}>
                {college}
              </option>
            ))}
          </select>
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
                  <p className="text-sm text-gray-500">Download Count</p>
                  <p className="font-medium">
                    {viewingNote.downloadCount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p
                    className={`font-medium ${
                      viewingNote.approved
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {viewingNote.approved ? "Approved" : "Pending Approval"}
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
                    <Download className="h-4 w-4 mr-2" />
                    Download Note
                  </a>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                {!viewingNote.approved && (
                  <button
                    onClick={() => {
                      handleApproveReject(viewingNote._id, true);
                      setViewingNote({ ...viewingNote, approved: true });
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
                {viewingNote.approved && (
                  <button
                    onClick={() => {
                      handleApproveReject(viewingNote._id, false);
                      setViewingNote({ ...viewingNote, approved: false });
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Set to Pending
                  </button>
                )}
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this note?"
                      )
                    ) {
                      handleDeleteNote(viewingNote._id);
                      setViewingNote(null);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  College
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploader
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <tr key={note._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {note.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {note.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {note.collegeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {note.uploader?.username || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          note.approved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {note.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {note.downloadCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewingNote(note)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {!note.approved ? (
                          <button
                            onClick={() => handleApproveReject(note._id, true)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApproveReject(note._id, false)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Set to Pending"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No notes found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NotesManagement;
