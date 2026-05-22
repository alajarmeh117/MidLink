import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar";
import Swal from "sweetalert2";
import {
  CalendarCheck,
  Calendar,
  Clock,
  User,
  Stethoscope,
  XCircle,
  AlertCircle,
  CheckCircle,
  Ban,
} from "lucide-react";

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false); // 🔥 State للتحميل

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "https://midlink-of4r.onrender.com/api/AdminPatientAppointments",
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleCancel = (appointment) => {
    if (appointment.status === "Completed") {
      Swal.fire({
        icon: "error",
        title: "Action Denied",
        text: "Completed appointments cannot be cancelled.",
        confirmButtonColor: "#0f4c5c",
      });
      return;
    }
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!cancelReason.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Reason Required",
        text: "Please provide a reason for cancellation.",
        confirmButtonColor: "#0f4c5c",
      });
      return;
    }

    setIsCancelling(true); // 🚀 تشغيل التحميل

    try {
      const response = await axios.post(
        "https://midlink-of4r.onrender.com/api/AdminPatientAppointments/cancel",
        {
          appointmentId: selectedAppointment.appointment_id,
          reason: cancelReason,
        },
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Cancelled Successfully",
          text: response.data.message,
          confirmButtonColor: "#0f4c5c",
        });
        setIsModalOpen(false);
        setCancelReason("");
        fetchAppointments();
      } else {
        Swal.fire({
          icon: "error",
          title: "Cancellation Failed",
          text: response.data.message,
          confirmButtonColor: "#0f4c5c",
        });
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      Swal.fire({
        icon: "error",
        title: "Cancellation Failed",
        text: "An error occurred while cancelling the appointment.",
        confirmButtonColor: "#0f4c5c",
      });
    } finally {
      setIsCancelling(false); // 🛑 إيقاف التحميل
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center gap-1 w-fit shadow-sm">
            <CheckCircle size={14} /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold flex items-center gap-1 w-fit shadow-sm">
            <Ban size={14} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold flex items-center gap-1 w-fit shadow-sm">
            <Clock size={14} /> {status || "Scheduled"}
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 min-w-0 p-6 md:p-10 overflow-y-auto animate-[fadeIn_0.4s_ease-in-out]">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#0f4c5c] flex items-center gap-3">
                <CalendarCheck className="text-[#2dd4bf]" size={32} />
                Platform Appointments
              </h2>
              <p className="text-slate-500 mt-2">
                Monitor all doctor-patient appointments and manage
                cancellations.
              </p>
            </div>

            <div className="bg-teal-50/80 px-4 py-2 rounded-xl border border-teal-100 flex items-center gap-2 shadow-inner">
              <span className="text-2xl font-bold text-[#0f4c5c]">
                {appointments.length}
              </span>
              <span className="text-sm font-medium text-slate-600 leading-tight">
                Total
                <br />
                Records
              </span>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-lg border border-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
                    <th className="py-4 px-6 font-bold uppercase tracking-wider">
                      Patient Details
                    </th>
                    <th className="py-4 px-6 font-bold uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="py-4 px-6 font-bold uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="py-4 px-6 font-bold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-4 px-6 font-bold uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => {
                      const isDisabled =
                        appointment.status === "Cancelled" ||
                        appointment.status === "Completed";

                      return (
                        <tr
                          key={appointment.appointment_id}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#0f4c5c] font-bold">
                                <User size={18} />
                              </div>
                              <span className="font-bold text-[#0f4c5c]">
                                {appointment.patient_name}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                              <Stethoscope
                                size={16}
                                className="text-[#2dd4bf]"
                              />
                              {appointment.doctor_name}
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                <Calendar
                                  size={14}
                                  className="text-slate-400"
                                />
                                {appointment.available_start_date
                                  ? new Date(
                                      appointment.available_start_date,
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </span>
                              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                <Clock size={14} className="text-slate-400" />
                                {appointment.available_start_time
                                  ? appointment.available_start_time.slice(0, 5)
                                  : "N/A"}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            {getStatusBadge(appointment.status)}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleCancel(appointment)}
                              disabled={isDisabled}
                              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ml-auto transition-all duration-300 ${
                                isDisabled
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                  : "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white shadow-sm hover:shadow-md hover:-translate-y-0.5"
                              }`}
                            >
                              <XCircle size={16} />
                              {isDisabled ? "Locked" : "Cancel"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-12 text-center text-slate-500"
                      >
                        <CalendarCheck
                          size={48}
                          className="mx-auto text-slate-300 mb-3"
                        />
                        <p className="text-lg font-medium">
                          No appointments found
                        </p>
                        <p className="text-sm">
                          Records will appear here once patients start booking.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cancellation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-50 animate-[fadeIn_0.2s_ease-in-out] p-4">
            <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl w-full max-w-md scale-100 transition-transform relative overflow-hidden border border-white/50">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-400 to-red-600"></div>

              <div className="flex items-center gap-3 mb-6 mt-2">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#0f4c5c]">
                    Cancel Appointment
                  </h2>
                  <p className="text-sm text-slate-500">
                    For {selectedAppointment?.patient_name}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Reason for cancellation{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border border-slate-200 bg-white/50 p-4 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition-all h-32 resize-none text-slate-700 shadow-inner"
                  placeholder="e.g. Doctor is unavailable, emergency, etc..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  disabled={isCancelling}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCancelReason("");
                  }}
                  disabled={isCancelling}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={isCancelling} // 🔥 تجميد الزر أثناء الإلغاء
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCancelling ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle size={18} /> Confirm Cancel
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentTable;
