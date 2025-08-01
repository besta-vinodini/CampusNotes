import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    const isLoggedIn = !!localStorage.getItem("token");

    if (isLoggedIn) {
      navigate("/uploading-notes");
    } else {
      navigate("/signin"); // redirect to sign in page
    }
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section - Modern gradient background */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 sm:py-36 overflow-hidden">
        {/* Abstract geometric shapes for visual interest */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-yellow-400"></div>
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-blue-400"></div>
          <div className="absolute bottom-10 left-1/3 w-32 h-32 rounded-full bg-purple-500"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Share & Discover{" "}
              <span className="text-yellow-400">Academic Notes</span> Easily!
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Your go-to platform to upload, download, and share academic notes
              across multiple colleges and courses!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link to="/uploading-notes">
                <button
                  onClick={handleUploadClick}
                  className="w-full sm:w-auto cursor-pointer bg-yellow-500 text-gray-900 py-4 px-8 rounded-lg hover:bg-yellow-400 transition duration-300 font-semibold text-lg shadow-lg transform hover:-translate-y-1"
                >
                  Upload Notes
                </button>
              </Link>
              <Link to="/browse">
                <button className="w-full sm:w-auto cursor-pointer bg-transparent border-2 border-white text-white py-4 px-8 rounded-lg hover:bg-white hover:text-blue-800 transition duration-300 font-semibold text-lg shadow-lg transform hover:-translate-y-1">
                  Browse Notes
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave shape divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-12 sm:h-16 text-white fill-current"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,150.5,82.93,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* How It Works - Card-based layout with icons */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-blue-50 rounded-xl shadow-lg border-t-4 border-blue-500 transform transition duration-300 hover:scale-105">
              <div className="flex items-center justify-center bg-blue-500 text-white w-12 h-12 rounded-full text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Notes</h3>
              <p className="text-gray-600">
                Share your study materials with fellow students easily and
                quickly.
              </p>
            </div>

            <div className="p-6 bg-green-50 rounded-xl shadow-lg border-t-4 border-green-500 transform transition duration-300 hover:scale-105">
              <div className="flex items-center justify-center bg-green-500 text-white w-12 h-12 rounded-full text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Verified</h3>
              <p className="text-gray-600">
                Our team verifies the quality of the notes to ensure
                authenticity and accuracy.
              </p>
            </div>

            <div className="p-6 bg-orange-50 rounded-xl shadow-lg border-t-4 border-orange-500 transform transition duration-300 hover:scale-105">
              <div className="flex items-center justify-center bg-orange-500 text-white w-12 h-12 rounded-full text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Reach Students</h3>
              <p className="text-gray-600">
                Students across colleges can access your notes and benefit from
                them.
              </p>
            </div>

            <div className="p-6 bg-purple-50 rounded-xl shadow-lg border-t-4 border-purple-500 transform transition duration-300 hover:scale-105">
              <div className="flex items-center justify-center bg-purple-500 text-white w-12 h-12 rounded-full text-xl font-bold mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Download & Learn</h3>
              <p className="text-gray-600">
                Download verified notes and boost your exam preparation
                instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use CampusNotes? - Modern vertical card layout */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Use CampusNotes?
            </h2>
            <div className="h-1 w-24 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white text-gray-800 rounded-xl shadow-xl p-6 transform transition duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                ✓
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Verified Quality Notes
              </h3>
              <p className="text-gray-600">
                All notes are verified by our team for authenticity and quality
                standards.
              </p>
            </div>

            <div className="bg-white text-gray-800 rounded-xl shadow-xl p-6 transform transition duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                $
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Downloads</h3>
              <p className="text-gray-600">
                All notes are available for free, just download and start
                studying anytime.
              </p>
            </div>

            <div className="bg-white text-gray-800 rounded-xl shadow-xl p-6 transform transition duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-4">
                ★
              </div>
              <h3 className="text-xl font-semibold mb-2">Peer Reviews</h3>
              <p className="text-gray-600">
                Notes can be liked and reviewed by peers to ensure relevance and
                quality.
              </p>
            </div>

            <div className="bg-white text-gray-800 rounded-xl shadow-xl p-6 transform transition duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                👤
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin Approval</h3>
              <p className="text-gray-600">
                Admin ensures that every note meets our quality standards before
                publishing.
              </p>
            </div>

            <div className="bg-white text-gray-800 rounded-xl shadow-xl p-6 transform transition duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                ❤
              </div>
              <h3 className="text-xl font-semibold mb-2">User Interactions</h3>
              <p className="text-gray-600">
                Engage with other students through comments and likes on shared
                notes.
              </p>
            </div>

            <div className="bg-white text-gray-800 rounded-xl shadow-xl p-6 transform transition duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                👥
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Collaborative Learning
              </h3>
              <p className="text-gray-600">
                Join a community of learners by sharing feedback and building
                connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Animated counters with modern cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Growing Community
            </h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-blue-500 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                300+
              </h3>
              <p className="text-gray-600 font-medium">Notes Shared</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-green-500 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                200+
              </h3>
              <p className="text-gray-600 font-medium">Students Helped</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-purple-500 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                10+
              </h3>
              <p className="text-gray-600 font-medium">Colleges Covered</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-yellow-500 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-yellow-600 mb-2">
                500+
              </h3>
              <p className="text-gray-600 font-medium">Total Likes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Modern testimonial cards */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Students Are Saying
            </h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm relative">
              <div className="absolute -top-5 left-6 text-6xl text-blue-200">
                "
              </div>
              <p className="text-gray-700 relative z-10 italic mb-6">
                CampusNotes helped me find the notes I needed for my final
                exams. The quality was excellent and the platform is so easy to
                use!
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  RG
                </div>
                <div>
                  <p className="font-semibold">Raghav Gupta</p>
                  <p className="text-gray-500 text-sm">BTech, RGPV, Bhopal</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm relative">
              <div className="absolute -top-5 left-6 text-6xl text-blue-200">
                "
              </div>
              <p className="text-gray-700 relative z-10 italic mb-6">
                A fantastic place to upload and share notes. I've helped so many
                students and received great feedback on my contributed
                materials!
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  RA
                </div>
                <div>
                  <p className="font-semibold">Raman Agnihotri</p>
                  <p className="text-gray-500 text-sm">MCA, MANIT, Bhopal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Bold and attractive */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Join the Movement!
          </h2>
          <p className="text-xl mb-10 max-w-xl mx-auto">
            Help 10,000+ students across India by sharing your notes today!
          </p>
          <Link to="/uploading-notes">
            <button
              onClick={handleUploadClick}
              className="cursor-pointer bg-yellow-500 text-gray-900 py-4 px-10 rounded-lg hover:bg-yellow-400 transition duration-300 font-bold text-lg shadow-xl transform hover:-translate-y-1"
            >
              Start Sharing
            </button>
          </Link>
        </div>
      </section>

      {/* Stay Connected - Modern social links */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Stay Connected With Us</h2>

          <div className="flex flex-wrap justify-center items-center gap-8">
            <a
              href="#"
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition duration-300"
            >
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </div>
              <span className="font-medium">Facebook</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-2 text-purple-700 hover:text-purple-900 transition duration-300"
            >
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.5 5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM12 7.5c1.5 0 2.7 1.2 2.7 2.7 0 1.5-1.2 2.7-2.7 2.7-1.5 0-2.7-1.2-2.7-2.7 0-1.5 1.2-2.7 2.7-2.7zM12 14c2.34 0 4.34 1.66 5.12 3.96-1.47 1.25-3.38 2.04-5.12 2.04s-3.65-.79-5.12-2.04C7.66 15.66 9.66 14 12 14z" />
                </svg>
              </div>
              <span className="font-medium">Instagram</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition duration-300"
            >
              <div className="bg-blue-50 p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </div>
              <span className="font-medium">Twitter</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-2 text-red-600 hover:text-red-800 transition duration-300"
            >
              <div className="bg-red-50 p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <span className="font-medium">Email Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
