import React, { useState, useEffect, useRef } from "react";
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
  MapPin, // 🔥 أيقونة الخريطة
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
  const [clinicAddress, setClinicAddress] = useState(""); // 🔥 State لعنوان العيادة
  const [profileImage, setProfileImage] = useState(null);
  const [localImageUrl, setLocalImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // CV states
  const [cvPath, setCvPath] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(getDoctorProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.staff_name || "");
      setEmail(profile.email || "");
      setSpecialty(profile.specialty || "");
      setBio(profile.bio || "");
      setClinicAddress(profile.clinic_address || ""); // 🔥 جلب العنوان إن وُجد
      setCvPath(profile.cv || "");
      if (profile.profile_image) {
        setLocalImageUrl(`http://localhost:5000/${profile.profile_image}`);
      }
    }
  }, [profile]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const imageUrl = URL.createObjectURL(file);
      setLocalImageUrl(imageUrl);

      const formData = new FormData();
      formData.append("profileImage", file);
      dispatch(updateDoctorProfileImage(formData));
    }
  };

  const handleCVChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("cv", file);
      dispatch(updateDoctorCV(formData))
        .unwrap()
        .then((res) => {
          toast.success("CV uploaded successfully!");
          setCvPath(res.cv);
        })
        .catch((err) => {
          toast.error("Failed to upload CV");
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateData = {
      staff_name: name,
      email,
      specialty,
      bio,
      clinic_address: clinicAddress, // 🔥 إرسال العنوان للباك-إند
    };
    if (password) {
      updateData.password = password;
    }
    dispatch(updateDoctorProfile(updateData))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully!");
        setPassword("");
        setIsEditing(false);
      })
      .catch(() => {
        toast.error("Failed to update profile.");
      });
  };

  return (
    <div className="bg-[#f8fafc] font-sans min-h-screen pb-20">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-[#0f4c5c] text-white pt-12 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
            Profile Settings
          </h1>
          <p className="text-white/70">
            Manage your personal details, clinic location, and credentials.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-24 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          {/* Profile Sidebar */}
          <div className="bg-slate-50 w-full md:w-1/3 p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-100">
            <div className="relative group mb-6">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                {localImageUrl ? (
                  <img
                    src={localImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                    <User size={64} />
                  </div>
                )}
              </div>
              <label
                htmlFor="profileImageInput"
                className="absolute bottom-2 right-2 bg-[#2dd4bf] hover:bg-teal-400 text-[#0f4c5c] p-3 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110"
              >
                <Camera size={20} />
              </label>
              <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <h2 className="text-xl font-bold text-[#0f4c5c] text-center mb-1">
              Dr. {name || "Name"}
            </h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center mb-8">
              {specialty || "Specialty"}
            </p>

            <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <FileText size={16} className="text-[#2dd4bf]" /> CV / Resume
              </h3>
              {cvPath ? (
                <div className="flex flex-col gap-3">
                  <a
                    href={`http://localhost:5000/${cvPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 text-[#0f4c5c] rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                  >
                    <ExternalLink size={16} /> View Current CV
                  </a>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#e6f0f5] text-[#0a7a8c] rounded-xl text-sm font-bold hover:bg-[#cbe2ee] transition-colors"
                    disabled={cvLoading}
                  >
                    <Upload size={16} />{" "}
                    {cvLoading ? "Uploading..." : "Upload New CV"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-[#2dd4bf] text-[#0f4c5c] rounded-xl text-sm font-bold hover:bg-teal-50 transition-colors"
                  disabled={cvLoading}
                >
                  <Upload size={16} />{" "}
                  {cvLoading ? "Uploading..." : "Upload CV File"}
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleCVChange}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="w-full md:w-2/3 p-8 md:p-12 bg-white relative">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <h3 className="text-2xl font-black text-[#0f4c5c]">
                Personal Details
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-colors ${
                  isEditing
                    ? "bg-amber-100 text-amber-700"
                    : "bg-[#e6f0f5] text-[#0a7a8c] hover:bg-[#cbe2ee]"
                }`}
              >
                <PenTool size={16} /> {isEditing ? "Cancel Edit" : "Edit Info"}
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="text-[#2dd4bf]" size={18} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] outline-none transition-all ${!isEditing ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="text-[#2dd4bf]" size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] outline-none transition-all ${!isEditing ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Specialty
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Stethoscope className="text-[#2dd4bf]" size={18} />
                    </div>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className={`w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] outline-none transition-all ${!isEditing ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    New Password{" "}
                    <span className="text-slate-400 font-normal">
                      (Leave blank to keep current)
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key className="text-[#2dd4bf]" size={18} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] outline-none transition-all ${!isEditing ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`}
                      placeholder="••••••••"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* 🔥 حقل عنوان العيادة الجديد */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Clinic Location / Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="text-amber-500" size={18} />
                  </div>
                  <input
                    type="text"
                    value={clinicAddress}
                    onChange={(e) => setClinicAddress(e.target.value)}
                    className={`w-full pl-11 p-3.5 bg-amber-50/30 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all ${!isEditing ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`}
                    placeholder="e.g., Abdali Hospital, Amman OR Google Maps Link..."
                    disabled={!isEditing}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  Enter your exact address to generate a map for your patients.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Professional Biography
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="4"
                  className={`w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] outline-none transition-all resize-none ${!isEditing ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`}
                  placeholder="Write a short biography about your experience..."
                  disabled={!isEditing}
                ></textarea>
              </div>

              {/* Save Changes Button */}
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
    </div>
  );
};

export default DoctorProfileEditPage;
