// src/components/admin/Header.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  signOutUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../../redux/user/userSlice";
import { useSelector } from "react-redux";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [adminInfo, setAdminInfo] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user); // Get user from Redux store

  useEffect(() => {
    // Get admin info from local storage or state management
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setAdminInfo(user);
  }, []);

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

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 ml-2 md:ml-0">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none">
              <Bell className="h-6 w-6" />
            </button>

            <div className="relative">
              <div className="flex items-center">
                <button className="flex text-sm rounded-full focus:outline-none">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                    <User className="h-5 w-5" />
                  </div>
                </button>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700">
                    {adminInfo.username || "Admin"}
                  </p>
                  <button
                    onClick={handleSignOut}
                    className="text-xs text-gray-500 hover:text-red-500"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
