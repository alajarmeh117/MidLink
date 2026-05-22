import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Search,
  UserPlus,
  Stethoscope,
  Mail,
  ShieldCheck,
  ShieldAlert,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileText, // 🔥 استدعينا أيقونة الملف للـ CV
} from "lucide-react";
import Sidebar from "./sidebar";
import AddDoctor from "./AddDoctor";

const StaffManagementPage = () => {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [showAddDoctorPopup, setShowAddDoctorPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [staffPerPage] = useState(6);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(
        "https://midlink-of4r.onrender.com/api/admin/staff",
      );
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const specialties = [
    "All",
    ...new Set(staff.map((m) => m.specialty).filter(Boolean)),
  ];

  const handleApproval = async (staffId, isApproved) => {
    const action = isApproved ? "Verify" : "Revoke Verification for";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} this doctor? Access levels will be updated.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isApproved ? "#2dd4bf" : "#f43f5e",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Yes, ${isApproved ? "Verify" : "Revoke"}!`,
      cancelButtonText: "Cancel",
      background: "#fff",
      borderRadius: "20px",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(
        `https://midlink-of4r.onrender.com/api/admin/staff/${staffId}/approve`,
        { isApproved },
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Status updated successfully.`,
        confirmButtonColor: "#0f4c5c",
      });
      setStaff(
        staff.map((member) =>
          member.staff_id === staffId
            ? { ...member, is_approved: isApproved }
            : member,
        ),
      );
    } catch (error) {
      console.error("Error updating doctor verification:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status.",
      });
    }
  };

  const handleAddDoctor = (newDoctorData) => {
    setStaff((prevStaff) => [newDoctorData, ...prevStaff]);
    setShowAddDoctorPopup(false);
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch = member.staff_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      specialtyFilter === "All" || member.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);

  const getDefaultAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f4c5c&color=fff&size=128&bold=true`;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 min-w-0 p-6 md:p-10 overflow-y-auto animate-[fadeIn_0.4s_ease-in-out]">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* 🔍 Header & Actions */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col xl:flex-row justify-between items-center gap-6">
            <div className="text-center xl:text-left">
              <h1 className="text-3xl font-serif font-bold text-[#0f4c5c]">
                Doctor Verification
              </h1>
              <p className="text-slate-500 mt-1">
                Manage credentials and platform access for medical staff.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-4">
              <div className="relative flex-1 sm:min-w-[300px]">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#2dd4bf] outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <button
                onClick={() => setShowAddDoctorPopup(true)}
                className="bg-[#0f4c5c] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#165a6c] transition-all shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
              >
                <UserPlus size={20} /> Add New Doctor
              </button>
            </div>
          </div>

          {/* 🎯 Specialty Pills Filter */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
            <div className="bg-[#0f4c5c] text-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Filter size={18} />
            </div>
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => {
                  setSpecialtyFilter(specialty);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border shrink-0 ${
                  specialtyFilter === specialty
                    ? "bg-[#2dd4bf] text-[#0f4c5c] border-[#2dd4bf] shadow-md"
                    : "bg-white text-slate-500 border-slate-200 hover:border-[#2dd4bf] hover:text-[#0f4c5c]"
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>

          {/* 👨‍⚕️ Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentStaff.length > 0 ? (
              currentStaff.map((member) => {
                const imageSrc =
                  member.profile_image && member.profile_image !== "null"
                    ? `https://midlink-of4r.onrender.com/${member.profile_image}`
                    : getDefaultAvatar(member.staff_name);

                return (
                  <div
                    key={member.staff_id}
                    className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden flex flex-col"
                  >
                    {/* Status Indicator Bar */}
                    <div
                      className={`absolute top-0 left-0 w-full h-1.5 ${member.is_approved ? "bg-[#2dd4bf]" : "bg-amber-400"}`}
                    ></div>

                    <div className="flex items-start gap-5 flex-1">
                      <div className="relative shrink-0">
                        <img
                          src={imageSrc}
                          alt={member.staff_name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getDefaultAvatar(member.staff_name);
                          }}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-50 bg-slate-100 shadow-sm"
                        />
                        <div
                          className={`absolute -bottom-2 -right-2 p-1.5 rounded-lg shadow-md ${member.is_approved ? "bg-teal-500 text-white" : "bg-amber-500 text-white"}`}
                        >
                          {member.is_approved ? (
                            <ShieldCheck size={14} />
                          ) : (
                            <ShieldAlert size={14} />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 mt-1">
                        <h3 className="font-serif font-bold text-[#0f4c5c] text-lg truncate">
                          {member.staff_name}
                        </h3>
                        <p className="text-[#2dd4bf] text-sm font-bold flex items-center gap-1 mt-0.5">
                          <Stethoscope size={14} /> {member.specialty}
                        </p>
                        <p className="text-slate-400 text-xs mt-2 flex items-center gap-1 truncate">
                          <Mail size={12} /> {member.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Status
                        </span>
                        <span
                          className={`text-xs font-bold ${member.is_approved ? "text-teal-600" : "text-amber-500"}`}
                        >
                          {member.is_approved
                            ? "Verified Account"
                            : "Pending Approval"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* 🔥 كبسة عرض السيرة الذاتية (بتظهر بس إذا في CV) */}
                        {member.cv && member.cv !== "null" && (
                          <a
                            href={`https://midlink-of4r.onrender.com/${member.cv}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl text-xs font-bold transition-all bg-[#e6f0f5] text-[#0f4c5c] hover:bg-[#2dd4bf] flex items-center gap-1"
                            title="View Doctor's CV"
                          >
                            <FileText size={14} /> CV
                          </a>
                        )}

                        <button
                          onClick={() =>
                            handleApproval(member.staff_id, !member.is_approved)
                          }
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            member.is_approved
                              ? "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"
                              : "bg-[#0f4c5c] text-white hover:bg-[#2dd4bf] hover:text-[#0f4c5c]"
                          }`}
                        >
                          {member.is_approved
                            ? "Revoke Access"
                            : "Verify Doctor"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                <Stethoscope
                  size={48}
                  className="mx-auto text-slate-300 mb-4"
                />
                <p className="text-slate-500 font-medium">
                  No doctors found matching your criteria.
                </p>
              </div>
            )}
          </div>

          {/* 🔢 Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-[#0f4c5c] disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
                      currentPage === i + 1
                        ? "bg-[#0f4c5c] text-white shadow-lg"
                        : "bg-white text-slate-400 border border-slate-200 hover:border-[#2dd4bf]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-[#0f4c5c] disabled:opacity-30 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🚀 Modern Add Doctor Modal */}
      {showAddDoctorPopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-[fadeIn_0.2s_ease-in-out]">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
            <button
              onClick={() => setShowAddDoctorPopup(false)}
              className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
              <AddDoctor onAddDoctor={handleAddDoctor} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #2dd4bf; }
      `}</style>
    </div>
  );
};

export default StaffManagementPage;
