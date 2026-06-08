import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  AlertTriangle,
  CheckCircle,
  Activity,
  Sparkles,
} from "lucide-react";

const AiSymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post("http://localhost:5000/api/ai/check", {
        symptoms: symptoms,
      });
      setResult(response.data);
    } catch (error) {
      console.error("AI check error:", error);
      setError("Failed to connect to the AI Assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto relative group mt-10"
    >
      {/* Animated Glow Behind the Card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#58e6fc] to-[#04333a] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

      <div className="relative bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-white/50">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-6 border-b border-gray-100">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-br from-[#04333a] to-[#0a7a8c] p-4 rounded-2xl text-white shadow-lg shadow-[#04333a]/30"
          >
            <Bot size={36} />
          </motion.div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-[#04333a] font-serif flex items-center justify-center md:justify-start gap-2">
              MidLink AI Assistant{" "}
              <Sparkles className="text-[#58e6fc] w-6 h-6" />
            </h2>
            <p className="text-gray-500 mt-1 font-medium">
              Describe your symptoms, and our smart AI will guide you to the
              right specialist.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCheck} className="space-y-6">
          <div className="relative">
            <textarea
              className="w-full p-6 text-lg border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#58e6fc]/30 focus:border-[#0a7a8c] resize-none transition-all duration-300 bg-[#f8fafc] text-gray-700 shadow-inner"
              rows="4"
              placeholder="e.g., I have been experiencing severe headaches and slight fever for the past two days..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            ></textarea>
          </div>

          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(4, 51, 58, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !symptoms.trim()}
            className="w-full bg-gradient-to-r from-[#04333a] to-[#0a7a8c] text-white font-bold py-4 px-6 rounded-2xl disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex justify-center items-center gap-3 text-lg overflow-hidden relative"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Activity size={24} className="text-[#58e6fc]" />
                </motion.div>
                Analyzing Symptoms...
              </span>
            ) : (
              <>
                <Bot size={24} /> Ask AI Assistant
              </>
            )}
          </motion.button>
        </form>

        {/* Error Handling */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 font-medium"
            >
              <AlertTriangle className="shrink-0" size={24} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className={`mt-8 p-6 md:p-8 rounded-[2rem] border-2 shadow-xl ${
                result.isEmergency
                  ? "bg-gradient-to-br from-red-50 to-white border-red-300 shadow-red-100"
                  : "bg-gradient-to-br from-teal-50 to-white border-[#58e6fc]/50 shadow-teal-100"
              }`}
            >
              {result.isEmergency && (
                <motion.div
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex items-start md:items-center gap-3 text-red-600 font-bold mb-6 bg-red-100/50 p-4 rounded-xl border border-red-200"
                >
                  <AlertTriangle size={28} className="shrink-0 mt-1 md:mt-0" />
                  <span>
                    WARNING: This looks like a medical emergency! Please seek
                    immediate medical help or call an ambulance.
                  </span>
                </motion.div>
              )}

              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-3 font-serif">
                  <CheckCircle
                    size={28}
                    className={
                      result.isEmergency ? "text-red-500" : "text-[#0a7a8c]"
                    }
                  />
                  Recommended Specialty:
                </h3>
                <div className="inline-block px-4 py-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <span className="text-[#04333a] font-bold text-xl">
                    {result.specialty}
                  </span>
                </div>

                <div className="mt-6 bg-white/60 p-5 rounded-xl border border-gray-100">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    <strong className="text-[#04333a] block mb-2">
                      AI Advice:
                    </strong>
                    {result.advice}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-gray-400 mt-8 text-center font-medium">
          * Disclaimer: This AI tool is for informational purposes only and does
          not replace professional medical diagnosis.
        </p>
      </div>
    </motion.div>
  );
};

export default AiSymptomChecker;
