import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Key,
  PenTool,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  getProfile,
  updateProfile,
  updateProfileImage,
} from "../store/authSlice";
import Swal from "sweetalert2";

// Custom Sweetalert2 styling
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
  customClass: {
    popup: "font-serif text-sm",
    title: "text-[#04333a]",
    content: "text-[#04333a]",
  },
  background: "#ffffff",
  color: "#04333a",
});

const ProfileEditPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [localImageUrl, setLocalImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(getProfile())
      .unwrap()
      .then((userData) => {
        setName(userData.username || "");
        setEmail(userData.email || "");
        setProfileImage(userData.profile_image || null);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        Toast.fire({
          icon: "error",
          title: "Failed to fetch profile data",
        });
      });
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateProfile({ username: name, email, password }),
      ).unwrap();
      Toast.fire({
        icon: "success",
        title: "Profile updated successfully",
      });
      setIsEditing(false);
      setPassword("");
    } catch (error) {
      console.error("Error updating profile:", error);
      Toast.fire({
        icon: "error",
        title: "Failed to update profile",
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const localUrl = URL.createObjectURL(file);
        setLocalImageUrl(localUrl);

        const result = await dispatch(updateProfileImage(file)).unwrap();
        setProfileImage(result.profile_image);

        Toast.fire({
          icon: "success",
          title: "Profile image updated successfully",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        Toast.fire({
          icon: "error",
          title: "Failed to update profile image",
        });
        setLocalImageUrl(null);
      }
    }
  };

  const getCurrentImageUrl = () => {
    if (localImageUrl) {
      return localImageUrl;
    } else if (profileImage) {
      return `https://midlink-of4r.onrender.com/${profileImage}`;
    }
    return "https://via.placeholder.com/150";
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="bg-[#f6f5f2] min-h-screen font-sans overflow-hidden">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-[#58e6fc] rounded-full blur-[150px] opacity-10"
        />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-[#0a7a8c] rounded-full blur-[120px] opacity-10" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(4,51,58,0.1)] border border-white overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* 👤 Left Sidebar */}
            <div className="bg-gradient-to-br from-[#04333a] to-[#0a7a8c] p-12 lg:w-1/3 flex flex-col items-center justify-center relative overflow-hidden">
              {/* التعديل هنا: إضافة pointer-events-none للطبقة الوهمية */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

              <Link
                to="/"
                className="absolute top-8 left-8 text-white/70 hover:text-white transition-colors group flex items-center gap-2 font-bold text-sm tracking-widest uppercase z-20"
              >
                <ArrowLeft
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform"
                />{" "}
                Home
              </Link>

              {/* Glowing Avatar */}
              <div className="relative mb-10 mt-10 z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -inset-3 rounded-full border-t-4 border-l-4 border-[#58e6fc] opacity-60"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -inset-1 rounded-full border-b-2 border-r-2 border-[#c4f7ff] opacity-40"
                />

                <img
                  src={getCurrentImageUrl()}
                  alt="Profile"
                  className="w-48 h-48 rounded-full object-cover relative z-10 shadow-2xl border-4 border-[#04333a]"
                />

                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-2 right-2 bg-white text-[#04333a] p-4 rounded-full hover:bg-[#58e6fc] hover:text-[#04333a] transition-colors cursor-pointer z-20 shadow-xl group"
                >
                  <Camera
                    size={24}
                    className="group-hover:scale-110 transition-transform"
                  />
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <h2 className="relative z-10 text-3xl font-black text-white text-center mb-2 tracking-tight">
                {name || "User Name"}
              </h2>
              <div className="relative z-10 flex items-center gap-2 text-[#58e6fc] bg-white/10 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-10 border border-white/10">
                <ShieldCheck size={16} /> Verified Profile
              </div>

              {/* التعديل هنا: إضافة z-10 و type="button" للزر لضمان قابليته للضغط */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className={`relative z-20 w-full py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl cursor-pointer ${
                  isEditing
                    ? "bg-white text-[#04333a]"
                    : "bg-[#0a7a8c] text-white hover:bg-[#58e6fc] hover:text-[#04333a]"
                }`}
              >
                {isEditing ? (
                  <>
                    <Save size={22} /> View Mode
                  </>
                ) : (
                  <>
                    <PenTool size={22} /> Edit Mode
                  </>
                )}
              </motion.button>
            </div>

            {/* 📝 Right Section */}
            <div className="p-10 lg:p-16 lg:w-2/3">
              <div className="mb-12">
                <h1 className="text-4xl font-black text-[#04333a] flex items-center gap-3 tracking-tight">
                  <Sparkles className="text-[#0a7a8c]" /> Personal Details
                </h1>
                <p className="text-gray-500 font-serif italic mt-2">
                  Manage your MidLink healthcare identity
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div variants={itemVariants} className="relative group">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <User
                        className={`h-6 w-6 transition-colors duration-300 ${isEditing ? "text-[#0a7a8c]" : "text-gray-400"}`}
                      />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full pl-14 pr-6 py-5 rounded-2xl outline-none transition-all duration-300 ${
                        isEditing
                          ? "bg-gray-50 border-2 border-[#e6f0f5] focus:ring-4 focus:ring-[#58e6fc]/20 focus:border-[#0a7a8c] text-[#04333a] font-bold text-lg shadow-inner"
                          : "bg-transparent border-2 border-transparent text-[#04333a] font-black text-2xl cursor-default"
                      }`}
                      placeholder="Enter Full Name"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="relative group">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Mail
                        className={`h-6 w-6 transition-colors duration-300 ${isEditing ? "text-[#0a7a8c]" : "text-gray-400"}`}
                      />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full pl-14 pr-6 py-5 rounded-2xl outline-none transition-all duration-300 ${
                        isEditing
                          ? "bg-gray-50 border-2 border-[#e6f0f5] focus:ring-4 focus:ring-[#58e6fc]/20 focus:border-[#0a7a8c] text-[#04333a] font-bold text-lg shadow-inner"
                          : "bg-transparent border-2 border-transparent text-[#04333a] font-black text-2xl cursor-default"
                      }`}
                      placeholder="Enter Email Address"
                    />
                  </div>
                </motion.div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        marginTop: "2rem",
                      }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="relative group overflow-hidden"
                    >
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <Key className="h-6 w-6 text-[#0a7a8c]" />
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border-2 border-[#e6f0f5] focus:ring-4 focus:ring-[#58e6fc]/20 focus:border-[#0a7a8c] outline-none transition-all duration-300 text-[#04333a] font-bold text-lg shadow-inner"
                          placeholder="Enter new password (optional)"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="flex justify-end gap-4 pt-8 border-t border-gray-100"
                    >
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-8 py-4 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm cursor-pointer"
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-10 py-4 bg-gradient-to-r from-[#04333a] to-[#0a7a8c] text-white rounded-2xl font-black shadow-xl shadow-[#04333a]/20 hover:brightness-110 transition-all uppercase tracking-widest text-sm flex items-center gap-2 cursor-pointer"
                      >
                        <Save size={18} /> Save Changes
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileEditPage;
