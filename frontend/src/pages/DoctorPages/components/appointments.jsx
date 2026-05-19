import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAppointments,
  updateAppointmentStatus,
  addHealthcareRecord,
  fetchWeeklyAppointments,
} from "../../../store/appointmentsSlice";
import {
  AreaChart, // 🔥 غيرناها لـ AreaChart بدل LineChart
  Area, // 🔥 استخدمنا Area
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Clock,
  Users,
  Activity,
  Video,
  FilePlus,
  CheckCircle,
} from "lucide-react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// 🔥 مكون مخصص للـ Tooltip (عشان يطلع شكله فخم زجاجي)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-slate-100 p-4 rounded-2xl shadow-[0_10px_25px_rgba(4,51,58,0.1)]">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
          {label}
        </p>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#2dd4bf] shadow-[0_0_10px_rgba(45,212,191,0.6)] animate-pulse"></div>
          <p className="text-[#0f4c5c] font-black text-xl">
            {payload[0].value}{" "}
            <span className="text-sm font-medium text-slate-500">
              Appointments
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

const AppointmentDashboard = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { total, todayAppointments, loading, error, weeklyData } = useSelector(
    (state) => state.appointments,
  );

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: "",
    drugs: "",
    treatmentPlan: "",
  });

  const appointmentsPerPage = 3;

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchWeeklyAppointments());
  }, [dispatch]);

  const handleToggleStatus = async (e, appointmentId, currentStatus) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentStatus) return;

    try {
      await dispatch(
        updateAppointmentStatus({ appointmentId, isDone: true }),
      ).unwrap();

      dispatch(fetchAppointments());
      dispatch(fetchWeeklyAppointments());

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: "Appointment marked as completed.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      console.error(`Failed to update appointment: ${error.message}`);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update appointment status.",
      });
    }
  };

  const handleOpenForm = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseForm = () => {
    setSelectedAppointment(null);
    setFormData({ diagnosis: "", drugs: "", treatmentPlan: "" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dispatch(
        addHealthcareRecord({
          patientId: selectedAppointment?.patient_id || selectedAppointment?.id,
          staffId: user?.staff_id || user?.id,
          diagnosis: formData.diagnosis,
          drugs: formData.drugs,
          treatmentPlan: formData.treatmentPlan,
        }),
      ).unwrap();

      Swal.fire({
        icon: "success",
        title: "Record Saved!",
        text: "The medical record has been added securely.",
        confirmButtonColor: "#0f4c5c",
        customClass: { popup: "rounded-[2rem] shadow-2xl" },
      });

      handleCloseForm();
    } catch (error) {
      console.error(`Failed to add healthcare record:`, error);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: error.message || "Could not save the record.",
        confirmButtonColor: "#0f4c5c",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formattedWeeklyData = (weeklyData || []).map((item) => ({
    ...item,
    day: new Date(item.day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  const safeTodayAppointments = todayAppointments || [];
  const scheduledAppointments = safeTodayAppointments.filter(
    (app) => !app?.is_done,
  ).length;
  const completedAppointments = safeTodayAppointments.filter(
    (app) => app?.is_done,
  ).length;
  const totalTodayAppointments = scheduledAppointments + completedAppointments;

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = safeTodayAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2dd4bf]"></div>
      </div>
    );
  if (error)
    return (
      <div className="text-center p-4 bg-red-50 text-red-500 rounded-xl">
        {error}
      </div>
    );

  return (
    <div className="pb-[4rem]">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Calendar size={28} />}
          title="Total Appointments"
          value={total || 0}
          className="bg-white border border-slate-100 text-[#0f4c5c]"
          iconColor="text-[#2dd4bf] bg-teal-50"
        />
        <StatCard
          icon={<Clock size={28} />}
          title="Today's Appointments"
          value={totalTodayAppointments}
          className="bg-gradient-to-br from-[#0f4c5c] to-[#165a6c] text-white"
          iconColor="text-white bg-white/20"
        />
        <StatCard
          icon={<Users size={28} />}
          title="Scheduled Today"
          value={scheduledAppointments}
          className="bg-white border border-slate-100 text-[#0f4c5c]"
          iconColor="text-blue-500 bg-blue-50"
        />
        <StatCard
          icon={<Activity size={28} />}
          title="Completed Today"
          value={completedAppointments}
          className="bg-[#2dd4bf] text-[#0f4c5c]"
          iconColor="text-[#0f4c5c] bg-white/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 🔥 Updated Chart Section */}
        <div className="bg-white shadow-sm border border-slate-100 rounded-[2rem] p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-serif font-bold mb-6 text-[#0f4c5c]">
            Weekly Overview
          </h2>
          <div className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={formattedWeeklyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                {/* 🌟 Gradient Definition */}
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  allowDecimals={false} /* 🌟 منع الكسور */
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  dx={-10}
                />
                <Tooltip
                  content={<CustomTooltip />} /* 🌟 الكرت الزجاجي المخصص */
                  cursor={{
                    stroke: "#cbd5e1",
                    strokeWidth: 2,
                    strokeDasharray: "5 5",
                  }} /* 🌟 خط التتبع */
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2dd4bf"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorCount)" /* 🌟 تطبيق التدرج اللوني */
                  activeDot={{
                    r: 8,
                    fill: "#0f4c5c",
                    stroke: "#fff",
                    strokeWidth: 3,
                    shadow: "0px 0px 10px rgba(0,0,0,0.2)",
                  }}
                  dot={{
                    r: 4,
                    fill: "#fff",
                    stroke: "#2dd4bf",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments List Section */}
        <div className="bg-white shadow-sm border border-slate-100 rounded-[2rem] p-6 hover:shadow-md transition-shadow flex flex-col">
          <h2 className="text-xl font-serif font-bold mb-6 text-[#0f4c5c]">
            Today's Schedule
          </h2>
          <ul className="divide-y divide-slate-100 flex-1">
            {currentAppointments.map((appointment) => {
              if (!appointment) return null;

              return (
                <li
                  key={appointment.appointment_id || Math.random()}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-[#0f4c5c] font-bold text-lg mr-4">
                      {appointment?.patient_name
                        ? appointment.patient_name.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div>
                      <p className="font-bold text-[#0f4c5c]">
                        {appointment?.patient_name || "Unknown Patient"}
                      </p>
                      <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                        <Clock size={14} />{" "}
                        {appointment?.available_start_time || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) =>
                        handleToggleStatus(
                          e,
                          appointment?.appointment_id,
                          appointment?.is_done,
                        )
                      }
                      disabled={appointment?.is_done}
                      className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-all duration-300 ${
                        appointment?.is_done
                          ? "bg-green-100 text-green-700 cursor-default"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }`}
                    >
                      {appointment?.is_done ? (
                        <>
                          <CheckCircle size={16} /> Completed
                        </>
                      ) : (
                        "Pending"
                      )}
                    </button>

                    {!appointment?.is_done && (
                      <button
                        onClick={() =>
                          window.open(
                            `/video-call/${appointment?.appointment_id}`,
                            "_blank",
                          )
                        }
                        className="px-4 py-2 text-[#0f4c5c] bg-[#2dd4bf] hover:bg-teal-300 rounded-xl text-sm font-bold flex items-center gap-1 transition duration-300 shadow-sm hover:-translate-y-0.5"
                      >
                        <Video size={16} /> Call
                      </button>
                    )}
                    {appointment?.is_done && (
                      <button
                        onClick={() => handleOpenForm(appointment)}
                        className="px-4 py-2 text-white bg-[#0f4c5c] hover:bg-[#165a6c] rounded-xl text-sm font-bold flex items-center gap-1 transition duration-300 shadow-sm hover:-translate-y-0.5"
                      >
                        <FilePlus size={16} /> Record
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Pagination */}
          {safeTodayAppointments.length > appointmentsPerPage && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from(
                {
                  length: Math.ceil(
                    safeTodayAppointments.length / appointmentsPerPage,
                  ),
                },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-all duration-300 ${
                      currentPage === i + 1
                        ? "bg-[#0f4c5c] text-white shadow-md"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modern Add Record Form Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-in-out]">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-lg shadow-2xl scale-100 transition-transform border border-white/50">
            <h2 className="text-2xl font-serif font-bold mb-6 text-[#0f4c5c]">
              Add Healthcare Record
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Diagnosis
                </label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosis: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Viral Pharyngitis"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Prescribed Drugs
                </label>
                <input
                  type="text"
                  value={formData.drugs}
                  onChange={(e) =>
                    setFormData({ ...formData, drugs: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Paracetamol 500mg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Treatment Plan
                </label>
                <textarea
                  value={formData.treatmentPlan}
                  onChange={(e) =>
                    setFormData({ ...formData, treatmentPlan: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-32 resize-none focus:ring-2 focus:ring-[#2dd4bf] focus:border-transparent outline-none transition-all"
                  placeholder="Describe the plan for the patient..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={isSaving}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-[#0f4c5c] text-white font-bold rounded-xl hover:bg-[#165a6c] shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Record"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Updated StatCard Component
const StatCard = ({ icon, title, value, className, iconColor }) => (
  <div
    className={`rounded-[2rem] p-6 flex items-center justify-between transition-transform hover:-translate-y-1 ${className}`}
  >
    <div>
      <p className="text-sm font-bold opacity-80 mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
    <div className={`p-4 rounded-2xl ${iconColor}`}>{icon}</div>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
};

export default AppointmentDashboard;
