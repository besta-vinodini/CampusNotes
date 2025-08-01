import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Profile from "./Pages/Profile";
import Signout from "./Pages/Signup.jsx";
import About from "./Pages/About";
import Signup from "./Pages/Signup.jsx";
import Header from "./components/Header.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import UploadingNotes from "./Pages/CreateUploading.jsx";
import UpdateNotes from "./Pages/UpdateNotes.jsx";
import Notes from "./Pages/Notes.jsx";
import BrowseNotes from "./Pages/BrowseNotes.jsx";

import AdminLayout from "./Pages/admin/AdminLayout.jsx";
import Dashboard from "./Pages/admin/Dashboard.jsx";
import UsersManagement from "./Pages/admin/UsersManagement.jsx";
import NotesManagement from "./Pages/admin/NotesManagement.jsx";
import PendingApprovals from "./Pages/admin/PendingApprovals.jsx";
import CollegeManagement from "./Pages/admin/CollegeManagement.jsx";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const App = () => {
  // Get user and loading state from Redux store
  const { currentUser: user, loading } = useSelector((state) => state.user);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading)
      return (
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      );

    if (!user) {
      return <Navigate to="/signin" />;
    }

    if (user.role !== "admin") {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>

        <Route path="/sign-in" element={<Signin />}></Route>
        <Route path="/sign-up" element={<Signup />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/browse" element={<BrowseNotes />}></Route>
        <Route element={<PrivateRoute />}>
          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="notes" element={<NotesManagement />} />
            <Route path="pending" element={<PendingApprovals />} />
            <Route path="colleges" element={<CollegeManagement />} />
          </Route>

          {/* Redirect root to admin dashboard if admin is logged in */}
          <Route
            path="/"
            element={
              loading ? (
                <div className="flex justify-center items-center h-screen">
                  Loading...
                </div>
              ) : user && user.role === "admin" ? (
                <Navigate to="/admin-dashboard" />
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route path="/notes/:notesId" element={<Notes />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/uploading-notes" element={<UploadingNotes />}></Route>
          <Route
            path="/update-notes/:updateId"
            element={<UpdateNotes />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
