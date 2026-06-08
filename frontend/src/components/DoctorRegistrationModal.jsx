import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Eye,
  EyeOff,
  UploadCloud,
  FileText,
  Camera,
  UserPlus,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const DoctorRegistrationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    staff_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    customSpecialty: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // إيقاف الـ Scroll للصفحة الرئيسية لما يكون الـ Modal مفتوح
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file) setCvFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (formData.specialty === "Other" && !formData.customSpecialty.trim()) {
      setError("Please enter your specialty");
      return;
    }
    // 🛑 التعديل اللوجيك: الـ CV صار إجباري
    if (!cvFile) {
      setError("Your CV/Resume (PDF) is strictly required for verification.");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("staff_name", formData.staff_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);

      const specialtyToSend =
        formData.specialty === "Other"
          ? formData.customSpecialty
          : formData.specialty;
      formDataToSend.append("specialty", specialtyToSend);
      formDataToSend.append("bio", formData.bio);

      if (profileImage) {
        formDataToSend.append("profile_image", profileImage);
      }

      // السيرة الذاتية (إجبارية الآن)
      formDataToSend.append("cv", cvFile);

      await axios.post(
        "http://localhost:5000/api/doctors/register",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to register. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      staff_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      specialty: "",
      customSpecialty: "",
      bio: "",
    });
    setProfileImage(null);
    setImagePreview(null);
    setCvFile(null);
    setError("");
    setSuccess(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // 🛑 زرع الـ Modal في الـ Body مباشرة باستخدام createPortal لمنع مشاكل الـ Scroll والـ Z-Index
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Overlay الزجاجي */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#04333a]/80 backdrop-blur-md"
          />

          {/* محتوى الـ Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-white/20"
          >
            {/* 🌊 Header */}
            <div className="bg-gradient-to-r from-[#04333a] to-[#0a7a8c] p-6 text-white flex justify-between items-center shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#58e6fc] rounded-full blur-[50px] opacity-20 pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
                  <UserPlus className="text-[#58e6fc] w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    Join MidLink Network
                  </h2>
                  <p className="text-xs text-[#c4f7ff] font-bold uppercase tracking-widest mt-1">
                    Doctor Registration Portal
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="relative z-10 bg-white/10 hover:bg-red-500 hover:text-white p-2 rounded-full transition-colors duration-300"
              >
                <X size={20} />
              </button>
            </div>

            {/* 📝 Form Body (Scrollable) */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-grow bg-[#f8fafc]">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* رسائل الخطأ والنجاح */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl flex items-center gap-3 shadow-sm"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />{" "}
                      <p className="font-bold text-sm">{error}</p>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-xl flex items-center gap-3 shadow-sm"
                    >
                      <ShieldCheck className="w-5 h-5 shrink-0" />{" "}
                      <p className="font-bold text-sm">
                        Registration successful! Awaiting admin verification.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid md:grid-cols-12 gap-8">
                  {/* Left Column: Avatar & CV */}
                  <div className="md:col-span-4 flex flex-col items-center space-y-6">
                    {/* Profile Image */}
                    <div className="w-full bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-50 border-4 border-[#e6f0f5] shadow-inner mb-4 relative group">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <UserPlus className="w-10 h-10 opacity-50 mb-1" />
                          </div>
                        )}
                        <label className="absolute inset-0 bg-[#04333a]/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300">
                          <Camera className="w-6 h-6 mb-1" />
                          <span className="text-xs font-bold">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                        Profile Photo (Optional)
                      </p>
                    </div>

                    {/* CV Dropzone (Required) */}
                    <div className="w-full bg-white p-1 rounded-[2rem] shadow-sm border border-gray-100">
                      <label
                        className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-[1.5rem] cursor-pointer transition-all duration-300 ${cvFile ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-[#0a7a8c] hover:bg-[#f0f9fa]"}`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                          {cvFile ? (
                            <>
                              <FileText className="w-8 h-8 text-green-500 mb-2" />
                              <p className="text-sm text-green-600 font-bold truncate w-full max-w-[150px]">
                                {cvFile.name}
                              </p>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-8 h-8 text-[#0a7a8c] mb-2" />
                              <p className="text-sm font-bold text-[#04333a] mb-1">
                                Upload CV{" "}
                                <span className="text-red-500">*</span>
                              </p>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                                PDF format only
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleCvChange}
                          className="hidden"
                        />
                      </label>
                      {cvFile && (
                        <button
                          type="button"
                          onClick={() => setCvFile(null)}
                          className="w-full text-center py-2 text-xs text-red-500 hover:text-red-700 font-bold uppercase tracking-widest mt-1"
                        >
                          Remove File
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Inputs */}
                  <div className="md:col-span-8 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="staff_name"
                          value={formData.staff_name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#58e6fc] focus:ring-4 focus:ring-[#58e6fc]/20 outline-none transition-all font-bold text-[#04333a]"
                          placeholder="Dr. John Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#58e6fc] focus:ring-4 focus:ring-[#58e6fc]/20 outline-none transition-all font-bold text-[#04333a]"
                          placeholder="doctor@midlink.jo"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            minLength="6"
                            className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#58e6fc] focus:ring-4 focus:ring-[#58e6fc]/20 outline-none transition-all font-bold text-[#04333a]"
                            placeholder="Min 6 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0a7a8c] transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                          Confirm Password{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#58e6fc] focus:ring-4 focus:ring-[#58e6fc]/20 outline-none transition-all font-bold text-[#04333a]"
                            placeholder="Confirm password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0a7a8c] transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        Specialty <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#58e6fc] focus:ring-4 focus:ring-[#58e6fc]/20 outline-none transition-all font-bold text-[#04333a] cursor-pointer"
                      >
                        <option value="">Select Primary Specialty</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Psychiatry">Psychiatry</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="General Practice">
                          General Practice
                        </option>
                        <option value="Other">Other (Specify below)</option>
                      </select>
                    </div>

                    <AnimatePresence>
                      {formData.specialty === "Other" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                            Custom Specialty{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="customSpecialty"
                            value={formData.customSpecialty}
                            onChange={handleInputChange}
                            required
                            className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#58e6fc] focus:ring-4 focus:ring-[#58e6fc]/20 outline-none transition-all font-bold text-[#04333a]"
                            placeholder="Enter your specific medical field"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        Professional Bio <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#58e6fc] focus:ring-4 focus:ring-[#58e6fc]/20 outline-none transition-all font-serif text-[#04333a] resize-none"
                        placeholder="Briefly describe your experience and qualifications..."
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/3 px-6 py-4 bg-gray-100 text-gray-600 font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-2/3 px-6 py-4 bg-gradient-to-r from-[#04333a] to-[#0a7a8c] text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-[#04333a]/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          <UploadCloud size={18} />
                        </motion.div>{" "}
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `,
        }}
      />
    </AnimatePresence>,
    document.body,
  );
};

DoctorRegistrationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DoctorRegistrationModal;
