import { useState, useEffect } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquareQuote,
  Send,
  Sparkles,
  User,
  Calendar,
  Quote,
  RefreshCw,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE_URL = "https://midlink-backend.onrender.com";

const Feedback = () => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasExistingFeedback, setHasExistingFeedback] = useState(false); // 🔥 حالة جديدة لمعرفة إذا عنده تقييم

  // السماح بإرسال الكوكيز (التوكن) مع كل الطلبات
  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchFeedbacks();
    fetchMyFeedback(); // 🔥 جلب تقييم المستخدم الحالي
  }, []);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/feedback`);
      setFeedbacks(response.data.feedbacks || []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setError("Failed to load feedbacks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 دالة سحب تقييم المريض
  const fetchMyFeedback = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/feedback/me`);
      if (response.data.success && response.data.feedback) {
        setContent(response.data.feedback.content);
        setRating(response.data.feedback.rating);
        setHasExistingFeedback(true); // نغير حالة الزر لـ Update
      }
    } catch (error) {
      console.error("Error fetching my feedback:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }
    try {
      // 🔥 البوست هاد بيشتغل للحالتين (إضافة وتعديل) بفضل الـ UPSERT بالباك-إند
      await axios.post(`${API_BASE_URL}/api/feedback`, { content, rating });

      toast.success(
        hasExistingFeedback
          ? "Feedback updated successfully! 🌟"
          : "Feedback submitted successfully! 🎉",
      );
      setHasExistingFeedback(true);
      fetchFeedbacks(); // تحديث الحائط
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-[#f6f5f2] min-h-screen font-sans overflow-hidden">
      <Navbar />
      <Toaster position="top-center" />

      {/* ✨ Aesthetic Header */}
      <div className="pt-36 pb-20 px-6 container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-white/50 backdrop-blur-md border border-[#58e6fc]/30 text-[#0a7a8c] px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6 inline-block shadow-sm">
            Community Voice
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-[#04333a] mb-6 tracking-tighter leading-none">
            Your Feedback{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a7a8c] to-[#58e6fc]">
              Matters.
            </span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-serif italic max-w-2xl mx-auto opacity-90">
            &ldquo;Help us shape the future of Jordanian digital healthcare.
            Every word you share makes MidLink better.&rdquo;
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 pb-32 relative z-20">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* 🌟 Interactive Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(4,51,58,0.1)] border border-gray-50 relative group"
          >
            <div className="absolute -top-6 -left-6 bg-gradient-to-br from-[#58e6fc] to-[#0a7a8c] p-5 rounded-[2rem] text-white shadow-xl group-hover:scale-110 transition-transform duration-300">
              <MessageSquareQuote size={36} />
            </div>

            <h3 className="text-2xl font-black text-[#04333a] mb-10 pt-4 tracking-tight flex items-center gap-2">
              {hasExistingFeedback
                ? "Update Your Experience"
                : "Share Your Experience"}
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Gamified Star Selection */}
              <div className="mb-8">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 text-center">
                  Rate our service
                </label>
                <div className="flex justify-center gap-2 p-6 bg-gray-50 border border-gray-100 rounded-[2rem] shadow-inner">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.3, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(ratingValue)}
                        className="cursor-pointer"
                      >
                        <FaStar
                          className={`text-4xl transition-all duration-300 ${
                            ratingValue <= (hoverRating || rating)
                              ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                              : "text-gray-200"
                          }`}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="content"
                    className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent p-6 rounded-[2rem] focus:bg-white focus:border-[#58e6fc]/50 focus:ring-4 focus:ring-[#58e6fc]/10 outline-none transition-all resize-none shadow-inner font-serif text-lg text-[#04333a]"
                    placeholder="Describe your journey with MidLink..."
                    rows="5"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#04333a] to-[#0a7a8c] text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-[#04333a]/20 flex items-center justify-center gap-3 hover:brightness-110 transition-all uppercase tracking-widest group"
                >
                  {hasExistingFeedback ? (
                    <>
                      Update Feedback{" "}
                      <RefreshCw
                        size={20}
                        className="group-hover:rotate-180 transition-transform duration-500"
                      />
                    </>
                  ) : (
                    <>
                      Submit Feedback{" "}
                      <Send
                        size={20}
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* 🖼️ Community Wall: Real-time Feedbacks */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-8 pt-4">
              <div className="h-px bg-gray-200 flex-grow" />
              <h3 className="text-lg font-black text-[#04333a] uppercase tracking-[0.2em] flex items-center gap-2">
                <Sparkles className="text-yellow-400 w-5 h-5" /> Previous
                Feedback
              </h3>
              <div className="h-px bg-gray-200 flex-grow" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {isLoading ? (
                  <div className="col-span-full text-center py-20">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block"
                    >
                      <Sparkles className="text-[#0a7a8c] w-10 h-10" />
                    </motion.div>
                    <p className="mt-4 text-[#0a7a8c] font-black tracking-widest uppercase text-sm animate-pulse">
                      Loading feedback...
                    </p>
                  </div>
                ) : error ? (
                  <div className="col-span-full text-center py-20 text-red-500 font-bold bg-red-50 rounded-3xl border border-red-100">
                    {error}
                  </div>
                ) : feedbacks.length === 0 ? (
                  <div className="col-span-full text-center py-20 text-gray-400 font-serif italic text-lg">
                    No feedback available yet. Be the first!
                  </div>
                ) : (
                  feedbacks.map((feedback, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-50 relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                      {/* Background Watermark */}
                      <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <Quote size={120} />
                      </div>

                      {/* Stars */}
                      <div className="flex gap-1 text-yellow-400 mb-5 bg-yellow-50/50 w-fit px-3 py-1.5 rounded-full">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={14}
                            color={i < feedback.rating ? "#facc15" : "#e4e5e9"}
                          />
                        ))}
                      </div>

                      <p className="text-gray-600 italic font-serif text-base mb-6 leading-relaxed relative z-10 line-clamp-4">
                        &ldquo;{feedback.content}&rdquo;
                      </p>

                      <div className="flex items-center justify-between border-t border-gray-50 pt-5 mt-auto">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#e6f0f5] p-2 rounded-full text-[#0a7a8c]">
                            <User size={14} />
                          </div>
                          <p className="font-bold text-[#04333a] text-sm">
                            {feedback.username}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          <Calendar size={12} />{" "}
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Custom Scrollbar Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `,
        }}
      />
    </div>
  );
};

export default Feedback;
