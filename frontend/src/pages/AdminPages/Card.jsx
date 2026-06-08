import { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import axios from "axios";
import html2canvas from "html2canvas";
import PropTypes from "prop-types";

const Card = (props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatePresence>
      {expanded ? (
        <ExpandedCard param={props} setExpanded={() => setExpanded(false)} />
      ) : (
        <CompactCard param={props} setExpanded={() => setExpanded(true)} />
      )}
    </AnimatePresence>
  );
};

function CompactCard({ param, setExpanded }) {
  const Png = param.png;
  return (
    <motion.div
      layoutId={`cardContainer-${param.title}`}
      className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-44"
      onClick={setExpanded}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2dd4bf]/20 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {param.type === "appointment" || param.type === "schedule"
              ? "Total Records"
              : "Total Registered"}
          </p>
          <h3 className="text-2xl font-serif font-bold text-[#0f4c5c]">
            {param.title}
          </h3>
        </div>
        <div className="w-14 h-14 relative z-10 drop-shadow-sm">
          <CircularProgressbar
            value={param.barValue}
            text={`${param.barValue}%`}
            styles={{
              path: {
                stroke: "#2dd4bf",
                strokeLinecap: "round",
                transition: "stroke-dashoffset 0.5s ease 0s",
              },
              text: { fill: "#0f4c5c", fontSize: "26px", fontWeight: "bold" },
              trail: { stroke: "#f1f5f9" },
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-end mt-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-[#2dd4bf] group-hover:bg-[#2dd4bf] group-hover:text-white transition-colors duration-300 shadow-sm">
          <Png className="w-6 h-6" />
        </div>
        <span className="text-4xl font-bold text-[#0f4c5c] tracking-tight">
          {param.value}
        </span>
      </div>
    </motion.div>
  );
}

CompactCard.propTypes = {
  param: PropTypes.shape({
    png: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    barValue: PropTypes.number.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  setExpanded: PropTypes.func.isRequired,
};

function ExpandedCard({ param, setExpanded }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (param.type === "patient") {
          response = await axios.get(
            "https://midlink-backend.onrender.com/api/Allpatients",
          );
        } else if (param.type === "doctor") {
          response = await axios.get(
            "https://midlink-backend.onrender.com/api/admin/staff",
          );
        } else if (param.type === "appointment") {
          response = await axios.get(
            "https://midlink-backend.onrender.com/api/AdminPatientAppointments",
          );
        } else if (param.type === "schedule") {
          response = await axios.get(
            "https://midlink-backend.onrender.com/api/schedules",
          );
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
    const element = document.getElementById("info-table");
    const canvas = await html2canvas(element, { scale: 2 }); // Scale 2 for better resolution
    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = imgData;
      link.download = `MidLink_${param.title}_Report.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(imgData);
    }
  };

  const renderTable = () => {
    const headerClass =
      "px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-100";
    const cellClass =
      "px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium";

    if (param.type === "patient") {
      return (
        <table className="min-w-full divide-y divide-slate-100">
          <thead>
            <tr>
              <th className={headerClass}>Username</th>
              <th className={headerClass}>Email</th>
              <th className={headerClass}>Gender</th>
              <th className={headerClass}>Date of Birth</th>
              <th className={headerClass}>Blood Type</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {data.map((patient) => (
              <tr
                key={patient.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className={`${cellClass} font-bold text-[#0f4c5c]`}>
                  {patient.username}
                </td>
                <td className={cellClass}>{patient.email}</td>
                <td className={cellClass}>
                  <span className="capitalize bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs">
                    {patient.gender}
                  </span>
                </td>
                <td className={cellClass}>
                  {new Date(patient.dob).toLocaleDateString()}
                </td>
                <td className={cellClass}>
                  <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded-md">
                    {patient.blood_type || "N/A"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (param.type === "doctor") {
      return (
        <table className="min-w-full divide-y divide-slate-100">
          <thead>
            <tr>
              <th className={headerClass}>Name</th>
              <th className={headerClass}>Email</th>
              <th className={headerClass}>Specialty</th>
              <th className={headerClass}>Status (Approved)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {data.map((doctor) => (
              <tr
                key={doctor.staff_id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className={`${cellClass} font-bold text-[#0f4c5c]`}>
                  {doctor.staff_name}
                </td>
                <td className={cellClass}>{doctor.email}</td>
                <td className={cellClass}>
                  <span className="bg-teal-50 text-[#0f4c5c] px-3 py-1 rounded-md text-xs font-bold">
                    {doctor.specialty}
                  </span>
                </td>
                <td className={cellClass}>
                  {doctor.is_approved ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold">
                      Approved
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-xs font-bold">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (param.type === "appointment") {
      return (
        <table className="min-w-full divide-y divide-slate-100">
          <thead>
            <tr>
              <th className={headerClass}>ID</th>
              <th className={headerClass}>Patient Name</th>
              <th className={headerClass}>Doctor Name</th>
              <th className={headerClass}>Date</th>
              <th className={headerClass}>Time</th>
              <th className={headerClass}>Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {data.map((appointment) => (
              <tr
                key={appointment.appointment_id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className={`${cellClass} text-slate-400 font-bold`}>
                  #{appointment.appointment_id}
                </td>
                <td className={`${cellClass} font-bold text-[#0f4c5c]`}>
                  {appointment.patient_name}
                </td>
                <td className={`${cellClass} font-bold text-[#2dd4bf]`}>
                  {appointment.doctor_name}
                </td>
                <td className={cellClass}>
                  {appointment.available_start_date
                    ? new Date(
                        appointment.available_start_date,
                      ).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className={cellClass}>
                  {appointment.available_start_time
                    ? appointment.available_start_time.slice(0, 5)
                    : "N/A"}
                </td>
                <td className={cellClass}>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      appointment.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : appointment.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {appointment.status || "Scheduled"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (param.type === "schedule") {
      return (
        <table className="min-w-full divide-y divide-slate-100">
          <thead>
            <tr>
              <th className={headerClass}>Doctor Name</th>
              <th className={headerClass}>Specialty</th>
              <th className={headerClass}>Date</th>
              <th className={headerClass}>Start Time</th>
              <th className={headerClass}>End Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {data.map((schedule) => (
              <tr
                key={schedule.availability_id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className={`${cellClass} font-bold text-[#0f4c5c]`}>
                  {schedule.staff_name}
                </td>
                <td className={cellClass}>
                  <span className="bg-teal-50 text-[#0f4c5c] px-2 py-1 rounded-md text-xs">
                    {schedule.specialty}
                  </span>
                </td>
                <td className={cellClass}>
                  {new Date(schedule.available_start_date).toLocaleDateString()}
                </td>
                <td className={cellClass}>
                  {schedule.available_start_time
                    ? schedule.available_start_time.slice(0, 5)
                    : ""}
                </td>
                <td className={cellClass}>
                  {schedule.available_end_time
                    ? schedule.available_end_time.slice(0, 5)
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        layoutId={`cardContainer-${param.title}`}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white z-10">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#0f4c5c]">
              {param.title} Information
            </h2>
            <p className="text-sm text-slate-500">
              Detailed view and downloadable report
            </p>
          </div>
          <button
            onClick={setExpanded}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <UilTimes size="24" />
          </button>
        </div>

        {/* Modal Body (Table Area) */}
        <div className="flex-grow overflow-auto custom-scrollbar bg-slate-50/30 p-6">
          <div
            id="info-table"
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            {/* Download Header inside the image for context */}
            <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center hide-on-screen">
              <h3 className="font-serif font-bold text-[#0f4c5c] text-lg">
                MidLink System Report
              </h3>
              <p className="text-sm font-medium text-slate-400">
                {new Date().toLocaleDateString()}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2dd4bf]"></div>
              </div>
            ) : data.length > 0 ? (
              <div className="overflow-x-auto">{renderTable()}</div>
            ) : (
              <div className="text-center py-16 text-slate-500">
                <p className="text-lg font-medium">No records found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer (Download Button) */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={downloadInfo}
            disabled={loading || data.length === 0}
            className="bg-[#0f4c5c] hover:bg-[#165a6c] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download {param.title} Report
          </button>
        </div>
      </motion.div>

      <style>{`
        /* Hide the report header on screen, only show in downloaded image */
        .hide-on-screen { display: none !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #2dd4bf; }
      `}</style>
    </motion.div>
  );
}

ExpandedCard.propTypes = {
  param: PropTypes.shape({
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  setExpanded: PropTypes.func.isRequired,
};

export default Card;
