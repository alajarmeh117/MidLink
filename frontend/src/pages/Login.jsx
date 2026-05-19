import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  HeartPulse,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { login } from "../store/authSlice";
import { loginAdmin } from "../store/adminAuthSlice";
import DoctorRegistrationModal from "../components/DoctorRegistrationModal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);
  const { loading: adminLoading, error: adminError } = useSelector(
    (state) => state.adminAuth,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userType === "admin") {
        const resultAction = await dispatch(loginAdmin({ email, password }));
        if (loginAdmin.fulfilled.match(resultAction)) {
          navigate("/AdminDashboard");
        }
      } else {
        const resultAction = await dispatch(
          login({ email, password, userType }),
        );
        if (login.fulfilled.match(resultAction)) {
          const { userType } = resultAction.payload;
          navigate(userType === "doctor" ? "/home" : "/");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const displayError = userType === "admin" ? adminError : error;
  const isLoading = userType === "admin" ? adminLoading : loading;

  return (
    <>
      <div className="min-h-screen flex overflow-hidden bg-[#f6f5f2] font-serif">
        {/* زر الرجوع للـ Home - تصميم عصري */}
        <Link
          to="/"
          className="fixed top-5 left-5 flex items-center gap-2 text-[#04333a] bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-[#58e6fc] hover:text-[#04333a] transition-all duration-300 text-sm font-bold z-50 group border border-white/40"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* القسم الأيسر: الأشكال المتحركة والخلفية الفخمة */}
        <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#04333a] via-[#0a7a8c] to-[#04333a] items-center justify-center overflow-hidden">
          <motion.div
            animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 w-96 h-96 bg-[#58e6fc] rounded-full mix-blend-overlay filter blur-3xl opacity-30"
          />
          <motion.div
            animate={{ x: [20, -20, 20], y: [20, -20, 20] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 right-10 w-96 h-96 bg-[#c4f7ff] rounded-full mix-blend-overlay filter blur-3xl opacity-20"
          />

          <div className="relative z-10 text-center px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
                <HeartPulse className="w-16 h-16 text-[#58e6fc]" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl font-extrabold text-white mb-6 leading-tight"
            >
              Welcome Back to <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58e6fc] to-[#c4f7ff]">
                MidLink
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-[#c4f7ff] opacity-80 max-w-md mx-auto leading-relaxed"
            >
              Access your smart healthcare dashboard, manage your appointments,
              and connect seamlessly.
            </motion.p>
          </div>
        </div>

        {/* القسم الأيمن: نموذج تسجيل الدخول */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-full max-w-md py-10"
          >
            {/* Logo for mobile only */}
            <div className="flex items-center gap-2 mb-10 lg:hidden justify-center">
              <HeartPulse className="w-8 h-8 text-[#0a7a8c]" />
              <h2 className="text-3xl font-extrabold text-[#04333a]">
                Mid<span className="text-[#0a7a8c]">Link</span>
              </h2>
            </div>

            <h2 className="text-4xl font-bold text-[#04333a] mb-2 text-center lg:text-left">
              Sign In
            </h2>
            <p className="text-gray-500 mb-8 text-center lg:text-left">
              Select your role and enter your details.
            </p>

            {/* Tabs - تصميم عصري */}
            <div className="mb-8 p-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-between">
              {["patient", "doctor", "admin"].map((type) => (
                <button
                  key={type}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    userType === type
                      ? "bg-[#04333a] text-white shadow-md"
                      : "text-gray-500 hover:text-[#0a7a8c] hover:bg-gray-50"
                  }`}
                  onClick={() => setUserType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
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
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#58e6fc]/30 focus:border-[#0a7a8c] outline-none transition-all shadow-sm text-gray-700 font-sans"
                    placeholder="name@example.com"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-[#04333a]">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-bold text-[#0a7a8c] hover:text-[#58e6fc] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#0a7a8c] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#58e6fc]/30 focus:border-[#0a7a8c] outline-none transition-all shadow-sm text-gray-700 font-sans"
                    placeholder="••••••••"
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

              {displayError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm text-center font-bold bg-red-50 p-3 rounded-xl border border-red-100"
                >
                  {displayError}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-2"
              >
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(4, 51, 58, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#04333a] to-[#0a7a8c] text-white font-bold py-4 rounded-2xl transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-[#04333a]/20"
                >
                  {isLoading
                    ? "Logging in..."
                    : `Sign In as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
                  {!isLoading && (
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Patient: Sign Up link */}
            {userType === "patient" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center text-gray-600 font-medium"
              >
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#0a7a8c] font-bold hover:text-[#58e6fc] transition-colors"
                >
                  Sign Up
                </Link>
              </motion.p>
            )}

            {/* Doctor: Register as Doctor */}
            {userType === "doctor" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 pt-6 border-t border-gray-100 text-center"
              >
                <p className="text-gray-500 text-sm mb-4 font-medium">
                  New to MidLink as a doctor?
                </p>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#f0f9fa" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 border-2 border-[#04333a] text-[#04333a] py-3.5 rounded-2xl font-bold transition duration-300 group"
                >
                  <HeartPulse className="w-5 h-5 group-hover:text-[#58e6fc] transition-colors" />
                  Register as Doctor
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <DoctorRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </>
  );
};

export default Login;
