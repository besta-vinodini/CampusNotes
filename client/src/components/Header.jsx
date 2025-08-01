import React, { useState } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (currentUser?.role === "admin") return null;

  return (
    <header className="bg-gradient-to-r from-slate-100 to-slate-200 shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Desktop Navigation */}
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="font-bold text-xl md:text-2xl flex items-center transition-transform hover:scale-105">
              <span className="text-slate-600">Campus</span>
              <span className="text-blue-600">Notes</span>
              <span className="ml-1 text-blue-500 text-xs md:text-sm bg-blue-100 px-2 py-1 rounded-full">
                Pro
              </span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {currentUser && (
              <Link to="/profile" className="mr-4">
                <img
                  className="rounded-full h-8 w-8 object-cover border-2 border-blue-500 shadow-sm"
                  src={currentUser.avatar}
                  alt="profile"
                />
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="text-slate-700 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/">
              <div className="text-slate-700 font-medium hover:text-blue-600 transition-colors">
                Home
              </div>
            </Link>
            <Link to="/about">
              <div className="text-slate-700 font-medium hover:text-blue-600 transition-colors">
                About
              </div>
            </Link>
            <Link to="/profile">
              {currentUser ? (
                <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200 hover:shadow-md transition-all">
                  <span className="text-slate-700 font-medium">
                    {currentUser.name || "Profile"}
                  </span>
                  <img
                    className="rounded-full h-8 w-8 object-cover "
                    src={currentUser.avatar}
                    alt=""
                  />
                </div>
              ) : (
                <div className="bg-blue-600 text-white font-medium px-4 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-sm hover:shadow">
                  Sign in
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white mt-3 rounded-lg shadow-lg border border-slate-100 overflow-hidden transition-all duration-300">
            <nav className="flex flex-col">
              <Link to="/" onClick={toggleMenu}>
                <div className="py-3 px-4 border-b border-slate-100 text-slate-700 hover:bg-slate-50 transition-colors">
                  Home
                </div>
              </Link>
              <Link to="/about" onClick={toggleMenu}>
                <div className="py-3 px-4 border-b border-slate-100 text-slate-700 hover:bg-slate-50 transition-colors">
                  About
                </div>
              </Link>
              {!currentUser && (
                <Link to="/profile" onClick={toggleMenu}>
                  <div className="py-3 px-4 text-blue-600 font-medium hover:bg-blue-50 transition-colors">
                    Sign in
                  </div>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
