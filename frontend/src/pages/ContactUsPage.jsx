import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  ShieldAlert,
  Sparkles,
  Headset,
  Globe,
  Clock,
} from "lucide-react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { sendMessage, resetMessageState } from "../store/messageSlice";
import post from "../assets/Blue Doodle Project Presentation.jpg";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.message);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendMessage(formData));
  };

  useEffect(() => {
    if (success) {
      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Thank you for contacting MidLink. Our support team will get back to you soon!",
        confirmButtonColor: "#0a7a8c",
        customClass: {
          popup: "rounded-[2rem] shadow-2xl border border-gray-100",
        },
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
      dispatch(resetMessageState());
    } else if (error) {
      Swal.fire({
        icon: "error",
        title: "Delivery Failed",
        text: error,
        confirmButtonColor: "#e3342f",
      });
      dispatch(resetMessageState());
    }
  }, [success, error, dispatch]);

  const contactInfo = [
    {
      icon: <Globe className="text-[#0a7a8c]" size={24} />,
      title: "Tech Headquarters",
      content: "Amman, Jordan",
      desc: "MidLink Platform Management & Operations.",
    },
    {
      icon: <Mail className="text-[#2dd4bf]" size={24} />,
      title: "Support Email",
      content: "midlink81@gmail.com",
      desc: "For doctors and patient technical inquiries.",
    },
    {
      icon: <Phone className="text-[#2dd4bf]" size={24} />,
      title: "Platform Hotline",
      content: "+962 6 123 4567",
      desc: "Available for urgent platform technical issues.",
    },
    {
      icon: <Clock className="text-amber-500" size={24} />,
      title: "Platform Availability",
      content: "24/7 Operations",
      desc: "Our hybrid healthcare system never sleeps.",
    },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      <Navbar />

      {/* 🌊 Modern Animated Header */}
      <div className="relative pt-40 pb-32 px-6 text-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${post})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#04333a]/90 via-[#04333a]/80 to-[#f8fafc]" />
        </div>

        {/* Abstract Glow Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#58e6fc] rounded-full blur-[120px] opacity-20 z-0 -mt-20 -mr-20" />

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <span className="bg-white/10 backdrop-blur-md text-[#58e6fc] px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6 inline-flex items-center gap-2 border border-white/20 shadow-lg">
            <Headset size={14} /> Support Center
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none font-serif">
            Get In{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58e6fc] to-[#c4f7ff]">
              Touch.
            </span>
          </h1>
          <p className="text-[#c4f7ff] text-xl font-medium opacity-90 max-w-2xl mx-auto font-serif leading-relaxed">
            Whether you are a doctor looking to join our digital ecosystem, or a
            patient needing platform assistance, the MidLink team is always here
            to support you.
          </p>
        </motion.div>
      </div>

      <main className="container mx-auto px-6 max-w-6xl -mt-20 relative z-20 pb-32">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Side: Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/3 space-y-6"
          >
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 flex items-start gap-5 hover:border-[#2dd4bf]/30 transition-all group hover:shadow-2xl"
              >
                <div className="bg-[#e6f0f5] w-14 h-14 rounded-2xl flex items-center justify-center p-3 shadow-inner group-hover:scale-110 group-hover:bg-[#0a7a8c] group-hover:text-white transition-all duration-300">
                  {info.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    {info.title}
                  </p>
                  <h4 className="text-lg font-black text-[#04333a] mb-1">
                    {info.content}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {info.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* 🚨 Emergency Pulse Card */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldAlert size={120} />
              </div>
              <div className="flex items-center gap-3 mb-4 font-black text-xl uppercase tracking-tight relative z-10">
                <ShieldAlert className="animate-bounce text-red-200" /> Medical
                Emergency?
              </div>
              <p className="text-red-100 mb-6 font-medium text-sm leading-relaxed relative z-10">
                MidLink is a booking and consultation platform. If you are in a
                life-threatening situation, please contact your local emergency
                services immediately.
              </p>
              <button className="w-full bg-white text-red-700 py-4 rounded-xl font-black text-2xl shadow-xl hover:bg-red-50 transition-colors tracking-tighter relative z-10">
                CALL 911
              </button>
            </div>
          </motion.div>

          {/* Right Side: Support Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-2/3"
          >
            <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden h-full">
              {/* Decorative Side Line */}
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#2dd4bf] to-[#0a7a8c]" />

              <h3 className="text-3xl md:text-4xl font-black text-[#04333a] mb-10 flex items-center gap-4 tracking-tight font-serif">
                Send a Support Ticket
              </h3>

              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label
                      htmlFor="name"
                      className="text-xs font-black text-[#0a7a8c] uppercase tracking-widest ml-1 flex items-center gap-2"
                    >
                      <Sparkles size={12} /> Full Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#58e6fc]/20 focus:border-[#0a7a8c] outline-none transition-all font-bold text-[#04333a] placeholder-gray-400"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-3">
                    <label
                      htmlFor="email"
                      className="text-xs font-black text-[#0a7a8c] uppercase tracking-widest ml-1 flex items-center gap-2"
                    >
                      <Sparkles size={12} /> Email Address{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#58e6fc]/20 focus:border-[#0a7a8c] outline-none transition-all font-bold text-[#04333a] placeholder-gray-400"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="phone"
                    className="text-xs font-black text-[#0a7a8c] uppercase tracking-widest ml-1 flex items-center gap-2"
                  >
                    <Phone size={12} /> Phone Number{" "}
                    <span className="text-gray-400 normal-case tracking-normal font-medium">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#58e6fc]/20 focus:border-[#0a7a8c] outline-none transition-all font-bold text-[#04333a] placeholder-gray-400"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="message"
                    className="text-xs font-black text-[#0a7a8c] uppercase tracking-widest ml-1 flex items-center gap-2"
                  >
                    <Sparkles size={12} /> How can we help?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-[#58e6fc]/20 focus:border-[#0a7a8c] outline-none transition-all resize-none font-medium text-[#04333a] placeholder-gray-400 leading-relaxed"
                    placeholder="Describe your inquiry or issue here..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px -10px rgba(4, 51, 58, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#04333a] to-[#0a7a8c] text-white py-5 rounded-[2rem] font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    <Send
                      size={20}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  )}
                  {loading ? "Sending..." : "Submit Request"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUsPage;
