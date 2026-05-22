import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
  User,
  Mail,
  Lock,
  Stethoscope,
  BookOpen,
  Image as ImageIcon,
  FileText,
  UploadCloud,
  X,
  UserPlus,
} from "lucide-react";

const AddDoctor = ({ onAddDoctor }) => {
  const [formData, setFormData] = useState({
    staff_name: "",
    email: "",
    password: "",
    specialty: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleCvChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFormData({
      staff_name: "",
      email: "",
      password: "",
      specialty: "",
      bio: "",
    });
    setProfileImage(null);
    setCvFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 الحماية الجديدة: الـ CV إجباري للأدمن
    if (!cvFile) {
      Swal.fire({
        title: "Missing CV!",
        text: "You MUST upload the doctor's CV (PDF format) to complete the registration.",
        icon: "warning",
        confirmButtonColor: "#0f4c5c",
      });
      return; // يمنع إكمال الكود
    }

    setIsSubmitting(true);

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (profileImage) {
      data.append("profile_image", profileImage);
    }
    if (cvFile) {
      data.append("cv", cvFile);
    }

    try {
      const registerUrl =
        "https://midlink-of4r.onrender.com/api/doctors/register";

      const response = await axios.post(registerUrl, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      resetForm();
      if (onAddDoctor) {
        onAddDoctor(response.data.doctor || response.data);
      }

      Swal.fire({
        title: "Success",
        text: "Doctor registered successfully with CV.",
        icon: "success",
        confirmButtonColor: "#2dd4bf",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to add doctor",
        icon: "error",
        confirmButtonColor: "#0f4c5c",
      });
      console.error("Error adding doctor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 animate-[fadeIn_0.3s_ease-in-out]">
      <div className="mb-8 border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-serif font-bold text-[#0f4c5c] flex items-center gap-2">
          <UserPlus className="text-[#2dd4bf]" size={28} />
          Register New Doctor
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Enter the doctor's details and upload their mandatory CV to add them
          to MidLink.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <User size={16} className="text-[#2dd4bf]" /> Full Name{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="staff_name"
              value={formData.staff_name}
              onChange={handleChange}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all"
              placeholder="Dr. John Doe"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <Mail size={16} className="text-[#2dd4bf]" /> Email Address{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all"
              placeholder="doctor@midlink.com"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <Lock size={16} className="text-[#2dd4bf]" /> Password{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <Stethoscope size={16} className="text-[#2dd4bf]" /> Specialty{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all"
              placeholder="e.g. Cardiologist"
              required
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <BookOpen size={16} className="text-[#2dd4bf]" /> Professional Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all h-28 resize-none"
            placeholder="Brief description of the doctor's experience and qualifications..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Profile Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <ImageIcon size={16} className="text-[#2dd4bf]" /> Profile Photo{" "}
              <span className="text-xs text-slate-400 font-normal">
                (Optional)
              </span>
            </label>
            <label
              className={`flex flex-col items-center justify-center gap-2 cursor-pointer w-full p-4 border-2 border-dashed rounded-xl transition-colors ${profileImage ? "border-[#2dd4bf] bg-teal-50" : "border-slate-300 hover:border-[#2dd4bf] bg-slate-50"}`}
            >
              {profileImage ? (
                <div className="flex items-center gap-2 w-full justify-between">
                  <span className="text-sm font-medium text-[#0f4c5c] truncate px-2">
                    {profileImage.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setProfileImage(null);
                    }}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud size={24} className="text-slate-400" />
                  <span className="text-sm text-slate-500">
                    Click to upload photo
                  </span>
                </>
              )}
              <input
                type="file"
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>

          {/* CV Upload - 🔥 شلنا Optional وحطينا نجمة حمراء */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <FileText size={16} className="text-[#2dd4bf]" /> Resume / CV{" "}
              <span className="text-red-500">*</span>
              <span className="text-xs text-slate-400 font-normal">
                (PDF only)
              </span>
            </label>
            <label
              className={`flex flex-col items-center justify-center gap-2 cursor-pointer w-full p-4 border-2 border-dashed rounded-xl transition-colors ${cvFile ? "border-[#2dd4bf] bg-teal-50" : "border-slate-300 hover:border-[#2dd4bf] bg-slate-50"}`}
            >
              {cvFile ? (
                <div className="flex items-center gap-2 w-full justify-between">
                  <span className="text-sm font-medium text-[#0f4c5c] truncate px-2">
                    {cvFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setCvFile(null);
                    }}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud size={24} className="text-slate-400" />
                  <span className="text-sm text-slate-500">
                    Click to upload CV (PDF)
                  </span>
                </>
              )}
              <input
                type="file"
                onChange={handleCvChange}
                className="hidden"
                accept="application/pdf"
              />
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0f4c5c] text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-[#165a6c] transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <UserPlus size={20} />
            )}
            {isSubmitting ? "Registering Doctor..." : "Add Doctor to MidLink"}
          </button>
        </div>
      </form>
    </div>
  );
};

AddDoctor.propTypes = {
  onAddDoctor: PropTypes.func.isRequired,
};

export default AddDoctor;
