
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAppointments,
  updateAppointmentStatus,
  addHealthcareRecord,
  fetchWeeklyAppointments,
} from "../../../store/appointmentsSlice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, Users, Activity } from 'lucide-react';

const AppointmentDashboard = () => {
  const dispatch = useDispatch();
  const { total, today, todayAppointments, loading, error, weeklyData } = useSelector(
    (state) => state.appointments
  );
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({ diagnosis: '', drugs: '', treatmentPlan: '' }); // Initialize form data
  const appointmentsPerPage = 3;

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchWeeklyAppointments());
  }, [dispatch]);

  const handleToggleStatus = async (appointmentId, currentStatus) => {
    try {
      await dispatch(
        updateAppointmentStatus({ appointmentId, isDone: !currentStatus })
      ).unwrap();
    } catch (error) {
      console.error(`Failed to update appointment: ${error.message}`);
    }
  };

  const handleOpenForm = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseForm = () => {
    setSelectedAppointment(null);
    setFormData({ diagnosis: '', drugs: '', treatmentPlan: '' }); 
  };
console.log(selectedAppointment)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        addHealthcareRecord({
          patientId: selectedAppointment.id,
          staffId: "STAFF_ID_HERE", 
          diagnosis: formData.diagnosis,
          drugs: formData.drugs,
          treatmentPlan: formData.treatmentPlan,
        })
      ).unwrap();
      handleCloseForm(); // Close the form after successful submission
    } catch (error) {
      console.error(`Failed to add healthcare record: ${error.message}`);
    }
  };

  const formattedWeeklyData = weeklyData.map(item => ({
    ...item,
    day: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const scheduledAppointments = todayAppointments.filter(app => !app.is_done).length;
  const completedAppointments = todayAppointments.filter(app => app.is_done).length;
  const totalTodayAppointments = scheduledAppointments + completedAppointments;

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = todayAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 bg-[#f6f5f2] bg-opacity-60 pb-[4rem] max-h-screen">
      <h1 className="text-3xl font-bold text-[#04333a] mb-8">Doctor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Calendar size={24} />} title="Total Appointments" value={total} color="bg-[#c4f7ff] bg-opacity-50" />
        <StatCard icon={<Clock size={24} />} title="Today's Appointments" value={totalTodayAppointments} color="bg-[#c4f7ff]" />
        <StatCard icon={<Users size={24} />} title="Scheduled Today" value={scheduledAppointments} color="bg-[#88efff]" />
        <StatCard icon={<Activity size={24} />} title="Completed Today" value={completedAppointments} color="bg-[#58e6fc]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-[#04333a]">Weekly Appointments</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedWeeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-[#04333a]">Today's Appointments</h2>
          <ul className="divide-y divide-gray-200">
            {currentAppointments.map((appointment) => (
              <li key={appointment.appointment_id} className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={appointment.patient_image || "https://via.placeholder.com/40"}
                    alt={appointment.patient_name}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-[#04333a]">{appointment.patient_name}</p>
                    <p className="text-sm text-gray-500">{appointment.available_start_time}</p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleToggleStatus(appointment.appointment_id, appointment.is_done)}
                    className={`px-4 py-2 rounded-full  ${appointment.is_done ? "hover:bg-[#c4f7ff] bg-[#88efff] " : "hover:bg-[#075561] bg-[#04333a] text-white"} transition duration-300 ease-in-out`}
                  >
                    {appointment.is_done ? "Completed" : "Pending"}
                  </button>
                  {appointment.is_done && (
                    <button
                      onClick={() => handleOpenForm(appointment)}
                      className="ml-2 px-4 py-2 text-white hover:bg-[#075561] bg-[#04333a]  rounded-full transition duration-300 ease-in-out"
                    >
                      Add Record
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-center">
            {Array.from({ length: Math.ceil(todayAppointments.length / appointmentsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-[#04333a] text-white' : 'bg-gray-200'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Record Form Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Healthcare Record</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Diagnosis</label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Drugs</label>
                <input
                  type="text"
                  value={formData.drugs}
                  onChange={(e) => setFormData({ ...formData, drugs: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Treatment Plan</label>
                <textarea
                  value={formData.treatmentPlan}
                  onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className={`${color} text-black rounded-lg p-6 flex items-center justify-between`}>
    <div>
      <p className="text-sm uppercase">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
    <div className="text-4xl opacity-80">{icon}</div>
  </div>
);

export default AppointmentDashboard;
