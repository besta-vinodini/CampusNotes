import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  signInFailure,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [showUploadsError, setShowUploadsErrors] = useState(false);
  const [userUploads, setUserUploads] = useState([]);
  const [archivedNotes, setarchivedNotes] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);
  
  const handleFileUpload = async (file) => {
    const form = new FormData();
    form.append("avatar", file);
    form.append("username", formData.username || currentUser.username);
    form.append("email", formData.email || currentUser.email);
    if (formData.password) form.append("password", formData.password);

    try {
      dispatch(updateUserStart());

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          body: form,
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok || data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:`Bearer ${import.meta.env.JWT_SECRET}`,
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/delete/${currentUser._id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(updateUserFailure(error.message));
      }
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signout`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowUploads = async () => {
    setActiveTab("uploads");
    try {
      setShowUploadsErrors(false);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/uploads/${currentUser._id}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success === false) {
        setShowUploadsErrors(true);
        return;
      }
      setUserUploads(data);
    } catch (error) {
      setShowUploadsErrors(true);
    }
  };

  const handleArchive = async () => {
    setActiveTab("archived");
    try {
      setShowUploadsErrors(false);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/archived/${currentUser._id}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success === false) {
        setShowUploadsErrors(true);
        return;
      }
      setarchivedNotes(data);
    } catch (error) {
      setShowUploadsErrors(true);
    }
  };

  const handleRemoveArchive = async (noteId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/remove-archive/${noteId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          credentials: "include", 
        }
      );
      const data = await res.json();
      if (data.success === false) {
        console.error("Failed to remove from archive:", data.message);
        return;
      }
      setarchivedNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (error) {
      console.log("Error removing archived note:", error.message);
    }
  };

  const handleNotesDelete = async (uploadingId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/uploading/delete/${uploadingId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setUserUploads((prev) =>
          prev.filter((uploads) => uploads._id !== uploadingId)
        );
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <h1 className="text-4xl font-bold text-indigo-900 text-center md:text-left">
            My Dashboard
          </h1>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 flex items-center gap-2 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-t-xl shadow-md mb-1">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-4 px-6 text-center font-medium transition duration-300 ${
                activeTab === "profile"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </div>
            </button>
            <button
              onClick={handleShowUploads}
              className={`flex-1 py-4 px-6 text-center font-medium transition duration-300 ${
                activeTab === "uploads"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                My Uploads
              </div>
            </button>
            <button
              onClick={handleArchive}
              className={`flex-1 py-4 px-6 text-center font-medium transition duration-300 ${
                activeTab === "archived"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                Saved Notes
              </div>
            </button>
          </div>
        </div>

        {/* Content Based on Active Tab */}
        <div className="bg-white rounded-b-xl shadow-lg p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="relative">
                <img
                  onClick={() => fileRef.current.click()}
                  src={
                    currentUser.avatar
                    ? currentUser.avatar
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                    alt=""
                    className="rounded-full h-40 w-40 object-cover cursor-pointer border-4 border-indigo-200 shadow-md transition duration-300 hover:border-indigo-400"
                  />
                  <div
                    className="absolute bottom-2 right-2 bg-indigo-600 rounded-full p-2 shadow-md cursor-pointer hover:bg-indigo-700 transition"
                    onClick={() => fileRef.current.click()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  ref={fileRef}
                  hidden
                  accept="image/*"
                />
                <h2 className="mt-4 text-xl font-semibold text-gray-800">
                  {currentUser.username}
                </h2>
                <p className="text-gray-500">
                  Member since{" "}
                  {new Date(
                    currentUser.createdAt || Date.now()
                  ).toLocaleDateString()}
                </p>

                <Link
                  to="/uploading-notes"
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg text-center font-medium shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload New Notes
                </Link>

                <button
                  onClick={handleDeleteUser}
                  className="mt-4 text-red-500 text-sm hover:text-red-700 transition duration-300 flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Account
                </button>
              </div>

              <div className="w-full md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Account Settings
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Username"
                      defaultValue={currentUser.username}
                      id="username"
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Change Password
                    </label>
                    <input
                      type="password"
                      placeholder="New Password"
                      id="password"
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition duration-300"
                  >
                    Update Profile
                  </button>

                  {updateSuccess && (
                    <div className="mt-3 p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Profile updated successfully!
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Uploaded Notes Tab */}
          {activeTab === "uploads" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  My Uploaded Notes
                </h3>
                <Link
                  to="/uploading-notes"
                  className="bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New
                </Link>
              </div>

              {showUploadsError && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
                  There was an error loading your uploads.
                </div>
              )}

              {userUploads.length === 0 ? (
                <div className="text-center py-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-gray-500">
                    You haven't uploaded any notes yet.
                  </p>
                  <Link
                    to="/uploading-notes"
                    className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                  >
                    Upload Your First Note
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userUploads.map((upload) => (
                    <div
                      key={upload._id}
                      className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
                    >
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 flex justify-center">
                        <Link to={`/notes/${upload._id}`}>
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                            alt="Notes Icon"
                            className="h-20"
                          />
                        </Link>
                      </div>
                      <div className="p-4">
                        <Link
                          to={`/notes/${upload._id}`}
                          className="block text-lg font-semibold text-gray-800 truncate hover:text-indigo-600 transition"
                        >
                          {upload.title}
                        </Link>
                        <p className="text-gray-500 text-sm mt-1">
                          {new Date(
                            upload.createdAt || Date.now()
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="border-t px-4 py-3 bg-gray-50 flex justify-between items-center">
                        <button
                          onClick={() => handleNotesDelete(upload._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                        <Link
                          to={`/update-notes/${upload._id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Archived Notes Tab */}
          {activeTab === "archived" && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Saved Notes
              </h3>

              {showUploadsError && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
                  There was an error loading your saved notes.
                </div>
              )}

              {archivedNotes.length === 0 ? (
                <div className="text-center py-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <p className="text-gray-500">
                    You don't have any saved notes yet.
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    When you save notes, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {archivedNotes.map((upload) => (
                    <div
                      key={upload._id}
                      className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
                    >
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-center">
                        <Link to={`/notes/${upload._id}`}>
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                            alt="Notes Icon"
                            className="h-20"
                          />
                        </Link>
                      </div>
                      <div className="p-4">
                        <Link
                          to={`/notes/${upload._id}`}
                          className="block text-lg font-semibold text-gray-800 truncate hover:text-emerald-600 transition"
                        >
                          {upload.title}
                        </Link>
                        <p className="text-gray-500 text-sm mt-1">
                          {new Date(
                            upload.createdAt || Date.now()
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="border-t px-4 py-3 bg-gray-50 flex">
                        <Link
                          to={`/notes/${upload._id}`}
                          className="w-full block text-center text-emerald-600 hover:text-emerald-800 text-sm font-medium transition"
                        >
                          View Note
                        </Link>
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault(); // Prevents default Link behavior (navigation)
                            handleRemoveArchive(upload._id); // Calls the function when clicked
                          }}
                          className="w-full block text-center text-red-600 hover:text-red-800 text-sm font-medium transition"
                        >
                          Remove Note
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
