import React from "react";
import { useSelector } from "react-redux";
import DoctorAppointments from "./components/appointments";

const DoctorHome = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="container mx-auto px-4 py-8 animate-[fadeIn_0.5s_ease-in-out]">
      {/* Welcome Banner */}
      <div className="mb-8 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between transition-all hover:shadow-md">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0f4c5c]">
            Welcome back,{" "}
            <span className="text-[#2dd4bf]">
              Dr. {user?.staff_name || "Doctor"}
            </span>
          </h2>
          <p className="text-slate-500 mt-2 text-sm md:text-base">
            Here is your daily overview. Manage your appointments and patients
            efficiently.
          </p>
        </div>
      </div>

      {/* Main Appointments Dashboard */}
      <DoctorAppointments />
    </div>
  );
};

export default DoctorHome;
