import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Download,
  Video,
  CalendarHeart,
  Droplet,
  Activity,
  AlertCircle,
  FileText,
  User,
  Clock,
  X,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UnreviewedAppointments from "../components/UnreviewedAppointments";

const PatientProfile = () => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 🔥 حالات الفلترة والتبويبات
  const [activeTab, setActiveTab] = useState("UPCOMING"); // UPCOMING, PAST, CANCELLED
  const [filterType, setFilterType] = useState("ALL"); // ALL, ONLINE, IN_CLINIC
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const response = await axios.get(
          "https://midlink-backend.onrender.com/api/patients/profile",
          { withCredentials: true },
        );
        setPatientData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch patient profile:", error);
        setError("Failed to fetch patient profile");
        setLoading(false);
      }
    };
    fetchPatientProfile();
  }, []);

  // تصفير الصفحة عند تغيير التبويب أو الفلتر
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filterType]);

  const handleCancelAppointment = async (appointment) => {
    const d = new Date(appointment.available_start_date);
    const correctDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const startDateTime = new Date(
      `${correctDateStr}T${appointment.available_start_time}`,
    );
    const diffInHours = (startDateTime - currentTime) / (1000 * 60 * 60);

    let alertConfig = {
      title: "Cancel Appointment?",
      text: "Are you sure you want to cancel this appointment? You will receive a full refund.",
      icon: "warning",
      confirmButtonColor: "#f43f5e",
      confirmButtonText: "Yes, cancel it!",
    };

    if (diffInHours < 24) {
      alertConfig = {
        title: "Late Cancellation Warning!",
        text: "You are cancelling with less than 24 hours notice. According to our policy, this cancellation is NON-REFUNDABLE. Do you want to proceed?",
        icon: "error",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Cancel (No Refund)",
      };
    }

    const result = await Swal.fire({
      ...alertConfig,
      showCancelButton: true,
      cancelButtonColor: "#64748b",
      background: "#fff",
      borderRadius: "20px",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(
          `https://midlink-backend.onrender.com/api/appointment/appointments/${appointment.appointment_id || appointment.id}/cancel`,
          {},
          { withCredentials: true },
        );
        await Swal.fire({
          icon: "success",
          title: "Cancelled",
          text: "Appointment has been cancelled successfully.",
          confirmButtonColor: "#0a7a8c",
        });
        window.location.reload();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message ||
            "Could not cancel the appointment.",
          confirmButtonColor: "#0f4c5c",
        });
      }
    }
  };

  const getAppointmentState = (appointment) => {
    if (
      !appointment.available_start_date ||
      !appointment.available_start_time
    ) {
      return {
        label: appointment.status,
        type: "default",
        showJoin: false,
        showClinic: false,
        showPDF: appointment.status === "COMPLETED",
      };
    }

    const d = new Date(appointment.available_start_date);
    const correctDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const startDateTime = new Date(
      `${correctDateStr}T${appointment.available_start_time}`,
    );

    let endDateTime = appointment.available_end_time
      ? new Date(`${correctDateStr}T${appointment.available_end_time}`)
      : new Date(startDateTime.getTime() + 30 * 60000);

    const diffInMinutes = (startDateTime - currentTime) / (1000 * 60);
    const isClinic = appointment.appointment_type === "IN_CLINIC";

    if (appointment.is_done || appointment.status === "COMPLETED") {
      return {
        label: "Completed",
        type: "success",
        showJoin: false,
        showClinic: false,
        showPDF: true,
      };
    }
    if (appointment.status === "CANCELLED") {
      return {
        label: "Cancelled",
        type: "danger",
        showJoin: false,
        showClinic: false,
        showPDF: false,
      };
    }
    if (currentTime > endDateTime) {
      return {
        label: "Expired",
        type: "danger",
        showJoin: false,
        showClinic: false,
        showPDF: false,
      };
    }
    if (diffInMinutes <= 15 && currentTime <= endDateTime) {
      return {
        label: "In Progress",
        type: "active",
        showJoin: !isClinic,
        showClinic: isClinic,
        showPDF: false,
      };
    }
    if (diffInMinutes > 15 && appointment.status !== "CANCELLED") {
      return {
        label: "Upcoming",
        type: "upcoming",
        showJoin: false,
        showClinic: false,
        showPDF: false,
        showCancel: true,
      };
    }

    return {
      label: appointment.status,
      type: "default",
      showJoin: false,
      showClinic: false,
      showPDF: false,
    };
  };

  // 🔥 التعديل الآمن لطباعة الـ PDF بحيث يعتمد على الكائن وليس موقعه بالمصفوفة الحالية
  const downloadAppointmentDetails = (appointment, originalIndex) => {
    const pdf = new jsPDF("p", "mm", "a4");
    const primaryColor = "#04333a";
    const formattedDate = appointment.available_start_date
      ? new Date(appointment.available_start_date).toLocaleDateString()
      : "N/A";
    const formattedTime = appointment.available_start_time
      ? appointment.available_start_time.slice(0, 5)
      : "N/A";

    pdf.setFillColor(primaryColor);
    pdf.rect(0, 0, 210, 40, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text("MidLink Healthcare", 105, 20, { align: "center" });
    pdf.setFontSize(14);
    pdf.text(`Medical Record: ${patientData.username}`, 105, 32, {
      align: "center",
    });

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setTextColor(primaryColor);
    pdf.text("Patient Information", 20, 60);
    pdf.setFontSize(12);
    pdf.setTextColor(50, 50, 50);
    pdf.text(`Name: ${patientData.username}`, 25, 70);
    pdf.text(`Email: ${patientData.email}`, 25, 80);
    pdf.text(
      `Gender/Age: ${patientData.gender} | ${patientData.age} Years`,
      25,
      90,
    );

    pdf.setFontSize(16);
    pdf.setTextColor(primaryColor);
    pdf.text("Appointment Details", 20, 115);
    pdf.setFontSize(12);
    pdf.setTextColor(50, 50, 50);
    pdf.text(`Attending Doctor: Dr. ${appointment.doctor_name}`, 25, 125);
    pdf.text(`Date & Time: ${formattedDate} at ${formattedTime}`, 25, 135);
    pdf.text(`Type: ${appointment.appointment_type || "ONLINE"}`, 25, 145);
    pdf.text(`Status: ${appointment.status}`, 25, 155);

    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Generated securely by MidLink System © ${new Date().getFullYear()}`,
      105,
      285,
      { align: "center" },
    );

    pdf.save(`MidLink_Record_${originalIndex + 1}.pdf`);
  };

  // 🔥 معالجة وتصنيف المواعيد (Tabs & Filters)
  const processedAppointments = useMemo(() => {
    if (!patientData?.appointments)
      return { upcoming: [], past: [], cancelled: [] };

    const upcoming = [];
    const past = [];
    const cancelled = [];

    patientData.appointments.forEach((app, index) => {
      const state = getAppointmentState(app);
      const appWithMeta = { ...app, originalIndex: index, state };

      if (state.label === "Cancelled") {
        cancelled.push(appWithMeta);
      } else if (state.label === "Completed" || state.label === "Expired") {
        past.push(appWithMeta);
      } else {
        upcoming.push(appWithMeta);
      }
    });

    return { upcoming, past, cancelled };
  }, [patientData, currentTime]);

  // الحصول على المواعيد المعروضة حالياً وتطبيق الفلتر
  const getCurrentList = () => {
    let list = [];
    if (activeTab === "UPCOMING") list = processedAppointments.upcoming;
    else if (activeTab === "PAST") list = processedAppointments.past;
    else if (activeTab === "CANCELLED") list = processedAppointments.cancelled;

    if (filterType !== "ALL") {
      list = list.filter(
        (app) => (app.appointment_type || "ONLINE") === filterType,
      );
    }
    return list;
  };

  const displayList = getCurrentList();
  const totalPages = Math.ceil(displayList.length / itemsPerPage);
  const paginatedList = displayList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-[#0a7a8c] animate-pulse">
        Loading Health Passport...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );
  if (!patientData) return null;

  const stats = [
    {
      label: "Sex & Age",
      value: `${patientData.gender}, ${patientData.age}`,
      icon: <User className="text-[#0a7a8c]" />,
    },
    {
      label: "Blood Type",
      value: patientData.blood,
      icon: <Droplet className="text-red-500" />,
    },
    {
      label: "Health Status",
      value: patientData.status,
      icon: <Activity className="text-green-500" />,
    },
    {
      label: "Visits",
      value: patientData.appointment_count,
      icon: <CalendarHeart className="text-[#58e6fc]" />,
    },
    {
      label: "Allergies",
      value: patientData.haveallergy,
      icon: <AlertCircle className="text-yellow-500" />,
    },
    {
      label: "Chronic Diseases",
      value: patientData.chronic_diseases,
      icon: <FileText className="text-purple-500" />,
    },
  ];

  return (
    <div className="bg-[#f8fafc] font-sans min-h-screen">
      <Navbar />
      <div className="h-64 bg-gradient-to-r from-[#04333a] via-[#0a7a8c] to-[#04333a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-32 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100 flex flex-col items-center text-center relative h-fit"
          >
            <div className="relative w-40 h-40 mb-6">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#58e6fc] to-[#0a7a8c] rounded-full animate-pulse blur-md"></div>
              <img
                src={
                  patientData.profile_image
                    ? `https://midlink-backend.onrender.com/${patientData.profile_image}`
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-white relative z-10 shadow-inner"
              />
            </div>
            <h2 className="text-3xl font-extrabold text-[#04333a] mb-2">
              {patientData.username}
            </h2>
            <span className="bg-[#e6f0f5] text-[#0a7a8c] px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              {patientData.email}
            </span>

            <div className="w-full grid grid-cols-2 gap-4 mt-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="mb-2 bg-white p-2 rounded-full shadow-sm">
                    {stat.icon}
                  </div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <p className="text-[#04333a] font-extrabold">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="lg:col-span-2 space-y-6">
            {/* 🔥 رفعنا التقييمات لفوق */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <UnreviewedAppointments />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-2xl font-extrabold text-[#04333a] flex items-center gap-2">
                  <CalendarHeart className="text-[#58e6fc] w-8 h-8" />{" "}
                  Appointments
                </h3>

                {/* الفلاتر */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {["ALL", "ONLINE", "IN_CLINIC"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterType === type ? "bg-white text-[#0a7a8c] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      {type === "IN_CLINIC"
                        ? "Clinic"
                        : type === "ALL"
                          ? "All"
                          : "Video"}
                    </button>
                  ))}
                </div>
              </div>

              {/* التبويبات */}
              <div className="flex border-b border-gray-200 mb-4">
                {[
                  {
                    id: "UPCOMING",
                    label: `Upcoming (${processedAppointments.upcoming.length})`,
                  },
                  {
                    id: "PAST",
                    label: `Completed (${processedAppointments.past.length})`,
                  },
                  {
                    id: "CANCELLED",
                    label: `Cancelled (${processedAppointments.cancelled.length})`,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 px-4 font-bold text-sm transition-colors border-b-2 ${activeTab === tab.id ? "border-[#0a7a8c] text-[#0a7a8c]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="p-4 text-sm font-bold text-gray-400 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="p-4 text-sm font-bold text-gray-400 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="p-4 text-sm font-bold text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedList.map((appointment) => {
                      const state = appointment.state; // أخذنا الحالة المحسوبة مسبقاً
                      return (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          key={appointment.originalIndex}
                          className="border-b border-gray-50 hover:bg-[#f8fafc] transition-colors group"
                        >
                          <td className="p-4 font-bold text-[#04333a]">
                            <div className="flex flex-col gap-1 items-start">
                              <span>Dr. {appointment.doctor_name}</span>
                              {appointment.appointment_type === "IN_CLINIC" ? (
                                <span className="bg-amber-100 text-amber-700 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                                  <MapPin size={10} /> Clinic
                                </span>
                              ) : (
                                <span className="bg-teal-100 text-teal-700 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                                  <Video size={10} /> Online
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-4 text-sm font-medium text-gray-500">
                            <div className="flex flex-col">
                              <span className="text-[#04333a] font-bold">
                                {appointment.available_start_date
                                  ? new Date(
                                      appointment.available_start_date,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </span>
                              <span className="flex items-center gap-1 text-xs mt-1">
                                <Clock size={12} />{" "}
                                {appointment.available_start_time
                                  ? appointment.available_start_time.slice(0, 5)
                                  : "--:--"}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-between gap-3">
                              <span
                                className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap ${state.type === "success" ? "bg-green-100 text-green-700" : state.type === "danger" ? "bg-red-100 text-red-700" : state.type === "active" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                              >
                                {state.label}
                              </span>

                              <div className="flex gap-2">
                                {state.showJoin && (
                                  <button
                                    onClick={() =>
                                      window.open(
                                        `/video-call/${appointment.appointment_id || appointment.id}`,
                                        "_blank",
                                      )
                                    }
                                    className="flex items-center gap-1 bg-[#2dd4bf] hover:bg-teal-400 text-[#04333a] px-3 py-1.5 rounded-xl text-sm font-black shadow-sm transition-all hover:-translate-y-0.5"
                                  >
                                    <Video size={14} /> Join
                                  </button>
                                )}
                                {state.showClinic && (
                                  <span className="flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-2 py-1.5 rounded-xl border border-amber-100 whitespace-nowrap">
                                    <MapPin size={12} /> Visit Clinic
                                  </span>
                                )}
                                {state.showCancel && (
                                  <button
                                    onClick={() =>
                                      handleCancelAppointment(appointment)
                                    }
                                    className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                                  >
                                    <X size={14} /> Cancel
                                  </button>
                                )}
                                {state.showPDF && (
                                  <button
                                    onClick={() =>
                                      downloadAppointmentDetails(
                                        appointment,
                                        appointment.originalIndex,
                                      )
                                    }
                                    className="flex items-center gap-1 bg-[#e6f0f5] hover:bg-[#c4f7ff] text-[#0a7a8c] px-3 py-1.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                                  >
                                    <Download size={14} /> PDF
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>

                {paginatedList.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Filter size={48} className="mb-4 opacity-20" />
                    <p className="font-medium">
                      No appointments found in this category.
                    </p>
                  </div>
                )}
              </div>

              {/* 🔥 Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                  <p className="text-sm text-gray-500 font-medium">
                    Showing{" "}
                    <span className="text-[#04333a] font-bold">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="text-[#04333a] font-bold">
                      {Math.min(currentPage * itemsPerPage, displayList.length)}
                    </span>{" "}
                    of{" "}
                    <span className="text-[#04333a] font-bold">
                      {displayList.length}
                    </span>{" "}
                    entries
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="p-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-bold text-[#04333a] px-2 border-x border-gray-200">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="p-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PatientProfile;
