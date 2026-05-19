import { motion } from "framer-motion";
import {
  Heart,
  Zap,
  Smile,
  Users,
  Shield,
  Clock,
  Video,
  Sparkles,
  Target,
  Award,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import bg from "../assets/Untitled design.png";

const AboutPage = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-[#58e6fc]" />,
      title: "Verified Experts",
      desc: "Every doctor is strictly verified by the JMA for your safety.",
    },
    {
      icon: <Video className="h-8 w-8 text-[#a855f7]" />,
      title: "Telemedicine",
      desc: "High-definition secure video calls from the comfort of your home.",
    },
    {
      icon: <Zap className="h-8 w-8 text-[#facc15]" />,
      title: "AI Diagnosis",
      desc: "Instant AI-powered specialty guidance based on your symptoms.",
    },
    {
      icon: <Heart className="h-8 w-8 text-[#f43f5e]" />,
      title: "Seamless Care",
      desc: "Integrated health records and prescriptions at your fingertips.",
    },
    {
      icon: <Clock className="h-8 w-8 text-[#22c55e]" />,
      title: "Smart Queues",
      desc: "Automatic waiting list alerts for your preferred time slots.",
    },
    {
      icon: <Users className="h-8 w-8 text-[#6366f1]" />,
      title: "Patient First",
      desc: "Dedicated support team available 24/7 to assist your journey.",
    },
  ];

  return (
    <div className="bg-[#f8fafc] font-sans overflow-hidden">
      <Navbar />

      {/* 🚀 Hero Section with Parallax Effect */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={bg}
            alt="Healthcare Background"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#04333a]/90 via-[#04333a]/70 to-[#f8fafc]" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-[#58e6fc] px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-6 inline-block">
              Since 2024 • Jordan's Pride
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Revolutionizing <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58e6fc] to-[#c4f7ff]">
                Digital Health.
              </span>
            </h1>
            <p className="text-xl text-[#c4f7ff] max-w-2xl mx-auto font-medium opacity-90 leading-relaxed font-serif">
              MidLink isn't just a platform; it's a movement to ensure every
              Jordanian has instant access to world-class medical expertise.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-6 -mt-20 relative z-20 pb-24">
        {/* 🎯 Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <div className="bg-[#e6f0f5] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Target className="text-[#04333a] w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-[#04333a] mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 font-serif">
                To eliminate the barriers between patients and doctors by
                creating a seamless, transparent, and tech-driven healthcare
                ecosystem that serves the entire kingdom.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#0a7a8c] font-bold">
              <Sparkles size={20} /> Leading Jordan's Vision 2030
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            className="bg-gradient-to-br from-[#04333a] to-[#0a7a8c] p-10 rounded-[2.5rem] shadow-2xl text-white"
          >
            <div className="bg-white/10 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Award className="text-[#58e6fc] w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold mb-6">Our Values</h2>
            <div className="space-y-6">
              {[
                {
                  icon: <Heart />,
                  t: "Compassion",
                  d: "We treat every patient like family.",
                },
                {
                  icon: <Zap />,
                  t: "Innovation",
                  d: "Pushing the boundaries of Med-Tech.",
                },
                {
                  icon: <Smile />,
                  t: "Trust",
                  d: "Integrity in every diagnosis.",
                },
              ].map((v, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1 text-[#58e6fc]">{v.icon}</div>
                  <div>
                    <h4 className="font-bold text-xl">{v.t}</h4>
                    <p className="text-[#c4f7ff] opacity-80">{v.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 🌟 The "Why Choose Us" Grid */}
        <section className="text-center mb-24">
          <h3 className="text-4xl font-extrabold text-[#04333a] mb-4">
            Why Choose MidLink?
          </h3>
          <p className="text-gray-500 text-lg mb-12 font-serif">
            A comprehensive suite of medical tools designed for you.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: "#fdfdfd" }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50 text-center"
              >
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  {f.icon}
                </div>
                <h4 className="text-xl font-extrabold text-[#04333a] mb-3">
                  {f.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;

/*
// import React from 'react'; 
import { Heart, Zap, Smile, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bg from '../assets/Untitled design.png'
const AboutPage = () => {
  return (
    <><Navbar/>
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      
      <section
        className="bg-cover bg-center text-white py-48"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          // backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto text-center bg-[#a19a9a] bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-4xl font-bold mb-4">About Our Hospital</h2>
          <p className="text-xl">Providing Exceptional Care with Cutting-Edge Technology</p>
        </div>
      </section>

      <main className="container mx-auto mt-8 p-4">  
        <div className="grid md:grid-cols-2 gap-8">  
          <div className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition duration-300">
            <h2 className="text-3xl font-semibold text-#04333a mb-6">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              At our Hospital Management System, we are dedicated to revolutionizing healthcare delivery through innovative technology and compassionate care. Our mission is to empower healthcare providers with state-of-the-art tools that enhance patient care, streamline operations, and improve overall health outcomes.
            </p>
            <p className="text-gray-700 mb-4">
              We believe in a future where technology and human expertise work hand in hand to provide the best possible care for every patient. Our system is designed to support medical professionals in their daily tasks, allowing them to focus more on what truly matters - the well-being of their patients.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-semibold text-#04333a mb-6">Our Values</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-500 mr-3" />
                <div>
                  <h4 className="font-semibold text-lg">Compassion</h4>
                  <p className="text-gray-600">We put heart into everything we do</p>
                </div>
              </div>
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <h4 className="font-semibold text-lg">Innovation</h4>
                  <p className="text-gray-600">Constantly improving and evolving</p>
                </div>
              </div>
              <div className="flex items-center">
                <Smile className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <h4 className="font-semibold text-lg">Patient-Centric</h4>
                  <p className="text-gray-600">Your health and happiness is our priority</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <h4 className="font-semibold text-lg">Collaboration</h4>
                  <p className="text-gray-600">Working together for better healthcare</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12 bg-[#e6f0f5] rounded-lg p-8 shadow-inner">
          <h3 className="text-2xl font-semibold text-#04333a mb-4">Our Commitment to Excellence</h3>
          <p className="text-gray-700 mb-4">
            We are committed to maintaining the highest standards of quality and safety in healthcare management. Our system undergoes rigorous testing and continuous improvement to ensure it meets the evolving needs of healthcare providers and patients alike.
          </p>
          <p className="text-gray-700">
            By choosing our Hospital Management System, you're not just getting a software solution - you're partnering with a team dedicated to transforming healthcare for the better.
          </p>
        </section>
      </main>
    </div>
    <Footer/>
    </>
  );
};

export default AboutPage;   */

// **************************************************************************************************  //
