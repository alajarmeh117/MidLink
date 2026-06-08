import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../AdminPages/sidebar";
import axios from "axios";
import Swal from "sweetalert2";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Users,
  Calendar,
  UploadCloud,
  X,
} from "lucide-react";

const AddPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    profile_image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleClearImage = (e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      profile_image: null,
    }));
    // Reset the file input element visually
    const fileInput = document.getElementById("profile_image");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        "https://midlink-backend.onrender.com/api/patients",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      Swal.fire({
        title: "Success!",
        text: "Patient added successfully to MidLink",
        icon: "success",
        confirmButtonColor: "#0f4c5c",
        confirmButtonText: "Great!",
      }).then(() => {
        setFormData({
          username: "",
          email: "",
          password: "",
          gender: "",
          dob: "",
          profile_image: null,
        });
        navigate("/AdminDashboard/add-patient");
      });
    } catch (error) {
      Swal.fire({
        title: "Registration Error!",
        text:
          error.response?.data?.message ||
          "Failed to add patient. Please try again.",
        icon: "error",
        confirmButtonColor: "#0f4c5c",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center overflow-y-auto animate-[fadeIn_0.4s_ease-in-out]">
        <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 border-b border-slate-100 pb-6 text-center md:text-left">
            <h2 className="text-3xl font-serif font-bold text-[#0f4c5c] flex items-center justify-center md:justify-start gap-3">
              <UserPlus className="text-[#2dd4bf]" size={32} />
              Register New Patient
            </h2>
            <p className="text-slate-500 mt-2">
              Enter the patient's personal details to create a new profile in
              the system.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"
                >
                  <User size={16} className="text-[#2dd4bf]" /> Full Name{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all text-slate-700"
                  placeholder="e.g. Ahmad Ali"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"
                >
                  <Mail size={16} className="text-[#2dd4bf]" /> Email Address{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all text-slate-700"
                  placeholder="patient@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"
                >
                  <Lock size={16} className="text-[#2dd4bf]" /> Password{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all text-slate-700"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"
                >
                  <Users size={16} className="text-[#2dd4bf]" /> Gender{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all text-slate-700 appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date of Birth */}
              <div>
                <label
                  htmlFor="dob"
                  className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"
                >
                  <Calendar size={16} className="text-[#2dd4bf]" /> Date of
                  Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all text-slate-700 cursor-pointer"
                  required
                />
              </div>

              {/* Profile Image Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <UploadCloud size={16} className="text-[#2dd4bf]" /> Profile
                  Photo{" "}
                  <span className="text-xs text-slate-400 font-normal">
                    (Optional)
                  </span>
                </label>
                <label
                  className={`flex flex-col items-center justify-center gap-2 cursor-pointer w-full p-3 border-2 border-dashed rounded-xl transition-all ${formData.profile_image ? "border-[#2dd4bf] bg-teal-50" : "border-slate-300 hover:border-[#2dd4bf] bg-slate-50"}`}
                >
                  {formData.profile_image ? (
                    <div className="flex items-center justify-between w-full px-2">
                      <span className="text-sm font-medium text-[#0f4c5c] truncate pr-2">
                        {formData.profile_image.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500">
                      <UploadCloud size={20} />
                      <span className="text-sm">Click to select image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    id="profile_image"
                    name="profile_image"
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-100 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl text-lg font-bold text-white bg-[#0f4c5c] hover:bg-[#165a6c] focus:outline-none focus:ring-4 focus:ring-[#2dd4bf]/30 transition-all duration-300 shadow-lg hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <UserPlus size={20} />
                )}
                {isSubmitting
                  ? "Creating Patient Profile..."
                  : "Add Patient to MidLink"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;
