import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AppointmentForm from "./AppointmentForm";
import CommentSection from "./CommentSection";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaRegStar } from "react-icons/fa";
import {
  UserPlus,
  Mail,
  CalendarCheck,
  Stethoscope,
  Award,
  ShieldCheck,
  Sparkles,
  MessageSquareQuote,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import PropTypes from "prop-types";

// ── مكوّن عرض النجوم ──────────────────────────────────────
const StarRating = ({ average, total }) => {
  if (total === 0 || average === null) {
    return (
      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 w-fit">
        <Sparkles className="w-4 h-4 text-gray-400" />
        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
          New Doctor
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-yellow-50/50 border border-yellow-100 px-4 py-2 rounded-full w-fit">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= Math.round(average) ? (
              <FaStar className="text-yellow-400 w-5 h-5 drop-shadow-sm" />
            ) : (
              <FaRegStar className="text-yellow-300 w-5 h-5" />
            )}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1.5 border-l border-yellow-200 pl-3">
        <span className="text-[#04333a] font-black text-lg">
          {Number(average).toFixed(1)}
        </span>
        <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">
          ({total} Reviews)
        </span>
      </div>
    </div>
  );
};

StarRating.propTypes = {
  average: PropTypes.number,
  total: PropTypes.number.isRequired,
};

