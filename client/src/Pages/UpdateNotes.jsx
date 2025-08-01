import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

const UpdateNotes = () => {
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
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const params = useParams();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

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

  useEffect(() => {
    const fetchUpdate = async () => {
      const updateId = params.updateId;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/uploading/get/${updateId}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setFormData(data.note);
      console.log("Fetched data:", data.note);
    };

    fetchUpdate();
  }, [params.updateId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "courseName") {
      setSearchTerm(value);
      setShowCourseDropdown(true);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUrlChange = (e) => {
    setFormData((prev) => ({ ...prev, fileUrl: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const form = new FormData();

      if (file) {
        form.append("file", file, file.name);
      } else if (formData.fileUrl) {
        form.append("fileUrl", formData.fileUrl);
        form.append("fileName", formData.fileName || "File from URL");
      }

      for (const key in formData) {
        if (key !== "fileUrl" && key !== "fileName") {
          form.append(key, formData[key]);
        }
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/uploading/update/${
          params.updateId
        }`,
        {
          method: "POST",
          body: form,
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`Update failed: ${res.statusText}`);
      }

      const data = await res.json();

      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      } else {
        alert("Note updated successfully ");
        navigate(`/notes/${params.updateId}`);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <main className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl p-8 shadow-lg text-center">
          <div className="inline-block p-3 bg-white rounded-full mb-4 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-600"
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
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Update Your Notes
          </h2>
          <p className="text-blue-100 max-w-md mx-auto">
            Make changes to your educational resources and share them with
            others
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-b-2xl shadow-xl p-6 md:p-10 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div className="form-group">
                <label
                  htmlFor="title"
                  className="block mb-2 text-gray-700 font-semibold text-sm"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g. Data Structures Notes"
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    onChange={handleChange}
                    value={formData.title}
                  />
                </div>
              </div>

              {/* College Name */}
              <div className="form-group">
                <label
                  htmlFor="collegeName"
                  className="block mb-2 text-gray-700 font-semibold text-sm"
                >
                  College Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="collegeName"
                    name="collegeName"
                    placeholder="e.g. XYZ University"
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    onChange={handleChange}
                    value={formData.collegeName}
                  />
                </div>
              </div>

              {/* Subject Name */}
              <div className="form-group">
                <label
                  htmlFor="subjectName"
                  className="block mb-2 text-gray-700 font-semibold text-sm"
                >
                  Subject Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="subjectName"
                    name="subjectName"
                    placeholder="e.g. DBMS"
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    onChange={handleChange}
                    value={formData.subjectName}
                  />
                </div>
              </div>

              {/* Batch */}
              <div className="form-group">
                <label
                  htmlFor="batch"
                  className="block mb-2 text-gray-700 font-semibold text-sm"
                >
                  Batch <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <select
                    id="batch"
                    name="batch"
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
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
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Searchable Course */}
              <div className="form-group">
                <label
                  htmlFor="courseName"
                  className="block mb-2 text-gray-700 font-semibold text-sm"
                >
                  Course <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="courseName"
                    name="courseName"
                    placeholder="Search for Course"
                    onChange={handleChange}
                    value={formData.courseName}
                    onFocus={() => setShowCourseDropdown(true)}
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Display Filtered Course Options */}
                {showCourseDropdown && filteredCourses.length > 0 && (
                  <div className="relative">
                    <div className="absolute z-10 w-full max-h-40 overflow-y-auto mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {filteredCourses.map((course, index) => (
                        <div
                          key={index}
                          onClick={() => handleCourseSelect(course)}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-sm"
                        >
                          {course}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Semester */}
              <div className="form-group">
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  Semester <span className="text-red-500">*</span>
                </label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <div key={sem} className="relative">
                        <input
                          id={`semester-${sem}`}
                          type="radio"
                          name="semester"
                          value={sem}
                          required
                          onChange={handleChange}
                          checked={parseInt(formData.semester) === sem}
                          className="hidden peer"
                        />
                        <label
                          htmlFor={`semester-${sem}`}
                          className="flex items-center justify-center p-2 text-gray-600 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500 hover:bg-gray-100 transition-all duration-200"
                        >
                          Sem {sem}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="form-group">
                <label
                  htmlFor="file"
                  className="block mb-2 text-gray-700 font-semibold text-sm"
                >
                  Upload File (PDF, DOC, etc.)
                </label>
                <div className="relative">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-blue-400 mb-2"
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
                        <p className="text-sm text-gray-500 text-center">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, TXT
                        </p>
                      </div>
                      <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                {file ? (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500 mr-2"
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
                    <span className="text-sm text-blue-700 truncate">
                      Selected: {file.name}
                    </span>
                  </div>
                ) : formData.fileUrl ? (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
                      />
                    </svg>
                    <a
                      href={formData.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-700 hover:underline truncate"
                    >
                      Current uploaded file
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Description - Full Width */}
          <div className="form-group mt-6">
            <label
              htmlFor="description"
              className="block mb-2 text-gray-700 font-semibold text-sm"
            >
              Description
            </label>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                placeholder="Share details about these notes to help others understand what they cover..."
                className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                onChange={handleChange}
                value={formData.description}
              ></textarea>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
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
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            {loading ? "Updating..." : "Update Notes"}
          </button>
          {error && <p className="text-rd-700 text-sm">{error}</p>}
        </form>
      </div>
    </main>
  );
};

export default UpdateNotes;
