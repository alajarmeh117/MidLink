import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import axios from 'axios';
import html2canvas from 'html2canvas';

const Card = (props) => {
  const [expanded, setExpanded] = useState(false);
  return expanded ? (
    <ExpandedCard param={props} setExpanded={() => setExpanded(false)} />
  ) : (
    <CompactCard param={props} setExpanded={() => setExpanded(true)} />
  );
};

function CompactCard({ param, setExpanded }) {
  const Png = param.png;
  return (
    <motion.div
      className="bg-gradient-to-r from-[#e6f0f5] to-[#04333a] rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-40"
      onClick={setExpanded}
    >
      
      <div className="flex justify-between items-start">
        <div className="">
          <h3 className="text-xl font-bold mb-1">{param.title}</h3>
          <p className="text-sm opacity-80">{param.type === 'appointment' || param.type === 'schedule' ? 'Total' : 'Registered'}</p>
        </div>
        <div className="w-12 h-12">
          <CircularProgressbar
            value={param.barValue}
            text={`${param.barValue}%`}
            styles={{
              path: { stroke: '#fff' },
              text: { fill: '#fff', fontSize: '24px' },
              trail: { stroke: 'rgba(255,255,255,0.2)' },
            }}
          />
        </div>
      </div>
      <div className="flex justify-between items-end mt-4">
        <Png className="w-8 h-8 " />
        <span className="text-2xl text-white font-bold ">{param.value}</span>
      </div>
    </motion.div>
  );
}

function ExpandedCard({ param, setExpanded }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (param.type === 'patient') {
          response = await axios.get('http://localhost:5000/api/Allpatients');
        } else if (param.type === 'doctor') {
          response = await axios.get('http://localhost:5000/api/admin/staff');
        } else if (param.type === 'appointment') {
          response = await axios.get('http://localhost:5000/api/AdminPatientAppointments');
        } else if (param.type === 'schedule') {
          response = await axios.get('http://localhost:5000/api/schedules');
        }
        setData(response.data);
      } catch (error) {
        console.error(`Error fetching ${param.type} data:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [param.type]);

  const downloadInfo = async () => {
    const element = document.getElementById('info-table');
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = data;
      link.download = `${param.type}_information.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  const renderTable = () => {
    if (param.type === 'patient') {
      return (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">{patient.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(patient.dob).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.blood_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (param.type === 'doctor') {
      return (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Approved</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((doctor) => (
              <tr key={doctor.staff_id}>
                <td className="px-6 py-4 whitespace-nowrap">{doctor.staff_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doctor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doctor.specialty}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doctor.is_approved ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (param.type === 'appointment') {
      return (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((appointment) => (
              <tr key={appointment.appointment_id}>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.appointment_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.patient_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.doctor_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.available_start_date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.available_start_time}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (param.type === 'schedule') {
      return (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((schedule) => (
              <tr key={schedule.availability_id}>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.staff_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.specialty}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(schedule.available_start_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.available_start_time}</td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.available_end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-lg shadow-xl w-4/5 h-4/5 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 bg-blue-600 ">
          <h2 className="text-2xl font-bold">{param.title} Information</h2>
          <button onClick={setExpanded} className=" hover:text-gray-200">
            <UilTimes size="24" />
          </button>
        </div>
        <div className="flex-grow overflow-auto p-4" id="info-table">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {renderTable()}
            </div>
          )}
        </div>
        <div className="p-4 bg-gray-100">
          <button
            onClick={downloadInfo}
            className="bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Download {param.title} Information
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Card;