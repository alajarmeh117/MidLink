import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Reply,
  Headset,
  User,
  Mail,
  MessageSquare,
  Send,
  X,
  AlertCircle,
} from "lucide-react";
import Sidebar from "../AdminPages/sidebar";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const ITEMS_PER_PAGE = 5;

// ================= Modal Component =================
const Modal = ({ isOpen, onClose, onSend, contact }) => {
  const [response, setResponse] = useState("");
  const [isSending, setIsSending] = useState(false); // 🔥 State جديدة للتحميل

  const handleSend = async () => {
    if (!response.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Empty Response",
        text: "Please write a message before sending.",
        confirmButtonColor: "#0f4c5c",
      });
      return;
    }

    setIsSending(true); // 🚀 تشغيل التحميل
    await onSend(contact.contact_id, response);
    setIsSending(false); // 🛑 إيقاف التحميل
    setResponse("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0f4c5c] to-[#165a6c] p-6 text-white flex justify-between items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
            <Reply size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-serif font-bold mb-1">
              Reply to Ticket
            </h3>
            <p className="text-teal-100 text-sm flex items-center gap-2">
              <User size={14} /> {contact.name}
              <span className="mx-2">•</span>
              <Mail size={14} /> {contact.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors relative z-10 bg-white/10 p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-6">
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 shadow-inner">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
              <MessageSquare size={14} /> Original Message:
            </p>
            <p className="text-slate-700 text-sm italic">
              &ldquo;{contact.message}&rdquo;
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Your Response <span className="text-red-500">*</span>
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full p-4 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all h-40 resize-none text-slate-700 shadow-inner"
              placeholder="Type your official response here. This will be sent directly to the user's email..."
            />
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={onClose}
              disabled={isSending}
              className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending} // 🔥 تجميد الزر أثناء الإرسال
              className="px-6 py-3 bg-gradient-to-r from-[#2dd4bf] to-[#1ebda7] text-[#0f4c5c] font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0f4c5c]"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} /> Send Reply
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  contact: PropTypes.shape({
    contact_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
};

// ================= Main Page Component =================
const FeedbackPage = () => {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/contacts?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
      );
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setAlert({
        type: "error",
        message: "Failed to fetch customer support tickets.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  const fetchTotalContacts = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/contacts/messages/count",
      );
      setTotalContacts(response.data.count);
    } catch (error) {
      console.error("Error fetching total contacts:", error);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
    fetchTotalContacts();
  }, [fetchContacts, fetchTotalContacts]);

  const totalPages = useMemo(
    () => Math.ceil(totalContacts / ITEMS_PER_PAGE),
    [totalContacts],
  );

  const handlePrevPage = useCallback(
    () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
    [],
  );
  const handleNextPage = useCallback(
    () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
    [totalPages],
  );

  const handleReply = useCallback((contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  }, []);

  const handleSendReply = useCallback(
    async (contactId, response) => {
      try {
        await axios.put("http://localhost:5000/api/contacts/respond", {
          contactId,
          response,
        });
        setIsModalOpen(false);
        fetchContacts();
        Swal.fire({
          icon: "success",
          title: "Sent!",
          text: "Response sent successfully to the user.",
          confirmButtonColor: "#0f4c5c",
        });
      } catch (error) {
        console.error("Error sending reply:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to send response.",
          confirmButtonColor: "#0f4c5c",
        });
      }
    },
    [fetchContacts],
  );

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 min-w-0 p-6 md:p-10 overflow-y-auto animate-[fadeIn_0.4s_ease-in-out]">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#0f4c5c] flex items-center gap-3">
                <Headset className="text-[#2dd4bf]" size={32} />
                Customer Support Hub
              </h1>
              <p className="text-slate-500 mt-2">
                Manage incoming inquiries, user messages, and provide direct
                support.
              </p>
            </div>
            <div className="bg-teal-50/80 px-5 py-3 rounded-xl border border-teal-100 flex items-center gap-3 shadow-inner">
              <span className="text-3xl font-bold text-[#0f4c5c]">
                {totalContacts}
              </span>
              <span className="text-sm font-medium text-slate-600 leading-tight">
                Total
                <br />
                Tickets
              </span>
            </div>
          </div>

          {alert && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 font-medium ${alert.type === "error" ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}
            >
              <AlertCircle size={20} />
              {alert.message}
            </div>
          )}

          {/* Table Container */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-lg border border-white overflow-hidden flex flex-col">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2dd4bf]"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto custom-scrollbar pb-2">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
                        <th className="py-4 px-6 font-bold uppercase tracking-wider whitespace-nowrap">
                          Sender Info
                        </th>
                        <th className="py-4 px-6 font-bold uppercase tracking-wider min-w-[300px]">
                          Message Context
                        </th>
                        <th className="py-4 px-6 font-bold uppercase tracking-wider text-right whitespace-nowrap">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {contacts.length > 0 ? (
                        contacts.map((contact) => (
                          <tr
                            key={contact.contact_id}
                            className="hover:bg-slate-50/80 transition-colors group"
                          >
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#0f4c5c] font-bold shrink-0">
                                  {contact.name
                                    ? contact.name.charAt(0).toUpperCase()
                                    : "U"}
                                </div>
                                <div>
                                  <p className="font-bold text-[#0f4c5c] text-sm">
                                    {contact.name}
                                  </p>
                                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Mail size={12} /> {contact.email}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                                {contact.message}
                              </p>
                            </td>

                            <td className="py-4 px-6 text-right whitespace-nowrap">
                              <button
                                onClick={() => handleReply(contact)}
                                className="px-4 py-2 bg-[#0f4c5c] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 ml-auto hover:bg-[#165a6c] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                              >
                                <Reply size={16} /> Reply
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="py-16 text-center text-slate-500"
                          >
                            <Headset
                              size={48}
                              className="mx-auto text-slate-300 mb-4"
                            />
                            <p className="text-lg font-medium text-[#0f4c5c]">
                              No support tickets found
                            </p>
                            <p className="text-sm mt-1">
                              You're all caught up! User messages will appear
                              here.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-colors shadow-sm"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-bold text-[#0f4c5c] bg-teal-50 px-4 py-2 rounded-lg border border-teal-100">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-colors shadow-sm"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative z-50"
          >
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSend={handleSendReply}
              contact={selectedContact}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #2dd4bf; }
      `}</style>
    </div>
  );
};

export default FeedbackPage;
