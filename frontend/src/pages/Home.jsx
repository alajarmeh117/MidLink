import React from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import OurServices from "../components/OurServices";
import FAQ from "../components/FAQ";
import HospitalVideos from "../components/HospitalVideos";
import BookSection from "../components/BookSection";
import BookDectorSection from "../components/BookDoctorSection";
import AiSymptomChecker from "../components/AiSymptomChecker";

const Home = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-[#f6f5f2] min-h-screen overflow-hidden font-sans">
      <Navbar />

      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <HeroSection />
      </motion.div>

      <motion.section
        id="how-it-works"
        className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#f6f5f2] to-white relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-[#0a7a8c] font-bold tracking-widest uppercase text-sm mb-3 block">
              Get Started
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-[#04333a] mb-6">
              Join the Healthcare Revolution
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              Whether you are a patient looking for reliable care or a doctor
              ready to expand your practice, MidLink is designed to give you the
              ultimate hybrid experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <BookSection />
            <BookDectorSection />
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-16 bg-white relative z-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-6">
          <AiSymptomChecker />
        </div>
      </motion.section>

      <motion.div
        id="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
      >
        <OurServices />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <FAQ />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <HospitalVideos />
      </motion.div>

      <Footer />
    </div>
  );
};

export default Home;
