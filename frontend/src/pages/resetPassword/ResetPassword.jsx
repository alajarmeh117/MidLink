import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match!");
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await axios.post(
        `https://midlink-of4r.onrender.com/api/auth/reset-password/${id}/${token}`,
        { password },
      );
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 3000); // تحويل لشاشة اللوجن بعد 3 ثواني
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f5f2] font-serif p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50"
      >
        <div className="bg-[#e6f0f5] w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
          {message ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : (
            <ShieldCheck className="w-8 h-8 text-[#0a7a8c]" />
          )}
        </div>
        <h2 className="text-3xl font-black text-[#04333a] mb-2 text-center">
          Set New Password
        </h2>

        {message ? (
          <div className="text-center text-green-600 font-bold mt-4">
            {message}
            <br />
            <span className="text-sm font-normal">Redirecting to login...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg font-bold">
                {error}
              </p>
            )}
            <div className="relative group">
              <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-[#0a7a8c]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="New Password"
                minLength="6"
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#58e6fc] outline-none font-bold"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-[#0a7a8c]" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm New Password"
                minLength="6"
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#58e6fc] outline-none font-bold"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#04333a] text-white font-black py-4 rounded-2xl hover:bg-[#0a7a8c] transition-all"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
