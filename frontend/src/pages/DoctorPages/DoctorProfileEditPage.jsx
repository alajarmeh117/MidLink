import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Camera,
  Stethoscope,
  Save,
  User,
  Mail,
  Key,
  BookOpen,
  PenTool,
  FileText,
  Upload,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getDoctorProfile,
  updateDoctorProfile,
  updateDoctorProfileImage,
  updateDoctorCV,
} from "../../store/doctorSlice";

const DoctorProfileEditPage = () => {
  const dispatch = useDispatch();
  const { profile, error, loading, cvLoading } = useSelector(
    (state) => state.doctor,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [localImageUrl, setLocalImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // CV states
  const [cvPath, setCvPath] = useState(null);
  const [newCvFile, setNewCvFile] = useState(null);
  const [showCvUpload, setShowCvUpload] = useState(false);

  useEffect(() => {
    dispatch(getDoctorProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.staff_name || "");
      setEmail(profile.email || "");
      setSpecialty(profile.specialty || "");
      setBio(profile.bio || "");
      setProfileImage(profile.profile_image || null);
      setCvPath(profile.cv || null);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateDoctorProfile({
          staff_name: name,
          email,
          password,
          specialty,
          bio,
        }),
      ).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setPassword("");
    } catch (error) {
      toast.error("Failed to update profile. Please try again later.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLocalImageUrl(URL.createObjectURL(file));
        const result = await dispatch(updateDoctorProfileImage(file)).unwrap();
        setProfileImage(result.profile_image);
        toast.success("Profile image updated successfully");
      } catch {
        toast.error("Failed to update profile image.");
        setLocalImageUrl(null);
      }
    }
  };

  const handleCvUpload = async () => {
    if (!newCvFile) {
      toast.error("Please select a PDF file first");
      return;
    }
    try {
      const result = await dispatch(updateDoctorCV(newCvFile)).unwrap();
      setCvPath(result.cv);
      setNewCvFile(null);
      setShowCvUpload(false);
      toast.success("CV updated successfully");
    } catch {
      toast.error("Failed to update CV. Please try again.");
    }
  };

  const getCurrentImageUrl = () => {
    if (localImageUrl) return localImageUrl;
    if (profileImage) return `http://localhost:5000/${profileImage}`;
    return "https://via.placeholder.com/150";
  };

  const getCvFileName = () => {
    if (!cvPath) return null;
    return cvPath.split("/").pop();
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-full p-4 md:p-8 font-sans animate-[fadeIn_0.5s_ease-in-out]">
        <div className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[700px]">
          {/* Left Sidebar (Profile Card) */}
          <div className="bg-gradient-to-b from-[#0f4c5c] to-[#165a6c] p-8 md:w-80 lg:w-96 flex flex-col relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2dd4bf] rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

            {/* Back Button */}
            <Link
              to="/home"
              className="text-teal-100 hover:text-white mb-8 inline-flex items-center gap-2 transition-colors w-fit relative z-10"
            >
              <ArrowLeft size={20} />{" "}
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>

            {/* Avatar Section */}
            <div className="relative mb-6 mx-auto z-10">
              <div className="w-40 h-40 rounded-full p-1.5 bg-gradient-to-br from-[#2dd4bf] to-transparent">
                <img
                  src={getCurrentImageUrl()}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover bg-white shadow-xl"
                />
              </div>
              <label
                htmlFor="profile-image-upload"
                className="absolute bottom-2 right-2 bg-[#2dd4bf] text-[#0f4c5c] p-3 rounded-full shadow-lg hover:scale-110 hover:bg-white transition-all cursor-pointer border-2 border-[#0f4c5c]"
              >
                <Camera size={18} />
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="text-center mb-8 relative z-10">
              <h2 className="text-2xl font-serif font-bold text-white mb-1">
                {name || "Doctor Name"}
              </h2>
              <p className="text-[#2dd4bf] font-medium text-sm">
                {specialty || "Specialty not set"}
              </p>
            </div>

            {/* Action Toggle Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 relative z-10 shadow-md hover:shadow-lg ${
                isEditing
                  ? "bg-white text-[#0f4c5c] hover:bg-slate-100"
                  : "bg-[#2dd4bf] text-[#0f4c5c] hover:bg-teal-300"
              }`}
            >
              {isEditing ? <Save size={18} /> : <PenTool size={18} />}
              {isEditing ? "Cancel Editing" : "Edit Profile Info"}
            </button>

            {/* CV Section */}
            <div className="mt-auto pt-8 relative z-10">
              <div className="bg-black/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                <p className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-[#2dd4bf]" />
                  Curriculum Vitae
                </p>

                {cvPath ? (
                  <div className="space-y-3">
                    <a
                      href={`http://localhost:5000/${cvPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white text-sm px-4 py-3 rounded-xl transition-colors w-full border border-white/5"
                    >
                      <ExternalLink size={16} className="text-[#2dd4bf]" />
                      <span className="truncate flex-1 text-left">
                        {getCvFileName()}
                      </span>
                    </a>
                    <button
                      onClick={() => setShowCvUpload(!showCvUpload)}
                      className="flex items-center justify-center gap-2 text-teal-100 hover:text-white text-xs w-full transition-colors font-medium"
                    >
                      <Upload size={14} />{" "}
                      {showCvUpload ? "Cancel Upload" : "Update Document"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCvUpload(!showCvUpload)}
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-3 rounded-xl transition-colors w-full border border-white/5"
                  >
                    <Upload size={16} className="text-[#2dd4bf]" />
                    {showCvUpload ? "Cancel" : "Upload CV Document"}
                  </button>
                )}

                {/* CV Upload Dropzone */}
                {showCvUpload && (
                  <div className="mt-4 space-y-3 animate-[fadeIn_0.3s_ease-in-out]">
                    <label className="flex flex-col items-center justify-center gap-2 cursor-pointer bg-black/20 border-2 border-dashed border-[#2dd4bf]/40 rounded-xl px-4 py-6 hover:border-[#2dd4bf] transition-colors group">
                      <FileText
                        size={24}
                        className="text-teal-100 group-hover:text-white transition-colors"
                      />
                      <span className="text-xs text-teal-100 text-center px-2">
                        {newCvFile ? newCvFile.name : "Click to select PDF"}
                      </span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setNewCvFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>

                    {newCvFile && (
                      <button
                        onClick={handleCvUpload}
                        disabled={cvLoading}
                        className="w-full py-3 bg-[#2dd4bf] text-[#0f4c5c] rounded-xl text-sm font-bold hover:bg-teal-300 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
                      >
                        {cvLoading ? (
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-[#0f4c5c] border-t-transparent rounded-full"></span>
                        ) : (
                          <Save size={16} />
                        )}
                        {cvLoading ? "Uploading..." : "Save Document"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Main Content (Form) */}
          <div className="flex-1 p-8 lg:p-12 bg-white flex flex-col justify-center relative">
            {/* Form Header */}
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h1 className="text-3xl font-serif font-bold text-[#0f4c5c]">
                Personal Information
              </h1>
              <p className="text-slate-500 mt-2">
                Manage your professional details and how patients see you on
                MidLink.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <User size={16} className="text-[#2dd4bf]" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all ${!isEditing ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`}
                    placeholder="Enter full name"
                    disabled={!isEditing}
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <Mail size={16} className="text-[#2dd4bf]" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all ${!isEditing ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`}
                    placeholder="doctor@midlink.com"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Specialty Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <Stethoscope size={16} className="text-[#2dd4bf]" /> Medical
                    Specialty
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className={`w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all ${!isEditing ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`}
                    placeholder="e.g. Cardiologist"
                    disabled={!isEditing}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <Key size={16} className="text-[#2dd4bf]" /> Security
                    (Password)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all ${!isEditing ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`}
                    placeholder={
                      isEditing ? "Enter new password..." : "••••••••"
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Bio Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <BookOpen size={16} className="text-[#2dd4bf]" /> Professional
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-32 resize-none focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all ${!isEditing ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`}
                  placeholder="Write a short biography about your experience..."
                  disabled={!isEditing}
                />
              </div>

              {/* Save Changes Button (Animated) */}
              <div
                className={`transition-all duration-500 overflow-hidden ${isEditing ? "max-h-24 opacity-100 mt-8" : "max-h-0 opacity-0 m-0"}`}
              >
                <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 bg-[#0f4c5c] text-white rounded-xl font-bold hover:bg-[#165a6c] transition-all disabled:opacity-70 flex items-center gap-2 shadow-lg hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <Save size={18} />
                    )}
                    {loading ? "Saving Profile..." : "Save All Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorProfileEditPage;
