import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  HeartPulse,
  Calendar,
  Users,
  ArrowLeft,
} from "lucide-react";
import { signup } from "../store/authSlice";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      const resultAction = await dispatch(
        signup({ username, email, password, gender, dob }),
      );
      if (signup.fulfilled.match(resultAction)) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-row-reverse overflow-hidden bg-[#f6f5f2] font-serif">
      {/* زر الرجوع للـ Home */}
      <Link
        to="/"
        className="fixed top-5 right-5 lg:right-auto lg:left-5 flex items-center gap-2 text-[#04333a] bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-[#58e6fc] hover:text-[#04333a] transition-all duration-300 text-sm font-bold z-50 group border border-white/40"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* القسم الأيمن: الخلفية الإبداعية */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#0a7a8c] to-[#04333a] items-center justify-center overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#58e6fc] rounded-full mix-blend-overlay filter blur-[100px] opacity-30"
        />

        <div className="relative z-10 text-center px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
              <ShieldCheck className="w-20 h-20 text-[#c4f7ff]" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-extrabold text-white mb-6 leading-tight"
          >
            Join the Future of <br />{" "}
            <span className="text-[#58e6fc]">Healthcare</span>
          </motion.h1>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-left text-[#c4f7ff] space-y-5 max-w-sm mx-auto opacity-90 font-medium"
          >
            <li className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
              <HeartPulse className="w-6 h-6 text-[#58e6fc]" /> AI-Powered
              Symptom Checker
            </li>
            <li className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
              <HeartPulse className="w-6 h-6 text-[#58e6fc]" /> Secure HD Video
              Consultations
            </li>
            <li className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
              <HeartPulse className="w-6 h-6 text-[#58e6fc]" /> Centralized
              Medical Records
            </li>
          </motion.ul>
        </div>
      </div>

      {/* القسم الأيسر: نموذج إنشاء الحساب */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full max-w-xl py-10"
        >
          {/* Logo for mobile only */}
          <div className="flex items-center gap-2 mb-8 lg:hidden justify-center">
            <HeartPulse className="w-8 h-8 text-[#0a7a8c]" />
            <h2 className="text-3xl font-extrabold text-[#04333a]">
              Mid<span className="text-[#0a7a8c]">Link</span>
            </h2>
          </div>

          <h2 className="text-4xl font-bold text-[#04333a] mb-2 text-center lg:text-left">
            Create Account
          </h2>
          <p className="text-gray-500 mb-8 text-center lg:text-left font-medium">
            Start your journey to better health today.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Username */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-bold text-[#04333a] mb-2">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#0a7a8c] transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#58e6fc]/30 focus:border-[#0a7a8c] outline-none transition-all shadow-sm text-gray-700 font-sans"
                    placeholder="Enter username"
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-bold text-[#04333a] mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#0a7a8c] transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#58e6fc]/30 focus:border-[#0a7a8c] outline-none transition-all shadow-sm text-gray-700 font-sans"
                    placeholder="name@example.com"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-bold text-[#04333a] mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#0a7a8c] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#58e6fc]/30 focus:border-[#0a7a8c] outline-none transition-all shadow-sm text-gray-700 font-sans"
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#04333a] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-bold text-[#04333a] mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#0a7a8c] transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#58e6fc]/30 focus:border-[#0a7a8c] outline-none transition-all shadow-sm text-gray-700 font-sans"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#04333a] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Gender */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-bold text-[#04333a] mb-2">
                  Gender
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400 group-focus-within:text-[#0a7a8c] transition-colors" />
                  </div>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#58e6fc]/30 focus:border-[#0a7a8c] outline-none transition-all shadow-sm text-gray-700 font-sans appearance-none"
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </motion.div>

              {/* Date of Birth */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-bold text-[#04333a] mb-2">
                  Date of Birth
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-[#0a7a8c] transition-colors" />
                  </div>
                  <input
                    type="date"
                    max={today}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#58e6fc]/30 focus:border-[#0a7a8c] outline-none transition-all shadow-sm text-gray-700 font-sans"
                  />
                </div>
              </motion.div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center font-bold bg-red-50 p-3 rounded-xl border border-red-100 mt-4"
              >
                {error}
              </motion.p>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-4"
            >
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(10, 122, 140, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0a7a8c] to-[#04333a] text-white font-bold py-4 rounded-2xl transition-all flex justify-center items-center gap-2 group shadow-xl shadow-[#04333a]/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing up..." : "Create Account"}
                {!loading && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-gray-600 font-medium"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#0a7a8c] font-bold hover:text-[#58e6fc] transition-colors"
            >
              Sign In here
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
