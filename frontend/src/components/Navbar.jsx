import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, checkAuthStatus, getProfile } from "../store/authSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Menu,
  X,
  User,
  LogOut,
  FileText,
  Activity,
  Settings,
  MessageSquareQuote,
} from "lucide-react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [notifications, setNotifications] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(checkAuthStatus());
    if (isAuthenticated) {
      dispatch(getProfile());
      fetchNotifications();
    }
  }, [dispatch, isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "https://midlink-of4r.onrender.com/api/notification/notifications",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(event.target)
    ) {
      setIsNotificationDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // 🔥 التعديل الأول: دالة احترافية لمعالجة الصورة (تمنع كسر الصورة تماماً)
  const getProfileImageUrl = () => {
    if (
      user &&
      user.profile_image &&
      user.profile_image !== "null" &&
      user.profile_image !== "undefined"
    ) {
      return `https://midlink-of4r.onrender.com/${user.profile_image}`;
    }
    // إذا ما في صورة، اصنع صورة بأول حرف من اسمه بألوان السيستم
    const displayName = user?.username || user?.staff_name || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0a7a8c&color=fff&bold=true`;
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(
        `https://midlink-of4r.onrender.com/api/notification/notifications/${notificationId}/read`,
        null,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      await handleMarkAsRead(notification.id);
      const doctorId = notification.doctor_id;
      if (doctorId) {
        navigate(`/doctor/${doctorId}`, {
          state: { commentId: notification.comment_id },
        });
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
    setIsNotificationDropdownOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Our Doctor", path: "/doctor" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-500 font-sans ${
        scrolled
          ? "bg-white/80 backdrop-blur-2xl shadow-[0_10px_30px_-15px_rgba(4,51,58,0.1)] border-b border-white/50 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* 🌟 Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-[#0a7a8c] to-[#04333a] text-white p-2 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <span
            className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${scrolled ? "text-[#04333a]" : "text-white"}`}
          >
            Mid
            <span className={scrolled ? "text-[#0a7a8c]" : "text-[#58e6fc]"}>
              Link
            </span>
          </span>
        </Link>

        {/* 💻 Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const textColor = scrolled
              ? isActive
                ? "text-[#0a7a8c]"
                : "text-gray-500 hover:text-[#04333a]"
              : isActive
                ? "text-[#58e6fc]"
                : "text-white/80 hover:text-white";
            const underlineColor = scrolled
              ? "after:bg-[#0a7a8c]"
              : "after:bg-[#58e6fc]";

            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`text-sm font-bold tracking-wide uppercase transition-all duration-300 relative py-2 ${textColor} after:absolute after:bottom-0 after:left-0 after:h-0.5 ${underlineColor} after:transition-all after:duration-300 ${
                    isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}

          {isAuthenticated && (
            <li>
              <Link
                to="/feedback"
                className={`text-sm font-bold tracking-wide uppercase transition-all duration-300 relative py-2 ${
                  scrolled
                    ? location.pathname === "/feedback"
                      ? "text-[#0a7a8c]"
                      : "text-gray-500 hover:text-[#04333a]"
                    : location.pathname === "/feedback"
                      ? "text-[#58e6fc]"
                      : "text-white/80 hover:text-white"
                } after:absolute after:bottom-0 after:left-0 after:h-0.5 ${scrolled ? "after:bg-[#0a7a8c]" : "after:bg-[#58e6fc]"} after:transition-all after:duration-300 ${
                  location.pathname === "/feedback"
                    ? "after:w-full"
                    : "after:w-0 hover:after:w-full"
                }`}
              >
                Feedback
              </Link>
            </li>
          )}
        </ul>

        {/* 👤 Right Side Actions */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {isAuthenticated ? (
            <>
              {/* 🔔 Notifications */}
              <div className="relative" ref={notificationDropdownRef}>
                <button
                  onClick={() =>
                    setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
                  }
                  className={`relative p-2 rounded-full transition-colors duration-300 ${
                    scrolled
                      ? "text-gray-500 hover:text-[#0a7a8c] hover:bg-[#e6f0f5]"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Bell size={24} />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_-15px_rgba(4,51,58,0.2)] border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="bg-gradient-to-r from-[#04333a] to-[#0a7a8c] p-4 text-white">
                        <h3 className="font-bold tracking-wide">
                          Notifications
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
                                  className={`mt-1 p-2 rounded-full h-fit ${notif.read ? "bg-gray-100 text-gray-400" : "bg-white shadow-sm text-[#0a7a8c]"}`}
                                >
                                  <MessageSquareQuote size={16} />
                                </div>
                                <div>
                                  <p
                                    className={`text-sm ${notif.read ? "text-gray-500" : "text-[#04333a] font-bold"}`}
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

              {/* 🧑‍💼 Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`cursor-pointer border-2 p-0.5 rounded-full transition-all duration-300 ${
                    scrolled
                      ? "border-transparent hover:border-[#0a7a8c]"
                      : "border-white/20 hover:border-white"
                  }`}
                >
                  <img
                    src={getProfileImageUrl()}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full object-cover shadow-md bg-white"
                  />
                </div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-60 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_-15px_rgba(4,51,58,0.2)] border border-gray-100 p-3 z-50"
                    >
                      <div className="px-4 py-3 mb-2 border-b border-gray-100">
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">
                          Signed in as
                        </p>
                        {/* 🔥 التعديل الثاني: عرض اسم الدكتور أو المريض بشكل صحيح */}
                        <p className="text-[#04333a] font-black truncate">
                          {user?.username || user?.staff_name || "User"}
                        </p>
                      </div>

                      <ul className="space-y-1">
                        <li>
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 rounded-2xl hover:bg-[#e6f0f5] hover:text-[#0a7a8c] transition-colors"
                          >
                            <Settings size={18} /> Account Settings
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/history"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 rounded-2xl hover:bg-[#e6f0f5] hover:text-[#0a7a8c] transition-colors"
                          >
                            <Activity size={18} /> Medical History
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/prescription"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 rounded-2xl hover:bg-[#e6f0f5] hover:text-[#0a7a8c] transition-colors"
                          >
                            <FileText size={18} /> Prescriptions
                          </Link>
                        </li>
                        <li className="pt-2 mt-2 border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 rounded-2xl hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={18} /> Sign Out
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/login"
                className={`text-sm font-bold px-4 py-2 transition-colors uppercase tracking-wider ${
                  scrolled
                    ? "text-gray-600 hover:text-[#0a7a8c]"
                    : "text-white/90 hover:text-white"
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-bold text-white bg-gradient-to-r from-[#04333a] to-[#0a7a8c] px-6 py-2.5 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all uppercase tracking-wider"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* 📱 Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors duration-300 ${
              scrolled
                ? "text-[#04333a] bg-[#e6f0f5] hover:bg-[#c4f7ff]"
                : "text-white bg-white/10 hover:bg-white/20"
            }`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 📱 Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-gray-100 shadow-xl overflow-hidden"
          >
            <ul className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg font-black text-[#04333a] hover:text-[#0a7a8c] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {isAuthenticated && (
                <li>
                  <Link
                    to="/feedback"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg font-black text-[#04333a] hover:text-[#0a7a8c] transition-colors"
                  >
                    Feedback
                  </Link>
                </li>
              )}
              {!isAuthenticated && (
                <li className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center text-lg font-bold text-[#04333a] bg-gray-50 py-3 rounded-2xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center text-lg font-bold text-white bg-[#0a7a8c] py-3 rounded-2xl shadow-lg"
                  >
                    Get Started
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