// ── Contact Modal ──────────────────────────────────────────
const ContactDoctorModal = ({ isOpen, onClose, doctor }) => {
  const [message, setMessage] = useState("");

  const handleSend = useCallback(async () => {
    try {
      await axios.post(
        "https://midlink-backend.onrender.com/api/contact-doctor",
        {
          doctorId: doctor.staff_id,
          message,
        },
      );
      onClose();
      Swal.fire({
        title: "Message Sent!",
        text: "Your secure message has been delivered to the doctor.",
        icon: "success",
        confirmButtonColor: "#0a7a8c",
        customClass: {
          popup: "rounded-[2rem] shadow-2xl border border-gray-100",
          title: "text-[#04333a] font-black",
        },
      });
      setMessage(""); // Clear message after sending
    } catch (error) {
      console.error("Error sending message:", error);
      Swal.fire({
        title: "Delivery Failed",
        text: "We couldn't send your message securely. Please try again.",
        icon: "error",
        confirmButtonColor: "#e3342f",
        customClass: {
          popup: "rounded-[2rem] shadow-2xl",
          title: "text-[#04333a] font-black",
        },
      });
    }
  }, [doctor.staff_id, message, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#04333a]/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-lg w-full border border-white/20 relative overflow-hidden"
          >
            {/* Decorative background glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#58e6fc] rounded-full blur-[60px] opacity-20 pointer-events-none" />

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="bg-[#e6f0f5] p-4 rounded-2xl">
                <Mail className="w-8 h-8 text-[#0a7a8c]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#04333a] tracking-tight">
                  Message Dr. {doctor.staff_name.split(" ")[0]}
                </h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Secure Direct Channel
                </p>
              </div>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100">
                <ShieldCheck className="text-green-500 w-5 h-5" />
                <span className="text-sm font-bold text-gray-600">
                  End-to-end encrypted messaging
                </span>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-[#58e6fc] focus:ring-4 focus:ring-[#58e6fc]/20 outline-none transition-all duration-300 resize-none font-medium text-[#04333a]"
                rows="5"
                placeholder="Type your medical inquiry here..."
              />

              <div className="flex justify-end gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-8 py-4 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 20px -10px rgba(4,51,58,0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-[#04333a] to-[#0a7a8c] text-white font-black rounded-2xl shadow-xl flex items-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Send Message <Mail className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ContactDoctorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  doctor: PropTypes.shape({
    staff_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    staff_name: PropTypes.string.isRequired,
  }).isRequired,
};

// ── الصفحة الرئيسية ────────────────────────────────────────
const DoctorProfilePage = () => {
  const [doctor, setDoctor] = useState(null);
  const [rating, setRating] = useState({
    average_rating: null,
    total_reviews: 0,
  });
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const [currentUserId, setCurrentUserId] = useState(null);
  const location = useLocation();
  const commentSectionRef = useRef(null);

  useEffect(() => {
    fetchDoctor();
    fetchComments();
    fetchCurrentUser();
    fetchRating();
  }, [id]);

  useEffect(() => {
    if (location.state?.commentId && commentSectionRef.current) {
      const commentElement = document.getElementById(
        `comment-${location.state.commentId}`,
      );
      if (commentElement) {
        commentElement.scrollIntoView({ behavior: "smooth", block: "center" });
        commentElement.classList.add("highlight-comment"); // Ensure you have this class in your CSS if needed
      }
    }
  }, [location, comments]);

  const fetchDoctor = async () => {
    try {
      const response = await fetch(
        `https://midlink-backend.onrender.com/api/doctors/${id}`,
      );
      const data = await response.json();
      setDoctor(data);
    } catch (error) {
      console.error("Error fetching doctor:", error);
    }
  };

  const fetchRating = async () => {
    try {
      const response = await axios.get(
        `https://midlink-backend.onrender.com/api/appointment/doctor/${id}/rating`,
      );
      setRating(response.data);
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `https://midlink-backend.onrender.com/api/comment/doctors/${id}/comments`,
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(
        "https://midlink-backend.onrender.com/api/patients/profile",
        {
          withCredentials: true,
        },
      );
      setCurrentUserId(response.data.id);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const addComment = async (commentText, parentCommentId = null) => {
    try {
      const response = await axios.post(
        "https://midlink-backend.onrender.com/api/comment/doctors/comments",
        {
          doctor_id: id,
          parent_comment_id: parentCommentId,
          comment_text: commentText,
        },
        { withCredentials: true },
      );
      setComments([response.data, ...comments]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const updateComment = async (commentId, newText) => {
    try {
      await axios.put(
        `https://midlink-backend.onrender.com/api/comment/doctors/comments/${commentId}`,
        { comment_text: newText },
        { withCredentials: true },
      );
      setComments(
        comments.map((c) =>
          c.comment_id === commentId ? { ...c, comment_text: newText } : c,
        ),
      );
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(
        `https://midlink-backend.onrender.com/api/comment/doctors/comments/${commentId}`,
        {
          withCredentials: true,
        },
      );
      setComments(comments.filter((c) => c.comment_id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (!doctor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f8fafc]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-16 h-16 text-[#0a7a8c]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] flex flex-col min-h-screen font-sans">
      <Navbar />

      {/* 🌊 Dynamic Hero Banner */}
      <div className="bg-[#04333a] pt-40 pb-56 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0a7a8c] rounded-full blur-[120px] opacity-30 -mr-48 -mt-48 pointer-events-none" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-[#58e6fc] rounded-full mix-blend-overlay blur-[80px] opacity-20 pointer-events-none"
        />
      </div>

      <div className="flex-grow container mx-auto px-4 sm:px-6 max-w-6xl -mt-48 relative z-10 pb-32">
        {/* 🩺 Doctor Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(4,51,58,0.15)] overflow-hidden border border-gray-50 mb-12"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-2/5 relative bg-[#e6f0f5] flex items-center justify-center p-10 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-64 h-64 lg:w-80 lg:h-80"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0a7a8c] to-[#58e6fc] rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <img
                  className="w-full h-full object-cover rounded-full border-8 border-white shadow-2xl relative z-10"
                  src={
                    doctor.profile_image
                      ? `https://midlink-backend.onrender.com/${doctor.profile_image}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={doctor.staff_name}
                  onError={(e) => {
                    e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
                  }}
                />
                <div className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-xl z-20 border border-gray-100 text-green-500">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              </motion.div>
            </div>

            {/* Info Section */}
            <div className="lg:w-3/5 p-10 lg:p-14 flex flex-col justify-center bg-white relative">
              <div className="absolute top-10 right-10 opacity-5 pointer-events-none">
                <Award size={150} />
              </div>

              <div className="mb-4">
                <span className="inline-flex items-center gap-2 bg-[#e6f0f5] text-[#0a7a8c] px-4 py-1.5 rounded-full text-sm font-black tracking-widest uppercase mb-4">
                  <Stethoscope className="w-4 h-4" /> {doctor.specialty}{" "}
                  Specialist
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-[#04333a] tracking-tight mb-4">
                  Dr. {doctor.staff_name}
                </h1>
              </div>

              {/* Rating Component */}
              <div className="mb-8">
                <StarRating
                  average={rating.average_rating}
                  total={rating.total_reviews}
                />
              </div>

              <div className="mb-10 bg-gray-50 p-6 rounded-3xl border border-gray-100 relative">
                <MessageSquareQuote className="absolute top-4 right-4 text-gray-200 w-10 h-10" />
                <p className="text-gray-600 font-serif italic text-lg leading-relaxed relative z-10">
                  &ldquo;
                  {doctor.bio ||
                    "Dedicated healthcare professional committed to providing exceptional patient care and advancing medical practices."}
                  &rdquo;
                </p>
              </div>

              {/* 🗺️ Google Map Integration (عيادة الطبيب) */}
              {doctor.clinic_address && (
                <div className="mb-10 bg-gray-50 p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[#04333a] font-black flex items-center gap-2 uppercase tracking-widest text-sm">
                      <MapPin className="text-[#0a7a8c] w-5 h-5" /> Clinic
                      Location
                    </h4>
                    {/* 🔥 زر عالمي يفتح تطبيق Google Maps للمريض */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.clinic_address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0a7a8c] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#04333a] transition-colors flex items-center gap-1 shadow-md"
                    >
                      Get Directions
                    </a>
                  </div>

                  <div className="w-full h-56 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
                    <iframe
                      title="Clinic Location"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(doctor.clinic_address)}&t=m&z=15&output=embed&iwloc=near`}
                    ></iframe>
                  </div>

                  <p className="text-sm text-gray-600 mt-4 font-bold px-2 flex items-start gap-2 leading-relaxed">
                    <span className="w-2 h-2 mt-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
                    {doctor.clinic_address}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 15px 30px -10px rgba(4,51,58,0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAppointmentForm(true)}
                  className="flex-1 bg-gradient-to-r from-[#04333a] to-[#0a7a8c] text-white px-8 py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 transition-all uppercase tracking-widest"
                >
                  Book Appointment <CalendarCheck className="w-6 h-6" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowContactModal(true)}
                  className="sm:w-auto bg-white border-2 border-[#e6f0f5] text-[#04333a] px-8 py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-[#e6f0f5] transition-all uppercase tracking-widest"
                >
                  Message <Mail className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 📅 Appointment Form Modal */}
        {showAppointmentForm && (
          <AppointmentForm
            doctor={doctor}
            onClose={() => setShowAppointmentForm(false)}
          />
        )}

        {/* ✉️ Contact Doctor Modal */}
        <ContactDoctorModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          doctor={doctor}
        />

        {/* 💬 Comments & Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          ref={commentSectionRef}
          className="bg-white rounded-[3rem] shadow-[0_10px_40px_-15px_rgba(4,51,58,0.1)] p-8 md:p-12 border border-gray-50"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-[#e6f0f5] p-3 rounded-2xl">
              <UserPlus className="text-[#0a7a8c] w-8 h-8" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-[#04333a] tracking-tight">
                Patient Reviews & Q&A
              </h3>
              <p className="text-gray-500 font-serif italic mt-1">
                Read experiences or ask a public question
              </p>
            </div>
          </div>

          <CommentSection
            comments={comments}
            addComment={addComment}
            updateComment={updateComment}
            deleteComment={deleteComment}
            currentUserId={currentUserId}
          />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorProfilePage;
