import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowRight, UserRound, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OurDoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(6);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, selectedSpecialty, searchTerm]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(
        "https://midlink-backend.onrender.com/api/doctors",
      );
      const data = await response.json();
      setDoctors(data);
      const uniqueSpecialties = [
        ...new Set(data.map((doctor) => doctor.specialty)),
      ];
      setSpecialties(uniqueSpecialties);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;
    if (selectedSpecialty) {
      filtered = filtered.filter(
        (doctor) => doctor.specialty === selectedSpecialty,
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((doctor) =>
        doctor.staff_name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredDoctors(filtered);
    setCurrentPage(1);
  };

  // Get current doctors
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-[#f8fafc] flex flex-col min-h-screen font-sans">
      <Navbar />

      {/* 🌟 Modern Hero Header */}
      <div className="relative pt-32 pb-24 bg-gradient-to-br from-[#04333a] via-[#0a7a8c] to-[#04333a] overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-[#58e6fc] rounded-full mix-blend-overlay filter blur-[80px] opacity-30"
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-[#58e6fc] text-sm font-bold uppercase tracking-wider mb-4 border border-white/20">
              <Sparkles size={16} /> World-Class Healthcare
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Meet Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58e6fc] to-[#c4f7ff]">
                Specialists
              </span>
            </h1>
            <p className="text-lg text-[#c4f7ff] max-w-2xl mx-auto opacity-90 font-medium">
              Discover experienced doctors across Jordan, read verified reviews,
              and book your appointment instantly.
            </p>
          </motion.div>
        </div>
      </div>

      {/* 🌟 Floating Search & Filter Section */}
      <div className="container mx-auto px-4 -mt-10 relative z-20 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-[2rem] p-4 md:p-6 border border-white flex flex-col md:flex-row gap-4 justify-center items-center max-w-4xl mx-auto"
        >
          {/* Specialty Filter */}
          <div className="relative w-full md:w-1/2 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400 group-focus-within:text-[#0a7a8c] transition-colors" />
            </div>
            <select
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-[#04333a] py-4 pl-12 pr-8 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#58e6fc]/30 focus:border-[#0a7a8c] transition-all font-bold cursor-pointer"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All Specialties</option>
              {specialties.map((specialty, index) => (
                <option key={index} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Search by Name */}
          <div className="relative w-full md:w-1/2 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#0a7a8c] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search doctor by name..."
              className="w-full bg-gray-50 border border-gray-200 text-[#04333a] py-4 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#58e6fc]/30 focus:border-[#0a7a8c] transition-all font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>
      </div>

      {/* 🌟 Doctor Cards Grid */}
      <div className="flex-grow pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {currentDoctors.length > 0 ? (
                currentDoctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.staff_id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 group relative flex flex-col"
                  >
                    {/* Image Container */}
                    <div className="relative h-72 overflow-hidden bg-[#e6f0f5] flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#04333a]/90 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Specialty Badge inside Image */}
                      <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-extrabold text-[#0a7a8c] shadow-sm transform group-hover:scale-105 transition-transform">
                        {doctor.specialty}
                      </div>

                      <img
                        src={
                          doctor.profile_image
                            ? `https://midlink-backend.onrender.com/${doctor.profile_image}`
                            : "https://via.placeholder.com/150"
                        }
                        alt={doctor.staff_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src =
                            "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
                          e.target.className =
                            "w-32 h-32 object-contain opacity-50 group-hover:scale-110 transition-transform duration-700";
                        }}
                      />
                    </div>

                    {/* Content Container */}
                    <div className="p-6 relative z-20 bg-white flex-grow flex flex-col justify-between group-hover:-translate-y-2 transition-transform duration-300 rounded-t-3xl -mt-4">
                      <div>
                        <h2 className="text-2xl font-extrabold text-[#04333a] mb-1 flex items-center gap-2">
                          <UserRound
                            size={20}
                            className="text-[#58e6fc] hidden group-hover:block transition-all"
                          />
                          {doctor.staff_name}
                        </h2>
                        <p className="text-[#0a7a8c] font-bold mb-6 opacity-80">
                          {doctor.specialty} Specialist
                        </p>
                      </div>

                      <Link
                        to={`/doctor/${doctor.staff_id}`}
                        className="w-full flex items-center justify-center gap-2 bg-[#f8fafc] text-[#04333a] hover:bg-gradient-to-r hover:from-[#0a7a8c] hover:to-[#04333a] hover:text-white border border-gray-100 py-3.5 rounded-xl font-bold transition-all duration-300 group/btn shadow-sm hover:shadow-lg"
                      >
                        View Profile{" "}
                        <ArrowRight
                          size={18}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-[#04333a] mb-2">
                      No Doctors Found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search or specialty filter.
                    </p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 🌟 Modern Pagination */}
          {filteredDoctors.length > doctorsPerPage && (
            <div className="mt-16 flex justify-center gap-2">
              {[
                ...Array(
                  Math.ceil(filteredDoctors.length / doctorsPerPage),
                ).keys(),
              ].map((number) => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`w-12 h-12 rounded-full font-bold transition-all duration-300 flex items-center justify-center ${
                    currentPage === number + 1
                      ? "bg-gradient-to-r from-[#04333a] to-[#0a7a8c] text-white shadow-lg shadow-[#04333a]/30 scale-110"
                      : "bg-white text-[#04333a] border border-gray-200 hover:border-[#0a7a8c] hover:text-[#0a7a8c]"
                  }`}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OurDoctorPage;
