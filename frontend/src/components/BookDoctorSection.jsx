import { useState } from "react";
import { Stethoscope, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import DoctorRegistrationModal from "./DoctorRegistrationModal";
import bg from "../assets/Untitled design.png";

const BookDoctorSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{
          y: -10,
          boxShadow: "0 25px 50px -12px rgba(4, 51, 58, 0.4)",
        }}
        className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[420px] group font-serif border border-white/20"
      >
        {/* Background Image */}
        <motion.img
          initial={{ scale: 1.2 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={bg}
          alt="Join as Doctor"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04333a] via-[#04333a]/80 to-transparent transition-opacity duration-500 group-hover:opacity-95" />

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col justify-end items-start p-10 text-white">
          {/* Floating Glassmorphism Icon (Delayed animation so they don't bounce together) */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-6 shadow-[0_0_15px_rgba(88,230,252,0.3)]"
          >
            <Stethoscope className="w-8 h-8 text-[#58e6fc]" />
          </motion.div>

          <h3 className="text-3xl lg:text-4xl font-extrabold mb-1 transform transition-transform duration-500 group-hover:-translate-y-2">
            Ready to be Part of
          </h3>
          <h3 className="text-3xl lg:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#58e6fc] to-[#c4f7ff] transform transition-transform duration-500 group-hover:-translate-y-2 delay-75">
            MidLink?
          </h3>

          <p className="text-gray-300 text-base mb-8 max-w-sm transform transition-transform duration-500 group-hover:-translate-y-2 delay-100 opacity-90 group-hover:opacity-100">
            Join our verified network of doctors. Reach thousands of patients
            across Jordan and manage your clinic smartly.
          </p>

          {/* Modern White Button */}
          <div className="w-full sm:w-auto transform transition-transform duration-500 group-hover:-translate-y-2 delay-150">
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-white text-[#04333a] px-8 py-4 rounded-full text-lg font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:bg-[#e6f0f5] transition-all flex items-center justify-center gap-3"
            >
              Join as Doctor{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <DoctorRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default BookDoctorSection;
