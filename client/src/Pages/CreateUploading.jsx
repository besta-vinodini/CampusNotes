import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const CreateUploading = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const courses = [
    // Engineering (B.Tech/B.E)
    "Computer Science Engineering (B.Tech/B.E)",
    "Mechanical Engineering (B.Tech/B.E)",
    "Civil Engineering (B.Tech/B.E)",
    "Electrical Engineering (B.Tech/B.E)",
    "Electronics and Communication Engineering (B.Tech/B.E)",
    "Information Technology (B.Tech/B.E)",
    "Biotechnology Engineering (B.Tech/B.E)",
    "Chemical Engineering (B.Tech/B.E)",
    "Aerospace Engineering (B.Tech/B.E)",
    "Agricultural Engineering (B.Tech/B.E)",

    // Bachelor of Science (BSc)
    "BSc Physics",
    "BSc Chemistry",
    "BSc Mathematics",
    "BSc Biotechnology",
    "BSc Zoology",
    "BSc Microbiology",
    "BSc Botany",

    // Bachelor of Commerce (B.Com)
    "B.Com General",
    "B.Com Honours",
    "B.Com Accounting and Finance",
    "B.Com Computer Applications",

    // Bachelor of Arts (BA)
    "BA English",
    "BA Political Science",
    "BA History",
    "BA Psychology",
    "BA Sociology",
    "BA Economics",
    "BA Philosophy",

    // Bachelor of Business Administration (BBA)
    "General BBA",
    "BBA in Finance",
    "BBA in Marketing",
    "BBA in HRM (Human Resource Management)",
    "BBA in International Business",

    // Bachelor of Design (BDes)
    "BDes Fashion Design",
    "BDes Graphic Design",
    "BDes Product Design",

    // Bachelor of Fine Arts (BFA)
    "BFA Painting",
    "BFA Sculpture",
    "BFA Applied Arts",

    // Bachelor of Hotel Management (BHM)
    "Bachelor of Hotel Management (BHM)",

    // Bachelor of Law (LLB)
    "Bachelor of Law (LLB)",

    // Postgraduate Courses (PG)
    // Master of Science (MSc)
    "MSc Physics",
    "MSc Chemistry",
    "MSc Mathematics",
    "MSc Biotechnology",
    "MSc Microbiology",
    "MSc Environmental Science",
    "MSc Computer Science",

    // Master of Business Administration (MBA)
    "MBA General",
    "MBA in Marketing",
    "MBA in Finance",
    "MBA in HRM (Human Resource Management)",
    "MBA in International Business",
    "MBA in Operations",
    "MBA in Healthcare Management",
    "MBA in Digital Marketing",

    // Master of Commerce (MCom)
    "MCom in Accounting",
    "MCom in Business Management",
    "MCom in Banking and Finance",

    // Master of Arts (MA)
    "MA Economics",
    "MA Political Science",
    "MA English Literature",
    "MA Psychology",
    "MA History",
    "MA Sociology",
    "MA Education",

    // Master of Technology (MTech)
    "MTech in Computer Science",
    "MTech in Civil Engineering",
    "MTech in Mechanical Engineering",
    "MTech in Electronics and Communication",
    "MTech in Information Technology",
    "MTech in Data Science",

    // Master of Fine Arts (MFA)
    "MFA in Painting",
    "MFA in Sculpture",
    "MFA in Photography",
    "MFA in Applied Arts",

    // Master of Design (MDes)
    "MDes in Product Design",
    "MDes in Communication Design",
    "MDes in Fashion Design",

    // Master of Law (LLM)
    "Master of Law (LLM)",

    // Postgraduate Diploma Courses
    "PG Diploma in Digital Marketing",
    "PG Diploma in Management",
    "PG Diploma in Journalism",

    // Doctoral (PhD and Doctorate) Courses
    "PhD in Computer Science",
    "PhD in Engineering",
    "PhD in Physics",
    "PhD in Chemistry",
    "PhD in Economics",
    "PhD in Mathematics",
    "PhD in Environmental Science",
    "PhD in Political Science",
    "PhD in Literature",
    "PhD in Business Administration",
    "PhD in Sociology",

    // Doctor of Medicine (MD)
    "Doctor of Medicine (MD)",

    // Doctor of Dental Surgery (DDS)
    "Doctor of Dental Surgery (DDS)",

    // Doctor of Pharmacy (PharmD)
    "Doctor of Pharmacy (PharmD)",

    // Doctor of Veterinary Science (DVM)
    "Doctor of Veterinary Science (DVM)",

    // Doctor of Education (EdD)
    "Doctor of Education (EdD)",

    // Diplomas and Certificate Programs
    "Diploma in Graphic Design",
    "Diploma in Hotel Management",
    "Diploma in Nursing",
    "Diploma in Animation",
    "Diploma in Interior Design",
    "Certificate in Digital Marketing",
    "Certificate in Web Development",

    // Add MCA (Master of Computer Applications)
    "MCA (Master of Computer Applications)",
  ];
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    collegeName: "",
    courseName: "",
    batch: "",
    subjectName: "",
    semester: "",
    fileUrl: "",
    uploader: currentUser._id,
  });

  const filteredCourses = courses.filter((course) =>
    course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCourseSelect = (course) => {
    setFormData((prev) => ({ ...prev, courseName: course }));
    setShowCourseDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "courseName") {
      setSearchTerm(value);
      setShowCourseDropdown(true);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Create FormData object for multipart/form-data submission
      const form = new FormData();

      // Add file if selected
      if (file) {
        console.log(
          "Adding file to form data:",
          file.name,
          file.type,
          file.size
        );
        form.append("file", file);
      } else if (formData.fileUrl) {
        // If we have a URL instead of a file
        form.append("fileUrl", formData.fileUrl);
      } else {
        throw new Error("Please select a file or provide a file URL");
      }

      // Add all other form fields - with special handling for uploader
      for (const key in formData) {
        // Skip fileUrl if we already have a file
        if (key === "fileUrl" && file) continue;

        // Only add the uploader if it's a valid value (not undefined)
        if (key === "uploader") {
          if (formData[key] && formData[key] !== "undefined") {
            form.append(key, formData[key]);
          }
        } else {
          // Add all other fields normally
          form.append(key, formData[key]);
        }
      }

      // Log form data for debugging
      console.log("Form data keys:", [...form.keys()]);
      console.log(
        "Form fields:",
        Object.fromEntries(
          [...form.entries()].filter(([key]) => key !== "file")
        )
      );

      // Determine if we're creating or updating
      const isUpdate = Boolean(params.updateId);
      const endpoint = isUpdate
        ? `${import.meta.env.VITE_API_URL}/api/uploading/update/${
            params.updateId
          }`
        : `${import.meta.env.VITE_API_URL}/api/uploading/create`;

      // Send the request
      const token = localStorage.getItem("token");
      const res = await fetch(endpoint, {
        method: "POST",
        body: form,
        headers:{
          Authorization:`Bearer ${import.meta.env.JWT_SECRET}`,
        },
        // Don't manually set Content-Type here
      });

      // Handle non-JSON responses
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || `Request failed with status ${res.status}`
          );
        } else {
          const errorText = await res.text();
          throw new Error(
            `Request failed with status ${res.status}: ${errorText}`
          );
        }
      }

      const data = await res.json();

      setLoading(false);
      if (data.success === false) {
        setError(data.message || "Unknown error occurred");
      } else {
        alert(`Note ${isUpdate ? "updated" : "created"} successfully `);
        navigate(isUpdate ? `/notes/${params.updateId}` : "/");
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(`Error: ${err.message || "Unknown error occurred"}`);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 sm:px-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center">
              <span className="mr-3">📚</span>
              <span>Share Your Knowledge</span>
            </h1>
            <p className="text-blue-100 mt-2">
              Upload your notes and help fellow students excel in their studies
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
              <h2 className="text-lg font-medium text-blue-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Document Information
              </h2>
            </div>

            {/* Two Column Layout for Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Document Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g. Data Structures Notes"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  onChange={handleChange}
                  value={formData.title}
                />
              </div>

              {/* Subject Name */}
              <div className="space-y-2">
                <label
                  htmlFor="subjectName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subjectName"
                  name="subjectName"
                  placeholder="e.g. DBMS"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  onChange={handleChange}
                  value={formData.subjectName}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Provide a brief summary of what these notes cover..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                rows="4"
                onChange={handleChange}
                value={formData.description}
              ></textarea>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-8 mb-6">
              <h2 className="text-lg font-medium text-blue-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                Academic Details
              </h2>
            </div>

            {/* Three Column Layout for Academic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* College Name */}
              <div className="space-y-2">
                <label
                  htmlFor="collegeName"
                  className="block text-sm font-medium text-gray-700"
                >
                  College/University <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="collegeName"
                  name="collegeName"
                  placeholder="e.g. XYZ University"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  onChange={handleChange}
                  value={formData.collegeName}
                />
              </div>

              {/* Batch */}
              <div className="space-y-2">
                <label
                  htmlFor="batch"
                  className="block text-sm font-medium text-gray-700"
                >
                  Batch <span className="text-red-500">*</span>
                </label>
                <select
                  id="batch"
                  name="batch"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white"
                  required
                  onChange={handleChange}
                  value={formData.batch}
                >
                  <option value="">Select Batch</option>
                  <option value="2020-2024">2020-2024</option>
                  <option value="2021-2025">2021-2025</option>
                  <option value="2022-2026">2022-2026</option>
                  <option value="2023-2027">2023-2027</option>
                </select>
              </div>

              {/* Semester */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Semester <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <label
                      key={sem}
                      className={`flex items-center justify-center p-2 rounded-lg border ${
                        parseInt(formData.semester) === sem
                          ? "bg-blue-100 border-blue-500 text-blue-700 font-medium"
                          : "border-gray-300 hover:bg-gray-50 text-gray-700"
                      } cursor-pointer transition-all`}
                    >
                      <input
                        type="radio"
                        name="semester"
                        value={sem}
                        onChange={handleChange}
                        checked={parseInt(formData.semester) === sem}
                        className="sr-only"
                        required
                      />
                      Sem {sem}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Selection */}
            <div className="space-y-2 relative">
              <label
                htmlFor="courseName"
                className="block text-sm font-medium text-gray-700"
              >
                Course <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="courseName"
                name="courseName"
                placeholder="Search for your course..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                onChange={handleChange}
                value={formData.courseName}
                onFocus={() => setShowCourseDropdown(true)}
                required
              />

              {/* Course Dropdown */}
              {showCourseDropdown && filteredCourses.length > 0 && (
                <div className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                  {filteredCourses.map((course, index) => (
                    <div
                      key={index}
                      onClick={() => handleCourseSelect(course)}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                    >
                      {course}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-8 mb-6">
              <h2 className="text-lg font-medium text-blue-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                File Upload
              </h2>
            </div>

            {/* File Upload */}
            {/* File Upload */}
            <div className="space-y-2">
              <label
                htmlFor="fileUpload"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Document (PDF, DOC, etc.){" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                <div className="space-y-4 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="fileUpload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>

                      <input
                        id="fileUpload"
                        name="file"
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                  {file && (
                    <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-100">
                      Selected: {file.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start space-x-3 pt-4">
              <input
                type="checkbox"
                id="confirm"
                required
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
              />
              <label htmlFor="confirm" className="block text-sm text-gray-700">
                I confirm this is original content and I have permission to
                share it. I understand it will be available to help other
                students.
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {params.updateId ? "Updating..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    <span className="mr-2">📤</span>{" "}
                    {params.updateId ? "Update Your Notes" : "Share Your Notes"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional info card */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-medium text-gray-900">
            Why share your notes?
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-xl mb-2">🎓</div>
              <h4 className="font-medium">Help Others Learn</h4>
              <p className="text-sm text-gray-600 mt-1">
                Your notes could be exactly what someone needs to understand a
                difficult concept.
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-xl mb-2">🌟</div>
              <h4 className="font-medium">Build Your Reputation</h4>
              <p className="text-sm text-gray-600 mt-1">
                Earn recognition as a valuable contributor to the academic
                community.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-xl mb-2">🔄</div>
              <h4 className="font-medium">Give and Receive</h4>
              <p className="text-sm text-gray-600 mt-1">
                Sharing creates a culture where everyone benefits from
                collective knowledge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUploading;
