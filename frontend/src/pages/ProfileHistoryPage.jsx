import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // 🔥 تأكد من وجود هذا السطر فوق مع الاستدعاءات
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

  // 🔥 محرك الوقت: يتحدث كل دقيقة لتغيير حالة الأزرار تلقائياً
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // تحديث كل دقيقة
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/patients/profile",
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

  const handleCancelAppointment = async (appointment) => {
    // 1. حساب الوقت المتبقي للموعد بدقة
    const d = new Date(appointment.available_start_date);
    const correctDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const startDateTime = new Date(
      `${correctDateStr}T${appointment.available_start_time}`,
    );
    const diffInHours = (startDateTime - currentTime) / (1000 * 60 * 60);

    // الإعداد الافتراضي للإلغاء (أكثر من 24 ساعة) -> المنطقة الخضراء
    let alertConfig = {
      title: "Cancel Appointment?",
      text: "Are you sure you want to cancel this appointment? You will receive a full refund.",
      icon: "warning",
      confirmButtonColor: "#f43f5e",
      confirmButtonText: "Yes, cancel it!",
    };

    // 🚨 قانون الـ 24 ساعة (أقل من 24 ساعة) -> المنطقة الحمراء
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
        // إرسال طلب الإلغاء للباك-إند
        await axios.put(
          `http://localhost:5000/api/appointment/appointments/${appointment.appointment_id || appointment.id}/cancel`,
          {},
          { withCredentials: true },
        );

        await Swal.fire({
          icon: "success",
          title: "Cancelled",
          text: "Appointment has been cancelled successfully.",
          confirmButtonColor: "#0a7a8c",
        });

        // تحديث الصفحة تلقائياً ليعكس التغيير فوراً
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

  // 🔥 دالة الذكاء الزمني لتحديد حالة الموعد وشكل الزر
  const getAppointmentState = (appointment) => {
    if (
      !appointment.available_start_date ||
      !appointment.available_start_time
    ) {
      return {
        label: appointment.status,
        type: "default",
        showJoin: false,
        showPDF: appointment.status === "COMPLETED",
      };
    }

    // 🌟 الحل الجذري لمشكلة التوقيت (Timezone)
    const d = new Date(appointment.available_start_date);
    const correctDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const startDateTime = new Date(
      `${correctDateStr}T${appointment.available_start_time}`,
    );

    // حساب وقت النهاية (إذا الدكتور ما حدد وقت نهاية، بنعتبر الجلسة 30 دقيقة)
    let endDateTime;
    if (appointment.available_end_time) {
      endDateTime = new Date(
        `${correctDateStr}T${appointment.available_end_time}`,
      );
    } else {
      endDateTime = new Date(startDateTime.getTime() + 30 * 60000);
    }

    const diffInMinutes = (startDateTime - currentTime) / (1000 * 60);

    // 1. الموعد منتهي أو الدكتور خلصه
    if (appointment.is_done || appointment.status === "COMPLETED") {
      return {
        label: "Completed",
        type: "success",
        showJoin: false,
        showPDF: true,
      };
    }
    if (appointment.status === "CANCELLED") {
      return {
        label: "Cancelled",
        type: "danger",
        showJoin: false,
        showPDF: false,
      };
    }

    // 2. الوقت خلص والمريض ما حضر (راح عليه)
    if (currentTime > endDateTime) {
      return {
        label: "Expired",
        type: "danger",
        showJoin: false,
        showPDF: false,
      };
    }

    // 3. الموعد هسا! (متبقي 15 دقيقة أو إحنا ضمن وقت الجلسة)
    if (diffInMinutes <= 15 && currentTime <= endDateTime) {
      return {
        label: "In Progress",
        type: "active",
        showJoin: true,
        showPDF: false,
      };
    }

    // 4. الموعد لسه مطول (أكثر من 15 دقيقة)
    if (diffInMinutes > 15 && appointment.status !== "CANCELLED") {
      return {
        label: "Upcoming",
        type: "upcoming",
        showJoin: false,
        showPDF: false,
        showCancel: true, // 🔥 ضفنا خيار الإلغاء
      };
    }

    return {
      label: appointment.status,
      type: "default",
      showJoin: false,
      showPDF: false,
    };
  };

  const downloadAppointmentDetails = (index) => {
    const appointment = patientData.appointments[index];
    const pdf = new jsPDF("p", "mm", "a4");
    const primaryColor = "#04333a";

    // 🛠️ حل مشكلة التواريخ بالـ PDF بعد التعديل الأخير
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
    pdf.text(`Status: ${appointment.status}`, 25, 145);

    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Generated securely by MidLink System © ${new Date().getFullYear()}`,
      105,
      285,
      { align: "center" },
    );
    pdf.save(`MidLink_Record_${index + 1}.pdf`);
  };

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
          {/* Profile Card */}
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
                    ? `http://localhost:5000/${patientData.profile_image}`
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

          {/* History & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100"
            >
              <h3 className="text-2xl font-extrabold text-[#04333a] mb-6 flex items-center gap-2">
                <CalendarHeart className="text-[#58e6fc] w-8 h-8" /> Medical
                History
              </h3>

              <div className="overflow-x-auto">
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
                        Status & Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientData.appointments?.map((appointment, index) => {
                      // 🔥 استدعاء دالة الذكاء الزمني لكل موعد
                      const state = getAppointmentState(appointment);

                      return (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          key={index}
                          className="border-b border-gray-50 hover:bg-[#f8fafc] transition-colors group"
                        >
                          <td className="p-4 font-bold text-[#04333a]">
                            Dr. {appointment.doctor_name}
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
                              {/* شارة الحالة الديناميكية */}
                              <span
                                className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block shadow-sm ${
                                  state.type === "success"
                                    ? "bg-green-100 text-green-700"
                                    : state.type === "danger"
                                      ? "bg-red-100 text-red-700"
                                      : state.type === "active"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {state.label}
                              </span>

                              {/* الأزرار الديناميكية */}
                              <div className="flex gap-2">
                                {state.showJoin && (
                                  <button
                                    onClick={() =>
                                      window.open(
                                        `/video-call/${appointment.appointment_id || appointment.id}`,
                                        "_blank",
                                      )
                                    }
                                    className="relative flex items-center gap-2 bg-[#2dd4bf] hover:bg-teal-400 text-[#04333a] px-4 py-2 rounded-xl text-sm font-black shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all hover:-translate-y-0.5 animate-pulse"
                                  >
                                    <Video size={16} /> Join Call Now
                                  </button>
                                )}

                                {/* 🔥 هاد هو زر الإلغاء الجديد اللي بتضيفه هون بالظبط */}
                                {state.showCancel && (
                                  <button
                                    onClick={() =>
                                      handleCancelAppointment(appointment)
                                    }
                                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 shadow-sm border border-red-100"
                                  >
                                    <X size={16} /> Cancel
                                  </button>
                                )}

                                {/* زر الـ PDF الحالي عندك */}
                                {state.showPDF && (
                                  <button
                                    onClick={() =>
                                      downloadAppointmentDetails(index)
                                    }
                                    className="flex items-center gap-2 bg-[#e6f0f5] hover:bg-[#c4f7ff] text-[#0a7a8c] px-4 py-2 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                                  >
                                    <Download size={16} /> PDF
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
                {(!patientData.appointments ||
                  patientData.appointments.length === 0) && (
                  <p className="text-center text-gray-400 py-8 font-medium">
                    No medical history found.
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <UnreviewedAppointments />
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PatientProfile;
