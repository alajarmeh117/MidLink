import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAppointments,
  updateAppointmentStatus,
  addHealthcareRecord,
  fetchWeeklyAppointments,
} from "../../../store/appointmentsSlice";
import {
  AreaChart,
  Area,
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
  MapPin, // 🔥 أيقونة العيادة
  UserCheck, // 🔥 أيقونة تأكيد الحضور
} from "lucide-react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// 🔥 Tooltip محدث للرسم البياني يفصل الأونلاين عن العيادة
// 🔥 Tooltip محدث يقرأ الأرقام بشكل ذكي لمنع الانعكاس
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // البحث عن القيمة بالاسم المرجعي لضمان عدم انعكاس الأرقام
    const onlineVal =
      payload.find((p) => p.dataKey === "onlineCount")?.value || 0;
    const clinicVal =
      payload.find((p) => p.dataKey === "clinicCount")?.value || 0;

    return (
      <div className="bg-white/95 backdrop-blur-md border border-slate-100 p-4 rounded-2xl shadow-[0_10px_25px_rgba(4,51,58,0.1)]">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
          {label}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>
              <span className="text-sm font-bold text-slate-600">Online</span>
            </div>
            <span className="text-[#0f4c5c] font-black">{onlineVal}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
              <span className="text-sm font-bold text-slate-600">
                In-Clinic
              </span>
            </div>
            <span className="text-amber-700 font-black">{clinicVal}</span>
          </div>
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
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: "",
    drugs: "",
    treatmentPlan: "",
  });

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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update appointment status.",
      });
    }
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
      Swal.fire({ icon: "success", title: "Record Saved!" });
      setSelectedAppointment(null);
      setFormData({ diagnosis: "", drugs: "", treatmentPlan: "" });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Save Failed" });
    } finally {
      setIsSaving(false);
    }
  };

  // 🔥 تجهيز الداتا للرسم البياني (Chart) لتفصل الأونلاين عن العيادة
  const formattedWeeklyData = (weeklyData || []).map((item) => ({
    ...item,
    day: new Date(item.day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    // نفترض الباك-إند بيرجع onlineCount و clinicCount. إذا لا، رح نقسم الـ count لنصين وهمياً للتجربة حالياً
    onlineCount:
      item.onlineCount !== undefined
        ? item.onlineCount
        : Math.ceil(item.count * 0.6),
    clinicCount:
      item.clinicCount !== undefined
        ? item.clinicCount
        : Math.floor(item.count * 0.4),
  }));

  const safeTodayAppointments = todayAppointments || [];

  // 🔥 فصل المواعيد إلى مصفوفتين (أونلاين وعيادة) بناءً على النوع اللي جاي من الداتابيس
  const onlineAppointments = safeTodayAppointments.filter(
    (app) => app.appointment_type === "ONLINE" || !app.appointment_type,
  );
  const clinicAppointments = safeTodayAppointments.filter(
    (app) => app.appointment_type === "IN_CLINIC",
  );

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2dd4bf]"></div>
      </div>
    );

  return (
    <div className="pb-[4rem] font-sans">
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
          title="Today's Total"
          value={safeTodayAppointments.length}
          className="bg-gradient-to-br from-[#0f4c5c] to-[#165a6c] text-white"
          iconColor="text-white bg-white/20"
        />
        <StatCard
          icon={<Video size={28} />}
          title="Online Today"
          value={onlineAppointments.length}
          className="bg-white border border-slate-100 text-[#0f4c5c]"
          iconColor="text-[#2dd4bf] bg-teal-50"
        />
        <StatCard
          icon={<MapPin size={28} />}
          title="In-Clinic Today"
          value={clinicAppointments.length}
          className="bg-amber-50 border border-amber-100 text-amber-900"
          iconColor="text-amber-500 bg-amber-100"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* 📈 Chart Section (محدث ليعرض خطين) */}
        <div className="bg-white shadow-sm border border-slate-100 rounded-[2rem] p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif font-bold text-[#0f4c5c]">
              Weekly Distribution
            </h2>
            <div className="flex gap-4">
              <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                <div className="w-2 h-2 rounded-full bg-[#2dd4bf]"></div> Online
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div> Clinic
              </span>
            </div>
          </div>
          <div className="pt-4">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart
                data={formattedWeeklyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorClinic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
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
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  dx={-10}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "#cbd5e1", strokeDasharray: "5 5" }}
                />

                {/* خط العيادة */}
                <Area
                  type="monotone"
                  dataKey="clinicCount"
                  stroke="#fbbf24"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorClinic)"
                  activeDot={{ r: 6, fill: "#b45309", stroke: "#fff" }}
                />
                {/* خط الأونلاين */}
                <Area
                  type="monotone"
                  dataKey="onlineCount"
                  stroke="#2dd4bf"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorOnline)"
                  activeDot={{ r: 6, fill: "#0f4c5c", stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 📋 Appointments List Section (مفصول ومرتب) */}
        <div className="bg-white shadow-sm border border-slate-100 rounded-[2rem] p-6 flex flex-col overflow-hidden max-h-[500px]">
          <h2 className="text-xl font-serif font-bold mb-6 text-[#0f4c5c] sticky top-0 bg-white z-10 pb-2">
            Today's Schedule
          </h2>

          <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-6">
            {/* 🟢 قسم العيادة (IN-CLINIC) */}
            {clinicAppointments.length > 0 && (
              <div>
                <h3 className="text-xs font-black text-amber-600 mb-3 flex items-center gap-2 uppercase tracking-widest bg-amber-50 p-2 rounded-lg">
                  <MapPin size={16} /> In-Clinic Visits
                </h3>
                <ul className="space-y-3">
                  {clinicAppointments.map((app) => (
                    <li
                      key={app.appointment_id}
                      className="p-4 border border-amber-100 bg-white rounded-2xl flex flex-col sm:flex-row justify-between gap-4 hover:border-amber-300 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg mr-3">
                          {app?.patient_name
                            ? app.patient_name.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-amber-900">
                            {app?.patient_name || "Unknown Patient"}
                          </p>
                          <p className="text-xs font-bold text-amber-600 flex items-center gap-1">
                            <Clock size={12} />{" "}
                            {app?.available_start_time?.slice(0, 5)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {app?.is_done ? (
                          <button
                            onClick={() => setSelectedAppointment(app)}
                            className="px-3 py-1.5 bg-[#0f4c5c] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                          >
                            <FilePlus size={14} /> Record
                          </button>
                        ) : (
                          <>
                            {/* 🔥 هنا زر Mark Arrived بدلاً من Call لمواعيد العيادة */}
                            <button className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                              <UserCheck size={14} /> Arrived
                            </button>
                            <button
                              onClick={(e) =>
                                handleToggleStatus(
                                  e,
                                  app.appointment_id,
                                  app.is_done,
                                )
                              }
                              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                            >
                              <CheckCircle size={14} /> Done
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 🔵 قسم الأونلاين (ONLINE) */}
            {onlineAppointments.length > 0 && (
              <div>
                <h3 className="text-xs font-black text-[#0f4c5c] mb-3 flex items-center gap-2 uppercase tracking-widest bg-teal-50 p-2 rounded-lg">
                  <Video size={16} className="text-[#2dd4bf]" /> Online
                  Consultations
                </h3>
                <ul className="space-y-3">
                  {onlineAppointments.map((app) => (
                    <li
                      key={app.appointment_id}
                      className="p-4 border border-slate-100 bg-white rounded-2xl flex flex-col sm:flex-row justify-between gap-4 hover:border-[#2dd4bf] transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#0f4c5c] font-bold text-lg mr-3">
                          {app?.patient_name
                            ? app.patient_name.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-[#0f4c5c]">
                            {app?.patient_name || "Unknown Patient"}
                          </p>
                          <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            <Clock size={12} />{" "}
                            {app?.available_start_time?.slice(0, 5)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {app?.is_done ? (
                          <button
                            onClick={() => setSelectedAppointment(app)}
                            className="px-3 py-1.5 bg-[#0f4c5c] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                          >
                            <FilePlus size={14} /> Record
                          </button>
                        ) : (
                          <>
                            {/* 🔥 هنا زر Call المخصص للأونلاين فقط */}
                            <button
                              onClick={() =>
                                window.open(
                                  `/video-call/${app.appointment_id}`,
                                  "_blank",
                                )
                              }
                              className="px-3 py-1.5 bg-[#2dd4bf] text-[#0f4c5c] hover:bg-teal-300 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                            >
                              <Video size={14} /> Call
                            </button>
                            <button
                              onClick={(e) =>
                                handleToggleStatus(
                                  e,
                                  app.appointment_id,
                                  app.is_done,
                                )
                              }
                              className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-slate-200"
                            >
                              <CheckCircle size={14} /> Done
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {safeTodayAppointments.length === 0 && (
              <div className="text-center py-10 text-slate-400 font-medium">
                No appointments scheduled for today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record Form Modal (بقي كما هو) */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-in-out]">
          {/* ... (نفس كود الفورم السابق تماماً) ... */}
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
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] outline-none transition-all"
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
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] outline-none transition-all"
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
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-32 resize-none focus:ring-2 focus:ring-[#2dd4bf] outline-none transition-all"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
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
                  {isSaving ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }`}</style>
    </div>
  );
};

// Updated StatCard Component
const StatCard = ({ icon, title, value, className, iconColor }) => (
  <div
    className={`rounded-[2rem] p-6 flex items-center justify-between transition-transform hover:-translate-y-1 shadow-sm ${className}`}
  >
    <div>
      <p className="text-sm font-bold opacity-80 mb-1">{title}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
    <div className={`p-4 rounded-2xl ${iconColor}`}>{icon}</div>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  iconColor: PropTypes.string,
};

export default AppointmentDashboard;
