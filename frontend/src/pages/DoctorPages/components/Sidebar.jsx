import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaUserMd,
  FaCalendarAlt,
  FaFileAlt,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, checkAuthStatus } from "../../../store/authSlice";
import { getDoctorProfile } from "../../../store/doctorSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, userType } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.doctor);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    dispatch(checkAuthStatus());
    dispatch(getDoctorProfile());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthenticated || userType !== "doctor") {
    return null;
  }

  const navItems = [
    { to: "/home", icon: FaHome, label: "Dashboard" },
    { to: "/DoctorProfile", icon: FaUserMd, label: "Profile" },
    { to: "/DoctorScheduling", icon: FaCalendarAlt, label: "Appointments" },
    // { to: "/patients", icon: FaUserMd, label: "Patients" },
    { to: "/PatientRecords", icon: FaFileAlt, label: "Patient Records" },
  ];

  return (
    <div
      className={`relative flex flex-col h-screen ${
        isExpanded ? "w-64" : "w-20"
      } bg-[#0f4c5c] text-white shadow-2xl transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) font-sans z-50`}
    >
      {/* Profile Section */}
      <div className="relative flex flex-col items-center justify-center pt-8 pb-6 border-b border-white/10">
        <div
          className={`relative transition-all duration-500 ${
            isExpanded ? "w-24 h-24" : "w-12 h-12"
          }`}
        >
          <div className="absolute inset-0 bg-[#2dd4bf] rounded-full animate-pulse opacity-20"></div>
          <img
            className="w-full h-full rounded-full object-cover border-2 border-[#2dd4bf] shadow-lg hover:scale-105 hover:rotate-3 transition-all duration-300 relative z-10 bg-white"
            src={`https://midlink-backend.onrender.com/${profile?.profile_image}`}
            alt={profile?.staff_name || "Doctor"}
          />
        </div>

        <div
          className={`mt-4 text-center overflow-hidden transition-all duration-500 ${
            isExpanded ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <h1 className="text-lg font-bold text-white tracking-wide">
            {profile?.staff_name || "Dr. MidLink"}
          </h1>
          {profile?.specialty && (
            <p className="text-xs text-[#2dd4bf] mt-1 font-medium bg-[#2dd4bf]/10 px-2 py-1 rounded-full inline-block">
              {profile.specialty}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-6 px-3 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-in-out group relative ${
                    isActive
                      ? "bg-[#2dd4bf] text-[#0f4c5c] shadow-md shadow-[#2dd4bf]/20 font-bold"
                      : "text-teal-50 hover:bg-white/10 hover:translate-x-1"
                  }`}
                >
                  <item.icon
                    className={`text-xl transition-transform duration-300 ${
                      isActive ? "text-[#0f4c5c]" : "group-hover:scale-110"
                    } ${isExpanded ? "mr-4" : "mx-auto"}`}
                  />

                  <span
                    className={`whitespace-nowrap transition-all duration-300 ${
                      isExpanded
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4 hidden"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute left-16 bg-[#2dd4bf] text-[#0f4c5c] text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-50 whitespace-nowrap shadow-lg">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Section (Logout & Toggle) */}
      <div className="p-4 border-t border-white/10 bg-black/10">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-3 text-red-300 hover:text-white hover:bg-red-500/80 rounded-xl transition-all duration-300 group"
        >
          <FaSignOutAlt
            className={`text-xl group-hover:scale-110 transition-transform ${isExpanded ? "mr-3" : ""}`}
          />
          {isExpanded && (
            <span className="font-semibold tracking-wide">Logout</span>
          )}
        </button>
      </div>

      {/* Expand/Collapse Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-8 bg-[#2dd4bf] text-[#0f4c5c] p-1.5 rounded-full shadow-lg hover:scale-110 hover:rotate-90 transition-all duration-300 z-50"
      >
        <FaCog className="text-sm" />
      </button>
    </div>
  );
};

export default Sidebar;
