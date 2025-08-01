// src/components/admin/CollegeManagement.jsx
import React from 'react';
import { useState, useEffect } from "react";
import { FileText, Search } from "lucide-react";

const CollegeManagement = () => {
  const [collegeData, setCollegeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(null);

  useEffect(() => {
    // Fetch all notes and group by college
    const fetchColleges = async () => {
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

        const notesData = await response.json();

        // Group notes by college
        const collegeMap = {};

        notesData.forEach((note) => {
          if (!note.collegeName) return;

          if (!collegeMap[note.collegeName]) {
            collegeMap[note.collegeName] = {
              name: note.collegeName,
              totalNotes: 0,
              approvedNotes: 0,
              pendingNotes: 0,
              totalDownloads: 0,
            };
          }

          collegeMap[note.collegeName].totalNotes++;

          if (note.approved) {
            collegeMap[note.collegeName].approvedNotes++;
          } else {
            collegeMap[note.collegeName].pendingNotes++;
          }

          collegeMap[note.collegeName].totalDownloads +=
            note.downloadCount || 0;
        });

        setCollegeData(Object.values(collegeMap));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const handleCollegeClick = async (collegeName) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/notes/college/${encodeURIComponent(collegeName)}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch college notes");
      }

      const collegeNotes = await response.json();
      setSelectedCollege({
        name: collegeName,
        notes: collegeNotes,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredColleges = collegeData.filter((college) =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !selectedCollege)
    return (
      <div className="flex justify-center items-center h-64">
        Loading college data...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedCollege
            ? `Notes from ${selectedCollege.name}`
            : "College Management"}
        </h2>

        {selectedCollege ? (
          <button
            onClick={() => setSelectedCollege(null)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Back to All Colleges
          </button>
        ) : (
          <div className="relative">
            <input
              type="text"
              placeholder="Search colleges..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">{error}</div>
      )}

      {selectedCollege ? (
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
                    Uploader
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedCollege.notes.length > 0 ? (
                  selectedCollege.notes.map((note) => (
                    <tr key={note._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {note.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {note.subject}
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No notes found for this college
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.length > 0 ? (
            filteredColleges.map((college) => (
              <div
                key={college.name}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => handleCollegeClick(college.name)}
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3
                        className="text-lg font-medium text-gray-900 truncate"
                        title={college.name}
                      >
                        {college.name}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Notes</p>
                      <p className="font-bold text-gray-900">
                        {college.totalNotes}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Downloads</p>
                      <p className="font-bold text-gray-900">
                        {college.totalDownloads}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Approved</p>
                      <p className="font-bold text-green-600">
                        {college.approvedNotes}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pending</p>
                      <p className="font-bold text-yellow-600">
                        {college.pendingNotes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 bg-white p-8 rounded-lg shadow text-center">
              <p className="text-lg text-gray-600">
                No colleges found matching your search
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollegeManagement;
