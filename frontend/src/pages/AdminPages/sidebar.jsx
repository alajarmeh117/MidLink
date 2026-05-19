import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserMd,
  FaUserPlus,
  FaClipboardList,
  FaComments,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../store/adminAuthSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-64 min-w-[256px] h-screen bg-[#04333a] text-white fixed top-0 left-0 z-50 overflow-y-auto">
      <div className="p-4 text-2xl font-bold">Admin Dashboard</div>
      <ul className="mt-4">
        <li className="p-2">
          <Link
            to="/AdminDashboard"
            className="flex items-center gap-2 hover:bg-[#2c565c] p-2 rounded"
          >
            <FaHome /> Home
          </Link>
        </li>
        <li className="p-2">
          <Link
            to="/AdminDashboard/manage-doctors"
            className="flex items-center gap-2 hover:bg-[#2c565c] p-2 rounded"
          >
            <FaUserMd /> Manage All Doctors
          </Link>
        </li>
        <li className="p-2">
          <Link
            to="/AdminDashboard/add-patient"
            className="flex items-center gap-2 hover:bg-[#2c565c] p-2 rounded"
          >
            <FaUserPlus /> Add Patient
          </Link>
        </li>
        <li className="p-2">
          <Link
            to="/AdminDashboard/manage-patients"
            className="flex items-center gap-2 hover:bg-[#2c565c] p-2 rounded"
          >
            <FaClipboardList /> Manage All Patients
          </Link>
        </li>
        <li className="p-2">
          <Link
            to="/AdminDashboard/show-feedback"
            className="flex items-center gap-2 hover:bg-[#2c565c] p-2 rounded"
          >
            <FaComments /> Show Feedback
          </Link>
        </li>
        <li className="p-2">
          <Link
            to="/AdminDashboard/schedule"
            className="flex items-center gap-2 hover:bg-[#2c565c] p-2 rounded"
          >
            <FaCalendarAlt /> Doctor Schedule date
          </Link>
        </li>
        <li className="p-2">
          <Link
            to="/AdminDashboard/Appointement"
            className="flex items-center gap-2 hover:bg-[#2c565c] p-2 rounded"
          >
            <FaCalendarAlt /> Patient Appointement date
          </Link>
        </li>
        <li className="p-2">
          <Link
            to="/AdminDashboard/Prescription"
            className="flex items-center gap-2 hover:bg-[#2c565c] p-2 rounded"
          >
            <FaCalendarAlt /> Prescription
          </Link>
        </li>
        <li className="p-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-[#2c565c] p-2 rounded w-full text-left"
          >
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
