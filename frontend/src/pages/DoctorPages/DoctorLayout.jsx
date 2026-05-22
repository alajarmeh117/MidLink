import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, MessageSquareQuote } from "lucide-react";
import Sidebar from "./components/Sidebar";

// السماح بإرسال الكوكيز مع الطلبات
axios.defaults.withCredentials = true;

const DoctorLayout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // 1. 🔥 جلب إشعارات الدكتور من الداتابيس
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "https://midlink-of4r.onrender.com/api/notification/notifications",
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching doctor notifications:", error);
    }
  };

  // 2. 🔥 الاتصال المباشر بالسوكيت (Real-time)
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications(); // جلب أولي

      const socket = io("https://midlink-of4r.onrender.com");

      // إدخال الدكتور لغرفته الخاصة بناءً على الـ ID تبعه
      const userId = user.staff_id || user.id;
      if (userId) {
        socket.emit("joinRoom", userId);
      }

      // الاستماع لأي إشعار جديد يخص الدكتور
      socket.on("newNotification", () => {
        fetchNotifications(); // تحديث القائمة والجرس أوتوماتيكياً
      });

      return () => {
        socket.disconnect(); // تنظيف الاتصال عند تسجيل الخروج
      };
    }
  }, [isAuthenticated, user]);

  // 3. إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4. تعليم الإشعار كمقروء
  const handleNotificationClick = async (notif) => {
    try {
      await axios.put(
        `https://midlink-of4r.onrender.com/api/notification/notifications/${notif.id}/read`,
      );
      fetchNotifications();
      setIsNotifOpen(false);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth custom-scrollbar flex flex-col">
        {/* 🌟 NEW: شريط علوي (Top Header) يحتوي على جرس الإشعارات وصورة الدكتور */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-black text-[#0f4c5c] hidden sm:block tracking-tight">
            MidLink Workspace
          </h1>

          <div className="flex items-center gap-6 ml-auto">
            {/* 🔔 Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-slate-400 hover:text-[#0f4c5c] hover:bg-slate-100 rounded-full transition-all"
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(15,76,92,0.2)] border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="bg-[#0f4c5c] p-4 text-white">
                      <h3 className="font-bold tracking-wide text-sm uppercase">
                        Doctor Notifications
                      </h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                          <Bell className="w-10 h-10 mx-auto mb-2 opacity-20" />
                          <p className="text-sm font-medium">
                            No new notifications
                          </p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-4 rounded-2xl mb-1 cursor-pointer transition-colors ${
                              notif.read
                                ? "bg-transparent hover:bg-gray-50"
                                : "bg-[#f0f9fa] hover:bg-[#e6f0f5]"
                            }`}
                          >
                            <div className="flex gap-3">
                              <div
                                className={`mt-1 p-2 rounded-full h-fit ${notif.read ? "bg-gray-100 text-gray-400" : "bg-white shadow-sm text-[#2dd4bf]"}`}
                              >
                                <MessageSquareQuote size={16} />
                              </div>
                              <div>
                                <p
                                  className={`text-sm ${notif.read ? "text-gray-500" : "text-[#0f4c5c] font-bold"}`}
                                >
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-gray-400 font-bold uppercase mt-2 block">
                                  {new Date(
                                    notif.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 🧑‍⚕️ Doctor Profile Image */}
            <div className="h-10 w-10 rounded-full border-2 border-[#2dd4bf] overflow-hidden shadow-sm">
              <img
                src={
                  user?.profile_image
                    ? `https://midlink-of4r.onrender.com/${user.profile_image}`
                    : "https://via.placeholder.com/40"
                }
                alt="Doctor Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Subtle Background Accent (Depth Effect) */}
        <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-[#0f4c5c]/5 to-transparent -z-10 pointer-events-none"></div>

        {/* Outlet Container with Route Transition Animation */}
        <div className="animate-[pageLoad_0.4s_ease-out] flex-1">
          <Outlet />
        </div>
      </main>

      {/* Custom Styles for Scrollbar & Animations */}
      <style>{`
        /* Smooth Page Load Animation for all nested routes */
        @keyframes pageLoad {
          from { 
            opacity: 0; 
            transform: translateY(15px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        /* Modern Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1; /* slate-300 */
          border-radius: 20px;
          transition: background-color 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #2dd4bf; /* MidLink Cyan */
        }
      `}</style>
    </div>
  );
};

export default DoctorLayout;
