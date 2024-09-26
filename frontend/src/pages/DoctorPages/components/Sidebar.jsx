
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
      className={`flex flex-col h-screen ${
        isExpanded ? "w-60" : "w-20"
      } bg-[#04333a] text-white shadow-md transition-all duration-300 ease-in-out font-serif ml-1`}
    >
      <div className="relative flex flex-col items-center justify-center mb-2 mt-6 h-40 border-b border-[#BFD2F8] border-opacity-20">
        <div
          className={`relative ${
            isExpanded ? "scale-100" : "scale-75"
          } transition-all duration-300`}
        >
          <img
            className="w-20 h-20 rounded-full object-cover border-2 border-[#BFD2F8] shadow-sm hover:scale-105 transition-transform duration-300"
            src={`http://localhost:5000/${profile?.profile_image}`}
            alt={profile?.staff_name || "Doctor"}
          />
        </div>
        {isExpanded && (
          <div className="mt-2 text-center">
            <h1 className="text-lg font-semibold text-white">
              {profile?.staff_name || "Doctor"}
            </h1>
            {profile?.specialty && (
              <p className="text-xs text-white mt-1 opacity-70">
                {profile.specialty}
              </p>
            )}
          </div>
        )}
      </div>
      <nav className="flex-1 mt-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center px-3 py-4 rounded-md text-white hover:bg-[#BFD2F8] hover:bg-opacity-10 transition-all duration-200 ease-in-out ${
                  location.pathname === item.to
                    ? "bg-[#BFD2F8] bg-opacity-10"
                    : ""
                }`}
              >
                <item.icon
                  className={`${
                    isExpanded ? "mr-3" : "mx-auto"
                  } text-white text-lg`}
                />
                {isExpanded && <span className="text-sm">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-3 py-3 border-t border-[#BFD2F8] border-opacity-20">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-3 py-2 text-white hover:bg-[#BFD2F8] hover:bg-opacity-10 rounded-md transition-all duration-200 ease-in-out"
        >
          <FaSignOutAlt className={`${isExpanded ? "mr-3" : ""} text-lg`} />
          {isExpanded && <span className="text-sm">Logout</span>}
        </button>
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-2 right-2 p-1 rounded-full text-white hover:bg-[#BFD2F8] hover:bg-opacity-10 transition-all duration-200 ease-in-out"
      >
        <FaCog className="text-lg" />
      </button>
    </div>
  );
};

export default Sidebar;