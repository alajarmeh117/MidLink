import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ShieldCheck, Send } from "lucide-react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // رح نستخدمها لاحقاً عشان نطلع رسالة النجاح

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f5f2] font-serif relative overflow-hidden p-6">
      {/* 🌌 Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-[#58e6fc] rounded-full blur-[120px] opacity-20"
        />
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-[#0a7a8c] rounded-full blur-[100px] opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(4,51,58,0.1)] border border-white relative z-10"
      >
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0a7a8c] font-bold text-sm mb-8 transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Back to Login
        </Link>

        <div className="bg-[#e6f0f5] w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <ShieldCheck className="w-8 h-8 text-[#0a7a8c]" />
        </div>

        <h2 className="text-3xl font-black text-[#04333a] mb-2 tracking-tight">
          Forgot Password?
        </h2>
        <p className="text-gray-500 text-sm mb-8 font-medium">
          No worries! Enter the email address associated with your account, and
          we'll send you a link to reset your password.
        </p>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 text-sm font-bold mb-6 text-center"
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#0a7a8c] transition-colors" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-14 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#58e6fc] focus:ring-4 focus:ring-[#58e6fc]/20 outline-none transition-all font-bold text-[#04333a]"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(10, 122, 140, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full bg-gradient-to-r from-[#0a7a8c] to-[#04333a] text-white font-black py-4 rounded-2xl transition-all flex justify-center items-center gap-2 group shadow-xl shadow-[#04333a]/20 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Send Reset Link{" "}
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
