import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { FaSearch } from "react-icons/fa";
import Sidebar from "./sidebar";

import AddDoctor from "./AddDoctor";

const StaffManagementPage = () => {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDoctorPopup, setShowAddDoctorPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [staffPerPage] = useState(9);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/staff");
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleApproval = async (staffId, isApproved) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/staff/${staffId}/approve`,
        { isApproved }
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Staff member ${
          isApproved ? "approved" : "disapproved"
        } successfully.`,
      });
      setStaff(
        staff.map((member) =>
          member.staff_id === staffId
            ? { ...member, is_approved: isApproved }
            : member
        )
      );
    } catch (error) {
      console.error("Error updating staff approval:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update staff approval status.",
      });
    }
  };

  const handleAddDoctor = (newDoctorData) => {
    setStaff((prevStaff) => [newDoctorData, ...prevStaff]);
    setShowAddDoctorPopup(false);
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "New doctor added successfully.",
    });
  };

  const filteredStaff = staff.filter((member) =>
    member.staff_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#f6f5f2] to-white">
      <Sidebar />
      <div className="flex-1 p-4 overflow-auto ml-64">
        <div className="mb-4 flex justify-between items-center">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search doctors..."
              className="w-full px-4 py-2 border rounded-md pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <h2 className="text-2xl mr-[6rem] font-bold">Doctors List</h2>
          <button
            onClick={() => setShowAddDoctorPopup(true)}
            className="bg-[#04333a] text-white px-4 py-2 rounded hover:bg-[#2c565c]
"
          >
            Add new doctor
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentStaff.map((member) => (
            <div
              key={member.staff_id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <img
                src={`http://localhost:5000/${member.profile_image}`}
                alt={member.staff_name}
                className="w-full h-56  rounded-md mb-2"
              />
              <h3 className="font-bold text-sm">{member.staff_name}</h3>
              <p className="text-gray-600 text-xs mb-1">{member.email}</p>
              <p className="text-xs text-gray-500 mb-1">{member.specialty}</p>
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs ${
                    member.is_approved ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {member.is_approved ? "Approved" : "Not Approved"}
                </span>
                <button
                  onClick={() =>
                    handleApproval(member.staff_id, !member.is_approved)
                  }
                  className={`${
                    member.is_approved ? "bg-red-500" : "bg-green-500"
                  } text-white px-2 py-1 rounded text-xs`}
                >
                  {member.is_approved ? "Disapprove" : "Approve"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === number
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {number}
            </button>
          ))}
        </div>
        {showAddDoctorPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-3/4 max-w-3xl h-auto max-h-[80vh] overflow-y-auto relative">
            
              <button
              
                onClick={() => setShowAddDoctorPopup(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-bold mb-3"> Add New Doctor</h2>
              <AddDoctor onAddDoctor={handleAddDoctor}  />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffManagementPage;