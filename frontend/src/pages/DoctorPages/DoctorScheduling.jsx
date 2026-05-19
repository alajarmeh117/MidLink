import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  setAvailability,
  getAvailabilities,
  deleteAvailability,
} from "../../store/doctorSchedulingSlice";
import {
  Calendar,
  Clock,
  Trash2,
  Save,
  PlusCircle,
  X,
  Info,
  CalendarCheck,
  History,
} from "lucide-react";

const DoctorScheduling = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { availabilities, loading } = useSelector(
    (state) => state.doctorScheduling,
  );

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        await dispatch(getAvailabilities()).unwrap();
      } catch (err) {
        console.error("Error fetching availabilities:", err);
        if (err.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchAvailabilities();
  }, [dispatch, navigate]);

  const formatDate = (date) => {
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    return utcDate.toISOString().split("T")[0];
  };

  const handleSave = async () => {
    if (!startDate || !startTime || !endTime) {
      Swal.fire(
        "Missing Fields",
        "Please fill in all required fields.",
        "warning",
      );
      return;
    }

    const availabilityData = {
      availableStartDate: formatDate(startDate),
      availableEndDate: endDate ? formatDate(endDate) : null,
      startTime,
      endTime,
    };

    try {
      await dispatch(setAvailability(availabilityData)).unwrap();
      Swal.fire({
        icon: "success",
        title: "Schedule Added!",
        text: "Your time slots have been successfully generated.",
        timer: 2000,
        showConfirmButton: false,
      });
      resetForm();
      setIsFormOpen(false);
      // تحديث الداتا بعد الإضافة
      dispatch(getAvailabilities());
    } catch (error) {
      console.error("Error saving availability:", error);
      Swal.fire("Error", error.message || "Failed to save schedule", "error");
    }
  };

  const handleDeleteSingleSlot = (slot) => {
    if (slot.is_booked) {
      Swal.fire({
        title: "Emergency Cancellation!",
        text: "This slot is already BOOKED by a patient. Deleting it will cancel the appointment and notify them via email!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e3342f",
        cancelButtonColor: "#0f4c5c",
        confirmButtonText: "Yes, Cancel Appointment",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await dispatch(deleteAvailability(slot.available_id)).unwrap();
            Swal.fire(
              "Cancelled",
              "The appointment has been cancelled successfully.",
              "success",
            );
            dispatch(getAvailabilities());
          } catch (error) {
            Swal.fire("Error", "Could not delete this slot.", "error");
          }
        }
      });
    } else {
      Swal.fire({
        title: "Delete Slot?",
        text: "Are you sure you want to delete this empty time slot?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#2dd4bf",
        cancelButtonColor: "#slate-500",
        confirmButtonText: "Yes, Delete",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await dispatch(deleteAvailability(slot.available_id)).unwrap();
            dispatch(getAvailabilities());
          } catch (error) {
            Swal.fire("Error", "Could not delete this slot.", "error");
          }
        }
      });
    }
  };

  const handleDeleteDay = (dateStr, slots) => {
    const bookedSlots = slots.filter((slot) => slot.is_booked);

    if (bookedSlots.length > 0) {
      Swal.fire({
        title: "Emergency Cancellation!",
        text: `Warning! ${bookedSlots.length} slot(s) are already BOOKED by patients on this day. Deleting the day will CANCEL their appointments and send them emails!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e3342f",
        cancelButtonColor: "#0f4c5c",
        confirmButtonText: "Yes, Cancel All Appointments",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleting & Notifying...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });
          try {
            await Promise.all(
              slots.map((slot) =>
                dispatch(deleteAvailability(slot.available_id)).unwrap(),
              ),
            );
            Swal.fire(
              "Cancelled!",
              "The day and all appointments have been cleared.",
              "success",
            );
            dispatch(getAvailabilities());
          } catch (error) {
            Swal.fire("Error", "Failed to delete some slots.", "error");
            dispatch(getAvailabilities());
          }
        }
      });
    } else {
      Swal.fire({
        title: "Delete Entire Day?",
        text: `Are you sure you want to delete all ${slots.length} empty slots for this day?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#2dd4bf",
        cancelButtonColor: "#0f4c5c",
        confirmButtonText: "Yes, delete all!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleting...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });
          try {
            await Promise.all(
              slots.map((slot) =>
                dispatch(deleteAvailability(slot.available_id)).unwrap(),
              ),
            );
            Swal.fire(
              "Deleted!",
              "The entire day has been cleared.",
              "success",
            );
            dispatch(getAvailabilities());
          } catch (error) {
            Swal.fire("Error", "Failed to delete some slots.", "error");
            dispatch(getAvailabilities());
          }
        }
      });
    }
  };

  const resetForm = () => {
    setStartDate(null);
    setEndDate(null);
    setStartTime("");
    setEndTime("");
  };

  const isPastDate = (date) => {
    if (!date) return false; // 🛡️ حماية
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
  };

  // 🛡️ حماية فولاذية: استخراج الداتا بشكل آمن لمنع الكراش
  const getSafeAvailabilities = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data.flat(Infinity).filter(Boolean);
    if (data.availabilities && Array.isArray(data.availabilities))
      return data.availabilities;
    return [];
  };

  const safeList = getSafeAvailabilities(availabilities);

  // 🌟 سحر التجميع
  const groupSchedulesByDate = (schedules) => {
    const grouped = schedules.reduce((acc, slot) => {
      if (!slot || !slot.available_start_date) return acc; // 🛡️ حماية من الداتا الناقصة
      const d = new Date(slot.available_start_date);
      if (isNaN(d)) return acc; // 🛡️ حماية من التواريخ الخاطئة

      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(slot);
      return acc;
    }, {});
    return grouped;
  };

  const activeSchedulesRaw = safeList.filter(
    (a) => !a.is_deleted && !isPastDate(a.available_start_date),
  );
  const pastSchedulesRaw = safeList.filter(
    (a) => !a.is_deleted && isPastDate(a.available_start_date),
  );

  const groupedActive = groupSchedulesByDate(activeSchedulesRaw);
  const groupedPast = groupSchedulesByDate(pastSchedulesRaw);

  const sortedActiveDates = Object.keys(groupedActive).sort(
    (a, b) => new Date(a) - new Date(b),
  );
  const sortedPastDates = Object.keys(groupedPast).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  return (
    <div className="p-4 md:p-8 font-sans pb-20 animate-[fadeIn_0.5s_ease-in-out]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#0f4c5c] mb-2 flex items-center gap-3">
              <CalendarCheck className="text-[#2dd4bf]" size={32} />
              Schedule Master
            </h1>
            <p className="text-slate-500">
              Manage your working hours and availability for patient bookings.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="bg-[#0f4c5c] text-white px-6 py-3.5 rounded-xl text-sm font-bold hover:bg-[#165a6c] transition-all flex items-center shadow-lg hover:-translate-y-1"
          >
            <PlusCircle className="mr-2" size={20} /> Add New Availability
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 flex gap-4 text-[#0f4c5c]">
          <Info className="shrink-0 text-[#2dd4bf] mt-0.5" size={24} />
          <div>
            <h4 className="font-bold mb-1">How does this work?</h4>
            <p className="text-sm opacity-80 leading-relaxed">
              Add a time range (e.g., 10:00 AM to 12:00 PM). The system
              automatically cuts it into 30-minute patient booking slots. You
              can clear an entire day or remove individual 30-minute slots
              easily below.{" "}
              <strong className="text-blue-600">
                Blue slots are booked by patients!
              </strong>
            </p>
          </div>
        </div>

        {/* 🌟 Active Schedules */}
        <div>
          <h2 className="text-xl font-bold text-[#0f4c5c] mb-6 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2dd4bf] animate-pulse"></span>
            Active Schedule Blocks
          </h2>

          {loading && sortedActiveDates.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2dd4bf]"></div>
            </div>
          ) : sortedActiveDates.length > 0 ? (
            <div className="space-y-6">
              {sortedActiveDates.map((dateStr) => {
                const slots = groupedActive[dateStr];
                // 🛡️ حماية أثناء الترتيب
                slots.sort((a, b) =>
                  (a.available_start_time || "").localeCompare(
                    b.available_start_time || "",
                  ),
                );

                return (
                  <div
                    key={dateStr}
                    className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                    {/* Date Header */}
                    <div className="flex justify-between items-center mb-5 border-b border-slate-50 pb-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="bg-teal-50 text-[#0f4c5c] p-3 rounded-2xl">
                          <Calendar size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-[#0f4c5c]">
                            {new Date(dateStr).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </h3>
                          <p className="text-sm font-bold text-slate-400 mt-1">
                            {slots.length} Sessions Available
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteDay(dateStr, slots)}
                        className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                      >
                        <Trash2 size={16} /> Clear Day
                      </button>
                    </div>

                    {/* 🎨 Time Chips Grid */}
                    <div className="flex flex-wrap gap-3 relative z-10">
                      {slots.map((slot) => {
                        // 🛡️ حماية أثناء طباعة الوقت
                        const timeDisplay = slot.available_start_time
                          ? slot.available_start_time.slice(0, 5)
                          : "--:--";
                        return (
                          <div
                            key={slot.available_id || Math.random()}
                            className={`border pl-4 pr-2 py-2 rounded-xl flex items-center gap-2 transition-colors ${
                              slot.is_booked
                                ? "bg-blue-600 border-blue-700 text-white shadow-md"
                                : "bg-slate-50 border-slate-200 hover:border-[#2dd4bf] text-[#0f4c5c]"
                            }`}
                          >
                            <Clock
                              size={14}
                              className={
                                slot.is_booked
                                  ? "text-blue-200"
                                  : "text-[#2dd4bf]"
                              }
                            />
                            <span className="font-bold text-sm tracking-wide">
                              {timeDisplay}
                            </span>

                            {slot.is_booked && (
                              <span className="text-[10px] uppercase font-black bg-white text-blue-600 px-1.5 py-0.5 rounded ml-1 shadow-sm">
                                Booked
                              </span>
                            )}

                            <div
                              className={`w-px h-4 mx-1 ${slot.is_booked ? "bg-blue-400" : "bg-slate-200"}`}
                            ></div>

                            <button
                              onClick={() => handleDeleteSingleSlot(slot)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                slot.is_booked
                                  ? "text-blue-200 hover:text-white hover:bg-red-500"
                                  : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                              }`}
                              title={
                                slot.is_booked
                                  ? "Cancel this appointment"
                                  : "Delete this empty slot"
                              }
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center">
              <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium text-lg">
                No active schedules found.
              </p>
            </div>
          )}
        </div>

        {/* 🌟 Past Schedules */}
        {sortedPastDates.length > 0 && (
          <div className="mt-12 opacity-70">
            <h2 className="text-lg font-bold text-slate-500 mb-6 flex items-center gap-2 border-t border-slate-200 pt-8">
              <History size={20} /> Past Schedule History
            </h2>
            <div className="space-y-4">
              {sortedPastDates.map((dateStr) => {
                const slots = groupedPast[dateStr];
                return (
                  <div
                    key={dateStr}
                    className="bg-slate-100 p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 grayscale"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-slate-400" />
                      <span className="text-slate-600 font-bold">
                        {new Date(dateStr).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {slots.map((s) => (
                        <span
                          key={s.available_id || Math.random()}
                          className={`text-xs font-bold px-2 py-1 rounded-md ${
                            s.is_booked
                              ? "bg-slate-300 text-slate-600"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {s.available_start_time
                            ? s.available_start_time.slice(0, 5)
                            : "--:--"}{" "}
                          {s.is_booked ? "(Booked)" : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-in-out]">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden scale-100 transition-transform">
            <div className="bg-[#0f4c5c] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold flex items-center gap-2">
                <PlusCircle size={20} className="text-[#2dd4bf]" /> Generate
                Time Slots
              </h3>
              <button
                onClick={() => {
                  resetForm();
                  setIsFormOpen(false);
                }}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={setStartDate}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select start date"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] outline-none text-slate-700 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    End Date{" "}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={setEndDate}
                    minDate={startDate || new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Same as start date"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] outline-none text-slate-700 w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] outline-none text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] outline-none text-slate-700"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-100 mt-8">
                <button
                  onClick={() => {
                    resetForm();
                    setIsFormOpen(false);
                  }}
                  className="flex-1 px-5 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-[2] px-5 py-3.5 bg-[#0f4c5c] text-white rounded-xl font-bold hover:bg-[#165a6c] shadow-md transition-all flex justify-center items-center gap-2"
                >
                  <Save size={18} /> Generate Slots
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DatePicker Custom Styles Override */}
      <style>{`
        .react-datepicker-wrapper { display: block; width: 100%; }
        .react-datepicker { font-family: inherit; border: 1px solid #e2e8f0; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
        .react-datepicker__header { background-color: #0f4c5c; border-bottom: none; border-top-left-radius: 1rem; border-top-right-radius: 1rem; padding-top: 1rem; }
        .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header { color: white; }
        .react-datepicker__day-name { color: #2dd4bf; }
        .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__month-text--selected, .react-datepicker__month-text--in-selecting-range, .react-datepicker__month-text--in-range { background-color: #2dd4bf; color: #0f4c5c; font-weight: bold; }
        .react-datepicker__day--keyboard-selected { background-color: #165a6c; color: white; }
      `}</style>
    </div>
  );
};

export default DoctorScheduling;
