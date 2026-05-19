import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPatientRecords,
  updatePatientInfo,
  updateHealthcareRecord,
  deleteHealthcareRecord,
} from "../../store/appointmentsSlice";
import {
  Edit2,
  Save,
  X,
  Trash2,
  User,
  Mail,
  Calendar as CalendarIcon,
  Droplet,
  AlertCircle,
  Activity,
  FileText,
  Pill,
  Stethoscope,
  ChevronRight,
} from "lucide-react";

const PatientRecords = () => {
  const dispatch = useDispatch();
  const { patientRecords, loadingRecords, errorRecords } = useSelector(
    (state) => state.appointments,
  );
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    dispatch(fetchPatientRecords());
  }, [dispatch]);

  const uniquePatients = Array.from(
    new Map(patientRecords.map((p) => [p.patient_id, p])).values(),
  );

  const handlePatientClick = (patient) => {
    setSelectedPatient(
      patient.patient_id === selectedPatient?.patient_id ? null : patient,
    );
    setEditingPatient(null);
    setEditingRecord(null);
  };

  const handlePatientEdit = (e, patient) => {
    e.stopPropagation();
    setEditingPatient({ ...patient });
  };

  const handlePatientSave = async (e) => {
    e.stopPropagation();
    await dispatch(
      updatePatientInfo({
        patientId: editingPatient.patient_id,
        updates: {
          blood_type: editingPatient.blood_type || null,
          haveallergy: editingPatient.haveallergy || null,
          chronic_diseases: editingPatient.chronic_diseases || null,
        },
      }),
    );
    setEditingPatient(null);
    dispatch(fetchPatientRecords());
  };

  const handlePatientInputChange = (e) => {
    e.stopPropagation();
    setEditingPatient({ ...editingPatient, [e.target.name]: e.target.value });
  };

  const handleRecordEdit = (record) => {
    setEditingRecord({ ...record });
  };

  const handleRecordSave = async () => {
    await dispatch(
      updateHealthcareRecord({
        recordId: editingRecord.record_id,
        updates: {
          diagnosis: editingRecord.diagnosis,
          drugs: editingRecord.drugs,
          treatment_plan: editingRecord.treatment_plan,
        },
      }),
    );
    setEditingRecord(null);
    dispatch(fetchPatientRecords());
  };

  const handleRecordDelete = async (recordId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this medical record? This action cannot be undone.",
      )
    ) {
      await dispatch(deleteHealthcareRecord(recordId));
      dispatch(fetchPatientRecords());
    }
  };

  const handleRecordInputChange = (e) => {
    setEditingRecord({ ...editingRecord, [e.target.name]: e.target.value });
  };

  if (loadingRecords)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2dd4bf]"></div>
      </div>
    );
  if (errorRecords)
    return (
      <div className="text-center bg-red-50 text-red-500 p-6 rounded-2xl m-8 font-medium">
        {errorRecords}
      </div>
    );

  return (
    <div className="p-4 md:p-8 font-sans h-full animate-[fadeIn_0.4s_ease-in-out]">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-[#0f4c5c]">
          Patient Directory & Records
        </h1>
        <p className="text-slate-500 mt-1">
          Manage patient information and medical histories efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)]">
        {/* 📋 Left Column: Patients List */}
        <div className="lg:col-span-4 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="bg-[#0f4c5c] text-white p-5">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <User size={20} className="text-[#2dd4bf]" />
              My Patients{" "}
              <span className="bg-white/20 text-xs py-0.5 px-2 rounded-full ml-auto">
                {uniquePatients.length}
              </span>
            </h2>
          </div>

          <div className="overflow-y-auto flex-1 custom-scrollbar p-3 space-y-3">
            {uniquePatients.map((patient) => {
              const isSelected =
                selectedPatient?.patient_id === patient.patient_id;
              const isEditing =
                editingPatient?.patient_id === patient.patient_id;

              return (
                <div
                  key={patient.patient_id}
                  onClick={() => handlePatientClick(patient)}
                  className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? "bg-[#0f4c5c] text-white border-[#0f4c5c] shadow-lg shadow-[#0f4c5c]/20 scale-[1.02]"
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isSelected ? "bg-[#2dd4bf] text-[#0f4c5c]" : "bg-teal-100 text-[#0f4c5c]"}`}
                      >
                        {patient.username
                          ? patient.username.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div>
                        <h3 className="font-bold text-base leading-tight">
                          {patient.username || "Unknown Name"}
                        </h3>
                        <p
                          className={`text-xs flex items-center gap-1 mt-0.5 ${isSelected ? "text-teal-100" : "text-slate-500"}`}
                        >
                          <Mail size={12} /> {patient.email || "No email"}
                        </p>
                      </div>
                    </div>
                    {isSelected && !isEditing && (
                      <ChevronRight size={20} className="text-[#2dd4bf]" />
                    )}
                  </div>

                  {isEditing ? (
                    <div
                      className="mt-4 space-y-3 bg-white/10 p-3 rounded-xl border border-white/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                        <label className="text-xs font-medium text-teal-100 mb-1 block">
                          Blood Type
                        </label>
                        <input
                          name="blood_type"
                          value={editingPatient.blood_type || ""}
                          onChange={handlePatientInputChange}
                          className="w-full p-2 bg-white text-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-[#2dd4bf] outline-none"
                          placeholder="e.g. A+"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-teal-100 mb-1 block">
                          Allergies
                        </label>
                        <input
                          name="haveallergy"
                          value={editingPatient.haveallergy || ""}
                          onChange={handlePatientInputChange}
                          className="w-full p-2 bg-white text-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-[#2dd4bf] outline-none"
                          placeholder="e.g. Penicillin"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-teal-100 mb-1 block">
                          Chronic Diseases
                        </label>
                        <input
                          name="chronic_diseases"
                          value={editingPatient.chronic_diseases || ""}
                          onChange={handlePatientInputChange}
                          className="w-full p-2 bg-white text-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-[#2dd4bf] outline-none"
                          placeholder="e.g. Diabetes"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handlePatientSave}
                          className="flex-1 bg-[#2dd4bf] text-[#0f4c5c] py-1.5 rounded-lg text-sm font-bold hover:bg-teal-300 flex items-center justify-center gap-1"
                        >
                          <Save size={14} /> Save
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPatient(null);
                          }}
                          className="flex-1 bg-white/20 text-white py-1.5 rounded-lg text-sm font-bold hover:bg-white/30 flex items-center justify-center gap-1"
                        >
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`grid grid-cols-2 gap-y-2 gap-x-4 mt-3 pt-3 border-t ${isSelected ? "border-white/20" : "border-slate-200"}`}
                    >
                      <div className="flex flex-col">
                        <span
                          className={`text-[10px] uppercase tracking-wider font-bold ${isSelected ? "text-teal-200" : "text-slate-400"}`}
                        >
                          DOB
                        </span>
                        <span className="text-xs font-medium flex items-center gap-1">
                          <CalendarIcon
                            size={12}
                            className={
                              isSelected ? "text-teal-100" : "text-slate-400"
                            }
                          />{" "}
                          {patient.dob
                            ? new Date(patient.dob).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-[10px] uppercase tracking-wider font-bold ${isSelected ? "text-teal-200" : "text-slate-400"}`}
                        >
                          Blood
                        </span>
                        <span className="text-xs font-medium flex items-center gap-1">
                          <Droplet
                            size={12}
                            className={
                              isSelected ? "text-red-300" : "text-red-400"
                            }
                          />{" "}
                          {patient.blood_type || "N/A"}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <span className="text-xs font-medium flex items-start gap-1">
                              <AlertCircle
                                size={14}
                                className={`shrink-0 mt-0.5 ${isSelected ? "text-amber-200" : "text-amber-500"}`}
                              />
                              <span className="truncate w-40">
                                {patient.haveallergy || "No Allergies"}
                              </span>
                            </span>
                            <span className="text-xs font-medium flex items-start gap-1">
                              <Activity
                                size={14}
                                className={`shrink-0 mt-0.5 ${isSelected ? "text-teal-200" : "text-[#2dd4bf]"}`}
                              />
                              <span className="truncate w-40">
                                {patient.chronic_diseases ||
                                  "No Chronic Diseases"}
                              </span>
                            </span>
                          </div>
                          <button
                            onClick={(e) => handlePatientEdit(e, patient)}
                            className={`p-1.5 rounded-lg transition-colors ${isSelected ? "bg-white/10 hover:bg-white/20 text-white" : "bg-slate-100 hover:bg-slate-200 text-[#0f4c5c]"}`}
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 🏥 Right Column: Medical Records History */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          {selectedPatient ? (
            <>
              <div className="bg-[#f8fafc] border-b border-slate-100 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-[#0f4c5c] flex items-center gap-2">
                    <FileText size={24} className="text-[#2dd4bf]" />
                    Medical History
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Records for{" "}
                    <strong className="text-[#0f4c5c]">
                      {selectedPatient.username}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="space-y-6">
                  {patientRecords
                    .filter(
                      (r) =>
                        r.patient_id === selectedPatient.patient_id &&
                        r.record_id !== null,
                    )
                    .map((record) => (
                      <div
                        key={record.record_id}
                        className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-teal-100"
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-[-5px] top-2 w-3 h-3 rounded-full bg-[#2dd4bf] ring-4 ring-white"></div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                          {editingRecord?.record_id === record.record_id ? (
                            <div className="space-y-4 animate-[fadeIn_0.2s_ease-in-out]">
                              <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                                  Diagnosis
                                </label>
                                <input
                                  name="diagnosis"
                                  value={editingRecord.diagnosis || ""}
                                  onChange={handleRecordInputChange}
                                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] outline-none"
                                  placeholder="Enter diagnosis"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                                  Medications
                                </label>
                                <input
                                  name="drugs"
                                  value={editingRecord.drugs || ""}
                                  onChange={handleRecordInputChange}
                                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] outline-none"
                                  placeholder="Enter prescribed drugs"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                                  Treatment Plan
                                </label>
                                <textarea
                                  name="treatment_plan"
                                  value={editingRecord.treatment_plan || ""}
                                  onChange={handleRecordInputChange}
                                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2dd4bf] outline-none resize-none h-24"
                                  placeholder="Detailed treatment plan"
                                />
                              </div>
                              <div className="flex gap-3 justify-end pt-2">
                                <button
                                  onClick={() => setEditingRecord(null)}
                                  className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 flex items-center gap-2"
                                >
                                  <X size={16} /> Cancel
                                </button>
                                <button
                                  onClick={handleRecordSave}
                                  className="px-5 py-2.5 bg-[#0f4c5c] text-white font-bold rounded-xl hover:bg-[#165a6c] flex items-center gap-2 shadow-md"
                                >
                                  <Save size={16} /> Save Record
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <div className="bg-teal-50 text-[#0f4c5c] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2">
                                  <CalendarIcon
                                    size={14}
                                    className="text-[#2dd4bf]"
                                  />
                                  {record.created_at
                                    ? new Date(
                                        record.created_at,
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })
                                    : "Unknown Date"}
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                                  <button
                                    onClick={() => handleRecordEdit(record)}
                                    className="p-2 text-slate-400 hover:text-[#0f4c5c] hover:bg-slate-100 rounded-lg transition-colors"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleRecordDelete(record.record_id)
                                    }
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <Stethoscope size={14} /> Diagnosis
                                  </h4>
                                  <p className="text-[#0f4c5c] font-medium">
                                    {record.diagnosis ||
                                      "No diagnosis recorded"}
                                  </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                      <Pill size={14} /> Medications
                                    </h4>
                                    <p className="text-slate-700 text-sm">
                                      {record.drugs || "None prescribed"}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                      <Activity size={14} /> Treatment Plan
                                    </h4>
                                    <p className="text-slate-700 text-sm">
                                      {record.treatment_plan ||
                                        "No specific plan"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                  {patientRecords.filter(
                    (r) =>
                      r.patient_id === selectedPatient.patient_id &&
                      r.record_id !== null,
                  ).length === 0 && (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <FileText
                        size={48}
                        className="mx-auto text-slate-300 mb-3"
                      />
                      <p className="text-slate-500 font-medium">
                        No medical records found for this patient.
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        Records added from the Appointments page will appear
                        here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 p-6 text-center">
              <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-slate-100">
                <User size={40} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-[#0f4c5c] mb-2">
                Select a Patient
              </h3>
              <p className="text-slate-500 max-w-sm">
                Choose a patient from the directory on the left to view their
                detailed medical history and personal information.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #2dd4bf; }
      `}</style>
    </div>
  );
};

export default PatientRecords;
