import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "./sidebar";
import {
  MessageSquare,
  Star,
  Trash2,
  RefreshCw,
  User,
  Calendar,
  ShieldAlert,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/feedback`);
      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setError("Failed to load feedbacks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeedbackStatus = async (feedbackId, currentStatus) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/feedback/admin/feedbacks/${feedbackId}`,
        {
          is_deleted: !currentStatus,
        },
      );

      if (response.data.success) {
        const updatedFeedbacks = feedbacks.map((feedback) =>
          feedback.id === feedbackId
            ? { ...feedback, is_deleted: !currentStatus }
            : feedback,
        );
        setFeedbacks(updatedFeedbacks);

        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `The feedback has been ${!currentStatus ? "deleted" : "restored"} successfully.`,
          confirmButtonColor: "#0f4c5c",
        });
      }
    } catch (error) {
      console.error("Error updating feedback status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating the feedback status.",
        confirmButtonColor: "#0f4c5c",
      });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={
              index < rating
                ? "text-amber-400 fill-amber-400"
                : "text-slate-200 fill-slate-200"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-w-0 p-6 md:p-10 overflow-y-auto animate-[fadeIn_0.4s_ease-in-out]">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#0f4c5c] flex items-center gap-3">
                <MessageSquare className="text-[#2dd4bf]" size={32} />
                Feedback Management
              </h1>
              <p className="text-slate-500 mt-2">
                Monitor patient reviews, manage platform reputation, and
                moderate feedback.
              </p>
            </div>

            <div className="bg-teal-50 px-5 py-3 rounded-xl border border-teal-100 flex items-center gap-3">
              <span className="text-3xl font-bold text-[#0f4c5c]">
                {feedbacks.length}
              </span>
              <span className="text-sm font-medium text-slate-600 leading-tight">
                Total
                <br />
                Reviews
              </span>
            </div>
          </div>

          {/* Loading & Error States */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2dd4bf]"></div>
            </div>
          )}

          {error && !isLoading && (
            <div className="bg-red-50 text-red-600 p-6 rounded-[2rem] border border-red-100 text-center flex flex-col items-center gap-3">
              <ShieldAlert size={40} className="text-red-400" />
              <p className="font-bold text-lg">{error}</p>
            </div>
          )}

          {/* Table Container */}
          {!isLoading && !error && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                      <th className="py-4 px-6 font-bold uppercase tracking-wider">
                        User
                      </th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider">
                        Feedback Content
                      </th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider">
                        Date
                      </th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {feedbacks.length > 0 ? (
                      feedbacks.map((feedback) => (
                        <tr
                          key={feedback.id}
                          className={`transition-colors group ${feedback.is_deleted ? "bg-slate-50/50 grayscale-[50%]" : "hover:bg-slate-50"}`}
                        >
                          {/* User */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#0f4c5c] font-bold">
                                <User size={18} />
                              </div>
                              <span className="font-bold text-[#0f4c5c]">
                                {feedback.username}
                              </span>
                            </div>
                          </td>

                          {/* Content */}
                          <td className="py-4 px-6">
                            <p
                              className="text-slate-600 text-sm max-w-xs truncate"
                              title={feedback.content}
                            >
                              &ldquo;{feedback.content}&rdquo;
                            </p>
                          </td>

                          {/* Rating */}
                          <td className="py-4 px-6">
                            {renderStars(feedback.rating)}
                          </td>

                          {/* Date */}
                          <td className="py-4 px-6">
                            <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                              <Calendar size={14} className="text-slate-400" />
                              {new Date(
                                feedback.created_at,
                              ).toLocaleDateString()}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-bold w-fit flex items-center gap-1 ${
                                feedback.is_deleted
                                  ? "bg-slate-200 text-slate-500"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {feedback.is_deleted
                                ? "Hidden / Deleted"
                                : "Public / Active"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() =>
                                toggleFeedbackStatus(
                                  feedback.id,
                                  feedback.is_deleted,
                                )
                              }
                              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ml-auto transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                                feedback.is_deleted
                                  ? "bg-slate-800 text-white hover:bg-slate-700"
                                  : "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"
                              }`}
                            >
                              {feedback.is_deleted ? (
                                <>
                                  <RefreshCw size={16} /> Restore
                                </>
                              ) : (
                                <>
                                  <Trash2 size={16} /> Hide
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-12 text-center text-slate-500"
                        >
                          <MessageSquare
                            size={48}
                            className="mx-auto text-slate-300 mb-3"
                          />
                          <p className="text-lg font-medium">
                            No feedback available
                          </p>
                          <p className="text-sm">
                            When users leave reviews, they will appear here.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedback;
