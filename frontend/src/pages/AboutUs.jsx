import { motion } from "framer-motion";
import {
  HeartPulse,
  Users,
  ShieldCheck,
  Video,
  MapPin,
  Brain,
  Sparkles,
  Target,
  Activity,
  Heart,
  Zap,
  Smile,
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
      icon: <Video className="h-8 w-8 text-[#2dd4bf]" />,
      title: "Online Consultations",
      desc: "High-definition, secure video calls allowing you to consult top specialists from the comfort of your home.",
    },
    {
      icon: <MapPin className="h-8 w-8 text-amber-500" />,
      title: "In-Clinic Navigation",
      desc: "Direct Google Maps integration that guides you seamlessly to your doctor's physical clinic.",
    },
    {
      icon: <Brain className="h-8 w-8 text-[#58e6fc]" />,
      title: "AI Symptom Checker",
      desc: "Intelligent triage system that accurately analyzes your symptoms and recommends the right specialty.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-[#0a7a8c]" />,
      title: "JMA Verified Experts",
      desc: "Every doctor is strictly verified by the Jordan Medical Association to ensure top-tier medical safety.",
    },
  ];

  return (
    <div className="bg-[#f8fafc] font-sans min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      {/* 🌟 Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-br from-[#04333a] via-[#0a7a8c] to-[#0f4c5c]">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#2dd4bf] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#f8fafc] to-transparent"></div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="bg-white/10 border border-white/20 text-[#58e6fc] px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6 inline-flex items-center gap-2 backdrop-blur-sm">
              <Sparkles size={16} /> Welcome to MidLink
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-serif tracking-tight leading-tight">
              Bridging the Gap in <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2dd4bf] to-[#58e6fc]">
                Modern Healthcare
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto font-medium leading-relaxed">
              We are not just a booking platform. MidLink is a complete hybrid
              healthcare ecosystem designed to seamlessly connect patients and
              doctors, online and offline.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 📖 Our Story Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#2dd4bf]/20 to-[#0a7a8c]/20 rounded-[3rem] blur-xl transform -rotate-3"></div>
              <img
                src={bg}
                alt="MidLink Healthcare"
                className="relative rounded-[2.5rem] shadow-2xl border-4 border-white w-full object-cover z-10"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 z-20 flex items-center gap-4">
                <div className="bg-[#e6f0f5] p-4 rounded-2xl">
                  <Activity className="text-[#0a7a8c] w-8 h-8" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#04333a]">100%</p>
                  <p className="text-sm font-bold text-slate-500">
                    Secure Records
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <span className="text-[#0a7a8c] font-bold tracking-widest uppercase text-sm mb-3 block">
                Our Evolution
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#04333a] mb-6 font-serif">
                From a Simple Idea to a <br />
                <span className="text-[#0a7a8c]">Hybrid Ecosystem</span>
              </h2>
              <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                <p>
                  MidLink started with a vision to eliminate the friction in
                  healthcare access. We noticed that patients were either stuck
                  waiting in crowded clinics or limited to basic video calls
                  that lacked physical follow-ups.
                </p>
                <p>
                  That's why we built a <strong>Hybrid Model</strong>. Today,
                  MidLink empowers patients to use our AI Triage to find the
                  right specialty, and then gives them the freedom to choose:
                  consult a top doctor instantly via a secure Video Call, or
                  book an In-Clinic visit and let our Google Maps integration
                  guide them to the door.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <Target className="text-[#2dd4bf] w-8 h-8 mb-3" />
                  <h4 className="font-bold text-[#04333a] mb-1">Our Mission</h4>
                  <p className="text-sm text-slate-500">
                    To make quality healthcare accessible, organized, and
                    boundaryless.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <Users className="text-[#0a7a8c] w-8 h-8 mb-3" />
                  <h4 className="font-bold text-[#04333a] mb-1">Our Vision</h4>
                  <p className="text-sm text-slate-500">
                    To be the unified digital bridge for medical services in
                    Jordan.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🎯 Core Features Grid */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-[#04333a] font-serif mb-4">
              The MidLink Advantage
            </h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">
              We leverage cutting-edge technology to provide a secure, seamless,
              and comprehensive healthcare experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#f8fafc] border border-slate-100 p-8 rounded-[2rem] hover:shadow-xl hover:border-[#2dd4bf]/30 transition-all duration-300 group"
              >
                <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#04333a] mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 💡 Concluding Statement Card (بدون أي أزرار) */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-gradient-to-br from-[#0f4c5c] to-[#04333a] rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl border border-teal-900/50">
            {/* الخلفية المزخرفة */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#2dd4bf] opacity-20 rounded-full blur-3xl pointer-events-none"></div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <HeartPulse className="w-16 h-16 text-[#2dd4bf] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8 font-serif tracking-wide">
                The Future of Healthcare is Here
              </h2>

              {/* صندوق النص الاحترافي كبديل للزر */}
              <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-inner">
                <p className="text-blue-50 text-lg leading-relaxed font-medium">
                  MidLink stands as a testament to innovation in the Jordanian
                  medical sector. By seamlessly intertwining physical clinics
                  with advanced telemedicine, we are setting a new standard for
                  accessibility, security, and patient-centric care.
                </p>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-center items-center gap-6 text-[#2dd4bf] font-bold text-sm uppercase tracking-widest">
                  <span>Secure</span>
                  <span className="w-1.5 h-1.5 bg-[#58e6fc] rounded-full"></span>
                  <span>Hybrid</span>
                  <span className="w-1.5 h-1.5 bg-[#58e6fc] rounded-full"></span>
                  <span>Reliable</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
