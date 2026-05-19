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
} from "lucide-react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { sendMessage, resetMessageState } from "../store/messageSlice";
import post from "../assets/Blue Doodle Project Presentation.jpg"; // تأكد من مسار الصورة

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
        text: "Thank you for contacting MidLink. We'll get back to you soon!",
        confirmButtonColor: "#0a7a8c",
      });
      setFormData({ name: "", email: "", message: "" });
      dispatch(resetMessageState());
    } else if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
        confirmButtonColor: "#d33",
      });
      dispatch(resetMessageState());
    }
  }, [success, error, dispatch]);

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
          <span className="bg-white/10 backdrop-blur-md text-[#58e6fc] px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6 inline-block border border-white/20 shadow-lg">
            Support Center 24/7
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
            Get In{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58e6fc] to-[#c4f7ff]">
              Touch.
            </span>
          </h1>
          <p className="text-[#c4f7ff] text-xl font-medium opacity-90 max-w-2xl mx-auto font-serif italic">
            "Your health concerns don't follow a schedule, and neither do we.
            Reach out to our Jordanian medical support team anytime."
          </p>
        </motion.div>
      </div>

      <main className="container mx-auto px-6 -mt-20 relative z-20 pb-32">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* 📞 Contact Info & Emergency: The Critical Section */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 group transition-all"
            >
              <div className="flex items-center gap-6 mb-10 border-b border-gray-50 pb-8 group-hover:border-[#58e6fc]/30 transition-colors">
                <div className="bg-[#e6f0f5] p-5 rounded-2xl text-[#0a7a8c] shadow-inner transition-transform group-hover:rotate-6 group-hover:bg-[#58e6fc] group-hover:text-white">
                  <Phone />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Direct Line
                  </p>
                  <p className="text-2xl font-black text-[#04333a]">
                    +962 6 123 4567
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 mb-10 border-b border-gray-50 pb-8 group-hover:border-[#58e6fc]/30 transition-colors">
                <div className="bg-[#e6f0f5] p-5 rounded-2xl text-[#0a7a8c] shadow-inner transition-transform group-hover:-rotate-6 group-hover:bg-[#58e6fc] group-hover:text-white">
                  <Mail />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Official Email
                  </p>
                  <p className="text-xl font-black text-[#04333a]">
                    support@midlink.jo
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 group-hover:border-[#58e6fc]/30 transition-colors">
                <div className="bg-[#e6f0f5] p-5 rounded-2xl text-[#0a7a8c] shadow-inner transition-transform group-hover:scale-110 group-hover:bg-[#58e6fc] group-hover:text-white">
                  <MapPin />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Headquarters
                  </p>
                  <p className="text-xl font-black text-[#04333a]">
                    Medical St, Amman
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 🚨 Emergency Pulse Card */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(220,38,38,0.3)",
                  "0 0 0 25px rgba(220,38,38,0)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="bg-gradient-to-br from-red-600 to-red-800 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                <ShieldAlert size={150} />
              </div>
              <div className="flex items-center gap-4 mb-6 font-black text-2xl uppercase tracking-tight relative z-10">
                <ShieldAlert className="animate-bounce" /> Emergency?
              </div>
              <p className="text-red-100 mb-10 font-medium text-lg leading-snug relative z-10">
                If you are in a life-threatening situation, every second counts.
              </p>
              <button className="w-full bg-white text-red-700 py-5 rounded-2xl font-black text-3xl shadow-xl hover:bg-red-50 transition-colors tracking-tighter relative z-10">
                CALL 911 NOW
              </button>
            </motion.div>

            {/* Working Hours Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#04333a] to-[#0a7a8c] p-8 rounded-[2.5rem] shadow-xl text-white"
            >
              <h4 className="font-black text-xl mb-4 tracking-tight text-[#58e6fc]">
                Working Hours
              </h4>
              <div className="space-y-3 font-medium opacity-90">
                <p className="flex justify-between border-b border-white/10 pb-2">
                  <span>Sun - Thu:</span> <span>8:00 AM – 5:00 PM</span>
                </p>
                <p className="flex justify-between pt-1">
                  <span>Fri - Sat:</span>{" "}
                  <span className="text-[#facc15]">Closed</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* 📝 Support Form: Clean & Powerful */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl border border-gray-100 relative overflow-hidden"
            >
              {/* Decorative Side Line */}
              <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-b from-[#58e6fc] to-[#0a7a8c]" />

              <h3 className="text-4xl font-black text-[#04333a] mb-12 flex items-center gap-4 tracking-tight">
                <Headset className="text-[#0a7a8c] w-12 h-12 p-2 bg-[#e6f0f5] rounded-2xl" />
                Send a Support Ticket
              </h3>

              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label
                      htmlFor="name"
                      className="text-xs font-black text-[#0a7a8c] uppercase tracking-widest ml-1 flex items-center gap-2"
                    >
                      <Sparkles size={12} /> Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-[#58e6fc]/20 focus:border-[#0a7a8c] outline-none transition-all font-bold text-[#04333a] placeholder-gray-400 shadow-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-3">
                    <label
                      htmlFor="email"
                      className="text-xs font-black text-[#0a7a8c] uppercase tracking-widest ml-1 flex items-center gap-2"
                    >
                      <Sparkles size={12} /> Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-[#58e6fc]/20 focus:border-[#0a7a8c] outline-none transition-all font-bold text-[#04333a] placeholder-gray-400 shadow-sm"
                      placeholder="john@midlink.jo"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label
                    htmlFor="message"
                    className="text-xs font-black text-[#0a7a8c] uppercase tracking-widest ml-1 flex items-center gap-2"
                  >
                    <Sparkles size={12} /> Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full bg-gray-50 border-2 border-gray-100 p-6 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-[#58e6fc]/20 focus:border-[#0a7a8c] outline-none transition-all resize-none font-medium text-[#04333a] placeholder-gray-400 shadow-sm leading-relaxed"
                    placeholder="How can our medical team help you today?"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px -10px rgba(4, 51, 58, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#04333a] to-[#0a7a8c] text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl flex items-center justify-center gap-4 transition-all uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? "SENDING SECURELY..." : "SEND SECURE TICKET"}
                  {!loading && (
                    <Send
                      size={24}
                      className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform"
                    />
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};


export default ContactUsPage;

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Phone, Mail, MapPin } from 'lucide-react';
// import Swal from 'sweetalert2';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import { sendMessage, resetMessageState } from '../store/messageSlice';
// import post from '../assets/Blue Doodle Project Presentation.jpg'

// const ContactUsPage = () => {
//   const [formData, setFormData] = useState({ name: '', email: '', message: '' });
//   const dispatch = useDispatch();
//   const { loading, success, error } = useSelector((state) => state.message);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(sendMessage(formData));
//   };

//   useEffect(() => {
//     if (success) {
//       Swal.fire({
//         icon: 'success',
//         title: 'Message Sent!',
//         text: "Thank you for your message. We'll get back to you soon!",
//         confirmButtonColor: '#3085d6',
//       });
//       setFormData({ name: '', email: '', message: '' });
//       dispatch(resetMessageState());
//     } else if (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Oops...',
//         text: error,
//         confirmButtonColor: '#d33',
//       });
//       dispatch(resetMessageState());
//     }
//   }, [success, error, dispatch]);

//   return (
//     <>
//       <Navbar />
//       <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
//         <section
//           className="bg-cover bg-center  text-white py-40"
//           style={{
//             backgroundImage: `url(${post})`,          }}
//         >
//           <div className="container mx-auto text-center bg-[#938e8e] bg-opacity-50 p-6 rounded-lg">
//             <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
//             <p className="text-xl">
//               We're here to help and answer any question you might have
//             </p>
//           </div>
//         </section>

//         <main className="container mx-auto mt-8 p-4">
//           <div className="grid md:grid-cols-2 gap-8">
//             <div className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition duration-300">
//               <h2 className="text-3xl font-semibold text-[#05464e] mb-6">
//                 Contact Us
//               </h2>
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="name"
//                     className="block text-gray-700 font-bold mb-2"
//                   >
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#05464e]"
//                     placeholder="Your Name"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="email"
//                     className="block text-gray-700 font-bold mb-2"
//                   >
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#05464e]"
//                     placeholder="Your Email"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="message"
//                     className="block text-gray-700 font-bold mb-2"
//                   >
//                     Message
//                   </label>
//                   <textarea
//                     id="message"
//                     name="message"
//                     value={formData.message}
//                     onChange={handleInputChange}
//                     rows="4"
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#05464e]"
//                     placeholder="Your Message"
//                     required
//                   ></textarea>
//                 </div>
//                 <button
//                   type="submit"
//                   className="bg-[#05464e] text-white px-6 py-3 rounded-md hover:bg-[#adbabb] transition duration-300 transform hover:scale-105"
//                   disabled={loading}
//                 >
//                   {loading ? "Sending..." : "Send Message"}
//                 </button>
//               </form>
//             </div>
//             <div className="bg-white shadow-lg rounded-lg p-6">
//               <h3 className="text-2xl font-semibold text-[#05464e] mb-6">
//                 Contact Information
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex items-center">
//                   <Phone className="h-6 w-6 text-[#05464e] mr-3" />
//                   <span>+1 (123) 456-7890</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Mail className="h-6 w-6 text-[#05464e] mr-3" />
//                   <span>info@hospitalmanagementsystem.com</span>
//                 </div>
//                 <div className="flex items-center">
//                   <MapPin className="h-6 w-6 text-[#05464e] mr-3" />
//                   <span>123 Healthcare Ave, Medical City, HC 12345</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ContactUsPage;

// *******************************************************************************************  //
