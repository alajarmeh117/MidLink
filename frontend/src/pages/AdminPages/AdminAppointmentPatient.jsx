import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import Swal from 'sweetalert2';

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/AdminPatientAppointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleCancel = (appointment) => {
    if (appointment.status === 'Completed') {
      Swal.fire({
        icon: 'error',
        title: 'Cannot Cancel',
        text: 'Completed appointments cannot be cancelled.',
      });
      return;
    }
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const confirmCancel = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/AdminPatientAppointments/cancel', {
        appointmentId: selectedAppointment.appointment_id,
        reason: cancelReason,
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Cancelled Successfully',
          text: response.data.message,
        });
        setIsModalOpen(false);
        setCancelReason('');
        fetchAppointments();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Cancellation Failed',
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Cancellation Failed',
        text: 'An error occurred while cancelling the appointment.',
      });
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-4 w-full bg-gradient-to-b from-[#f6f5f2] to-white">
        <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-[#e6f0f5]">
              <tr>
                <th className="py-3 px-6 text-left">Patient</th>
                <th className="py-3 px-6 text-left">Doctor</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Time</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.appointment_id} className="border-t">
                  <td className="py-3 px-6">{appointment.patient_name}</td>
                  <td className="py-3 px-6">{appointment.doctor_name}</td>
                  <td className="py-3 px-6">{appointment.available_start_date}</td>
                  <td className="py-3 px-6">{appointment.available_start_time}</td>
                  <td className="py-3 px-6">{appointment.status}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleCancel(appointment)}
                      className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition ${
                        appointment.status === 'Cancelled' || appointment.status === 'Completed' ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                      disabled={appointment.status === 'Cancelled' || appointment.status === 'Completed'}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Cancel Appointment</h2>
              <p className="mb-2">Please provide a reason for cancellation:</p>
              <textarea
                className="w-full border border-gray-300 p-2 rounded mb-4"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={confirmCancel}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Confirm Cancellation
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Close
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