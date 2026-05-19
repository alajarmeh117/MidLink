import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, Calendar, X, Users, Clock } from "lucide-react"; // 🔥 ضفنا أيقونة الساعة
import PropTypes from "prop-types";

const AppointmentForm = ({ doctor, onClose }) => {
  const [availableSlots, setAvailableSlots] = useState([]);

  // 🔥 حالات جديدة عشان نظام الـ Two-Step
  const [groupedSlots, setGroupedSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [showPayPal, setShowPayPal] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableSlots();
  }, [doctor.staff_id]);

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/appointment/doctors/${doctor.staff_id}/available-slots`,
        { withCredentials: true },
      );

      const slots = response.data;
      setAvailableSlots(slots);

      // 🌟 سحر التجميع: تجميع المواعيد حسب اليوم
      if (slots.length > 0) {
        const grouped = slots.reduce((acc, slot) => {
          // ✅ الحل الجذري: تحويل التاريخ للتوقيت المحلي قبل التجميع
          const d = new Date(slot.available_start_date);
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          
          if (!acc[dateStr]) acc[dateStr] = [];
          acc[dateStr].push(slot);
          return acc;
        }, {});

        // ترتيب المواعيد جوا كل يوم حسب الساعة
        Object.keys(grouped).forEach((date) => {
          grouped[date].sort((a, b) =>
            a.available_start_time.localeCompare(b.available_start_time),
          );
        });

        setGroupedSlots(grouped);

        // اختيار أول يوم متاح تلقائياً عشان نريح المريض
        const sortedDates = Object.keys(grouped).sort(
          (a, b) => new Date(a) - new Date(b),
        );
        setSelectedDate(sortedDates[0]);
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleJoinWaitingList = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/appointment/doctors/${doctor.staff_id}/waiting-list`,
        {},
        { withCredentials: true },
      );

      const alertElement = document.createElement("div");
      alertElement.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-sm mx-auto text-center">
            <h2 class="text-xl font-bold mb-4 text-green-600">Added to Waiting List!</h2>
            <p class="mb-4">${response.data.message}</p>
            <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">OK</button>
          </div>
        </div>
      `;
      document.body.appendChild(alertElement);
      alertElement.querySelector("button").onclick = () => {
        alertElement.remove();
        onClose();
      };
    } catch (error) {
      const alertElement = document.createElement("div");
      alertElement.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-sm mx-auto text-center">
            <h2 class="text-xl font-bold mb-4 text-red-600">Notice</h2>
            <p class="mb-4">${error.response?.data?.message || "Failed to join waiting list."}</p>
            <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">OK</button>
          </div>
        </div>
      `;
      document.body.appendChild(alertElement);
      alertElement.querySelector("button").onclick = () =>
        alertElement.remove();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return; // منع الإرسال إذا ما اختار موعد

    try {
      const response = await axios.post(
        "http://localhost:5000/api/appointment/appointments",
        {
          available_id: selectedSlot,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.appointment_id) {
        setAppointmentId(response.data.appointment_id);
        setShowPayPal(true);
      } else {
        throw new Error("No appointment ID received");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      } else {
        const alertElement = document.createElement("div");
        alertElement.innerHTML = `
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-[2rem] p-8 max-w-sm mx-auto shadow-2xl">
              <h2 class="text-xl font-black mb-4 text-red-500">Error!</h2>
              <p class="mb-6 font-medium text-slate-600">${
                error.response?.data?.message ||
                "Failed to book appointment. Please try again."
              }</p>
              <button class="w-full bg-red-500 text-white font-bold px-4 py-3 rounded-xl hover:bg-red-600 transition duration-300">OK</button>
            </div>
          </div>
        `;
        document.body.appendChild(alertElement);
        alertElement.querySelector("button").onclick = () =>
          alertElement.remove();
      }
    }
  };

  const createOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/payments/create-order",
        {
          amount: "20",
          appointmentId: appointmentId,
        },
        {
          withCredentials: true,
        },
      );
      return response.data.id;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  };

  const onApprove = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/payments/capture-order",
        {
          orderId: data.orderID,
          appointmentId: appointmentId,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.status === "COMPLETED") {
        const alertElement = document.createElement("div");
        alertElement.innerHTML = `
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-[2rem] p-8 max-w-sm mx-auto shadow-2xl text-center">
              <div class="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 class="text-2xl font-black mb-2 text-[#04333a]">Success!</h2>
              <p class="mb-6 font-medium text-slate-500">Appointment booked and payment completed successfully!</p>
              <button class="w-full bg-[#0a7a8c] text-white font-bold px-4 py-3 rounded-xl hover:bg-[#04333a] transition duration-300 shadow-lg">Done</button>
            </div>
          </div>
        `;
        document.body.appendChild(alertElement);
        alertElement.querySelector("button").onclick = () => {
          alertElement.remove();
          onClose();
        };
      } else {
        throw new Error(`Transaction failed: ${response.data.status}`);
      }
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
    }
  };

  const sortedDates = Object.keys(groupedSlots).sort(
    (a, b) => new Date(a) - new Date(b),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#04333a]/60 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-40 p-4"
    >
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative p-8 w-full max-w-lg shadow-2xl rounded-[2.5rem] bg-white border border-white/20"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-full transition duration-300"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="bg-[#e6f0f5] p-3 rounded-2xl">
            <Stethoscope className="text-[#0a7a8c] w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#04333a] tracking-tight">
              Book Appointment
            </h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
              Dr. {doctor.staff_name.split(" ")[0]}
            </p>
          </div>
        </div>

        {!showPayPal ? (
          availableSlots.length > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 🟢 Step 1: Select Date */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calendar size={14} className="text-[#0a7a8c]" /> Step 1:
                  Select Date
                </label>
                <div className="flex overflow-x-auto gap-3 pb-2 snap-x custom-scrollbar">
                  {sortedDates.map((dateStr) => {
                    // ✅ بعد — صح (بيفرض توقيت محلي)
                    const [year, month, day] = dateStr.split("-");
                    const dateObj = new Date(+year, +month - 1, +day);
                    const isSelected = selectedDate === dateStr;
                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => {
                          setSelectedDate(dateStr);
                          setSelectedSlot(""); // تفريغ الساعة لما نغير اليوم
                        }}
                        className={`snap-start shrink-0 px-5 py-3 rounded-2xl font-bold transition-all duration-300 border-2 ${
                          isSelected
                            ? "bg-[#04333a] text-white border-[#04333a] shadow-lg shadow-[#04333a]/20 scale-105"
                            : "bg-gray-50 text-gray-600 border-gray-100 hover:border-[#0a7a8c] hover:bg-gray-100"
                        }`}
                      >
                        <div className="text-[10px] uppercase tracking-wider opacity-80 mb-1">
                          {dateObj.toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </div>
                        <div className="text-xl">
                          {dateObj.toLocaleDateString("en-US", {
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-xs opacity-90 mt-1">
                          {dateObj.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 🟢 Step 2: Select Time */}
              <AnimatePresence mode="wait">
                {selectedDate && (
                  <motion.div
                    key={selectedDate}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4 flex items-center gap-2">
                      <Clock size={14} className="text-[#0a7a8c]" /> Step 2:
                      Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {groupedSlots[selectedDate].map((slot) => {
                        const isSelected = selectedSlot === slot.available_id;
                        return (
                          <button
                            key={slot.available_id}
                            type="button"
                            onClick={() => setSelectedSlot(slot.available_id)}
                            className={`py-3 px-2 rounded-xl font-bold text-sm transition-all duration-300 border-2 ${
                              isSelected
                                ? "bg-[#2dd4bf] text-[#04333a] border-[#2dd4bf] shadow-md shadow-[#2dd4bf]/20"
                                : "bg-white text-gray-600 border-gray-200 hover:border-[#2dd4bf] hover:text-[#0a7a8c]"
                            }`}
                          >
                            {slot.available_start_time.slice(0, 5)}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-6 border-t border-gray-100 mt-6">
                <motion.button
                  whileHover={{ scale: selectedSlot ? 1.02 : 1 }}
                  whileTap={{ scale: selectedSlot ? 0.98 : 1 }}
                  type="submit"
                  disabled={!selectedSlot}
                  className="w-full bg-gradient-to-r from-[#04333a] to-[#0a7a8c] text-white font-black py-4 px-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                >
                  Proceed to Payment
                </motion.button>
              </div>
            </form>
          ) : (
            // إذا ما في مواعيد متوفرة
            <div className="space-y-6 text-center py-6">
              <div className="flex justify-center mb-6">
                <div className="bg-amber-50 p-6 rounded-full border border-amber-100">
                  <Users size={48} className="text-amber-500" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-[#04333a]">
                Fully Booked
              </h3>
              <p className="text-gray-500 font-medium px-4">
                This doctor has no available slots right now. Join the waiting
                list to get notified when a spot opens up!
              </p>
              <div className="flex flex-col gap-3 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleJoinWaitingList}
                  className="w-full bg-amber-500 text-white font-black py-4 px-4 rounded-2xl shadow-lg hover:bg-amber-600 transition-colors uppercase tracking-widest text-sm"
                >
                  Join Waiting List
                </motion.button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-gray-50 text-gray-500 font-bold py-4 px-4 rounded-2xl hover:bg-gray-100 transition-colors uppercase tracking-widest text-sm"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-in-out]">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-blue-800 font-medium text-center text-sm">
              Please complete the secure payment to confirm your appointment
              slot.
            </div>
            <div className="p-1 rounded-2xl shadow-inner bg-gray-50 border border-gray-100 min-h-[150px]">
              <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
                style={{ layout: "vertical", shape: "pill", label: "pay" }}
              />
            </div>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-600 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel Payment
            </button>
          </div>
        )}
      </motion.div>

      {/* شريط التمرير المخفي للأيام */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
      `}</style>
    </motion.div>
  );
};

AppointmentForm.propTypes = {
  doctor: PropTypes.shape({
    staff_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    staff_name: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AppointmentForm;
