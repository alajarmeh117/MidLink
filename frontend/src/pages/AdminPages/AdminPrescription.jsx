import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import {
  FileSignature,
  Stethoscope,
  User,
  Pill,
  Activity,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function AdminPrescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/Prescription/prescriptions",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions");
      }
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setError(
        "Unable to load prescription records. Please check your connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-w-0 p-6 md:p-10 overflow-y-auto animate-[fadeIn_0.4s_ease-in-out]">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#0f4c5c] flex items-center gap-3">
                <FileSignature className="text-[#2dd4bf]" size={32} />
                Prescription Records
              </h1>
              <p className="text-slate-500 mt-2">
                Monitor all medical prescriptions and treatment plans issued by
                doctors across the platform.
              </p>
            </div>

            <div className="bg-teal-50 px-5 py-3 rounded-xl border border-teal-100 flex items-center gap-3">
              <span className="text-3xl font-bold text-[#0f4c5c]">
                {prescriptions.length}
              </span>
              <span className="text-sm font-medium text-slate-600 leading-tight">
                Total
                <br />
                Prescriptions
              </span>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2dd4bf]"></div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 text-red-600 p-6 rounded-[2rem] border border-red-100 text-center flex flex-col items-center gap-3">
              <AlertCircle size={40} className="text-red-400" />
              <p className="font-bold text-lg">{error}</p>
            </div>
          )}

          {/* Table Container */}
          {!isLoading && !error && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                      <th className="py-4 px-6 font-bold uppercase tracking-wider">
                        Issuing Doctor
                      </th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider">
                        Patient Name
                      </th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider w-1/4">
                        Diagnosis
                      </th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider w-1/4">
                        Prescribed Drugs
                      </th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider w-1/4">
                        Treatment Plan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {prescriptions.length > 0 ? (
                      prescriptions.map((prescription, index) => (
                        <tr
                          key={index}
                          className="hover:bg-slate-50 transition-colors group"
                        >
                          {/* Doctor */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-[#0f4c5c] font-bold">
                              <Stethoscope
                                size={16}
                                className="text-[#2dd4bf]"
                              />
                              {prescription.doctor_name}
                            </div>
                          </td>

                          {/* Patient */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-slate-700 font-bold">
                              <User size={16} className="text-slate-400" />
                              {prescription.patient_name}
                            </div>
                          </td>

                          {/* Diagnosis */}
                          <td className="py-4 px-6">
                            <div className="flex items-start gap-2">
                              <Activity
                                size={16}
                                className="text-rose-400 shrink-0 mt-0.5"
                              />
                              <span className="text-slate-600 text-sm font-medium">
                                {prescription.diagnosis || "N/A"}
                              </span>
                            </div>
                          </td>

                          {/* Drugs */}
                          <td className="py-4 px-6">
                            <div className="flex items-start gap-2">
                              <Pill
                                size={16}
                                className="text-amber-400 shrink-0 mt-0.5"
                              />
                              <span className="text-slate-600 text-sm">
                                {prescription.drugs || "None prescribed"}
                              </span>
                            </div>
                          </td>

                          {/* Treatment Plan */}
                          <td className="py-4 px-6">
                            <div className="flex items-start gap-2">
                              <FileText
                                size={16}
                                className="text-blue-400 shrink-0 mt-0.5"
                              />
                              <span
                                className="text-slate-600 text-sm max-w-xs line-clamp-2"
                                title={prescription.treatment_plan}
                              >
                                {prescription.treatment_plan ||
                                  "No detailed plan provided"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-16 text-center text-slate-500"
                        >
                          <FileSignature
                            size={48}
                            className="mx-auto text-slate-300 mb-4"
                          />
                          <p className="text-lg font-medium text-[#0f4c5c]">
                            No prescriptions recorded yet
                          </p>
                          <p className="text-sm mt-1">
                            Medical records will appear here once doctors start
                            issuing them.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
