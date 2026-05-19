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
  // إعدادات الحركة (الأنيميشن) للظهور عند التمرير
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-[#f6f5f2] min-h-screen overflow-hidden">
      <Navbar />

      {/* الواجهة الرئيسية */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <HeroSection />
      </motion.div>

      {/* قسم البدء والاختيار بين طبيب أو مريض */}
      <motion.section
        id="how-it-works"
        className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#f6f5f2] to-white relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-4 rounded-full bg-[#e6f0f5] text-[#04333a] text-sm font-bold tracking-widest mb-4 uppercase shadow-sm">
              Join MidLink
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#04333a] mb-6 font-serif">
              Get Started with MidLink
            </h2>
            <p className="text-gray-500 font-serif text-lg max-w-2xl mx-auto leading-relaxed">
              Whether you're a patient looking for care or a doctor ready to
              help, MidLink is designed to give you the best experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <BookSection />
            <BookDectorSection />
          </div>
        </div>
      </motion.section>

      {/* 🌟 إضافة المساعد الذكي */}
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

      {/* الخدمات */}
      <motion.div
        id="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
      >
        <OurServices />
      </motion.div>

      {/* الأسئلة الشائعة */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <FAQ />
      </motion.div>

      {/* الفيديوهات */}
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
