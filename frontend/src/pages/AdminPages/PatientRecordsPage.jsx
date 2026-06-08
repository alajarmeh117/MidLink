import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../AdminPages/sidebar";
import Swal from "sweetalert2";
import {
  Users,
  User,
  Mail,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
} from "lucide-react";

const PatientRecordsPage = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/Allpatients");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (id, isApproved) => {
    try {
      await axios.put("http://localhost:5000/api/Allpatients/approval", {
        id,
        isApproved,
      });
      setPatients(
        patients.map((patient) =>
          patient.id === id ? { ...patient, is_approved: isApproved } : patient,
        ),
      );

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "success",
        title: `Patient ${isApproved ? "approved" : "suspended"} successfully.`,
      });
    } catch (error) {
      console.error("Error updating approval status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update approval status.",
        confirmButtonColor: "#0f4c5c",
      });
    }
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
                <Users className="text-[#2dd4bf]" size={32} />
                Patient Records Management
              </h1>
              <p className="text-slate-500 mt-2">
                Manage all registered patients and their platform access status.
              </p>
            </div>

            <div className="bg-teal-50 px-5 py-3 rounded-xl border border-teal-100 flex items-center gap-3">
              <span className="text-3xl font-bold text-[#0f4c5c]">
                {patients.length}
              </span>
              <span className="text-sm font-medium text-slate-600 leading-tight">
                Total
                <br />
                Patients
              </span>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2dd4bf]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar pb-2">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                      <th className="py-4 px-6 font-bold uppercase tracking-wider whitespace-nowrap">
                        Patient Details
                      </th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider whitespace-nowrap">
                        Gender
                      </th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider whitespace-nowrap">
                        Date of Birth
                      </th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider whitespace-nowrap">
                        Access Status
                      </th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-right whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {patients.length > 0 ? (
                      patients.map((patient) => (
                        <tr
                          key={patient.id}
                          className="hover:bg-slate-50 transition-colors group"
                        >
                          {/* Patient Name & Email */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#0f4c5c] font-bold shrink-0">
                                {patient.username ? (
                                  patient.username.charAt(0).toUpperCase()
                                ) : (
                                  <User size={18} />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-[#0f4c5c] text-sm">
                                  {patient.username}
                                </p>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                  <Mail size={12} /> {patient.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Gender */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className="capitalize bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-sm font-medium">
                              {patient.gender || "N/A"}
                            </span>
                          </td>

                          {/* DOB */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                              <Calendar
                                size={14}
                                className="text-slate-400 shrink-0"
                              />
                              {patient.dob
                                ? new Date(patient.dob).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            {patient.is_approved ? (
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 w-fit">
                                <ShieldCheck size={14} /> Approved
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 w-fit">
                                <ShieldAlert size={14} /> Suspended
                              </span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <button
                              onClick={() =>
                                handleApproval(patient.id, !patient.is_approved)
                              }
                              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ml-auto transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                                patient.is_approved
                                  ? "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"
                                  : "bg-[#0f4c5c] text-white hover:bg-[#2dd4bf]"
                              }`}
                            >
                              {patient.is_approved ? (
                                <>
                                  <XCircle size={16} /> Suspend Access
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={16} /> Approve Access
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-16 text-center text-slate-500"
                        >
                          <Users
                            size={48}
                            className="mx-auto text-slate-300 mb-4"
                          />
                          <p className="text-lg font-medium text-[#0f4c5c]">
                            No patients registered yet
                          </p>
                          <p className="text-sm mt-1">
                            Patient records will appear here once they sign up.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #2dd4bf; }
      `}</style>
    </div>
  );
};

export default PatientRecordsPage;
