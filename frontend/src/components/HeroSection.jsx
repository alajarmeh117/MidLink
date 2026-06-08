import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Link } from "react-router-dom";

const HeroSection = () => {
  // حالة التحكم بظهور نافذة الفيديو
  const [showVideo, setShowVideo] = useState(false);

  const images = [
    "https://i.imgur.com/DWvfGPl.png",
    "https://i.imgur.com/IQkSnBK.png",
    "https://i.imgur.com/4onXGUw.png",
    "https://i.imgur.com/u8JxI67.png",
    "https://i.imgur.com/wlvgquI.png",
  ];

  return (
    <section className="relative h-screen overflow-hidden font-serif">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        loop
        className="h-full w-full group"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full overflow-hidden">
              <img
                src={img}
                alt={`Healthcare slide ${index + 1}`}
                className="w-full h-full object-cover scale-105 transition-transform duration-[10000ms] group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#04333a]/80 via-[#04333a]/50 to-transparent"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 z-10 flex flex-col justify-center items-start px-8 md:px-24 max-w-5xl pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pointer-events-auto w-full"
        >
          <span className="bg-[#e6f0f5] text-[#0a7a8c] px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6 inline-block shadow-sm">
            The Future of Healthcare
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
            Your Complete <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2dd4bf] to-[#58e6fc]">
              Healthcare Bridge
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl font-medium leading-relaxed">
            Seamlessly book your medical appointments. Choose between a secure
            HD Video Consultation or navigate easily to an In-Clinic Visit using
            our smart mapping system.
          </p>

          {/* حاوية الأزرار */}
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/doctor">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden group bg-gradient-to-r from-[#2dd4bf] to-[#0a7a8c] text-white px-8 py-4 rounded-2xl text-lg font-black transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(10,122,140,0.4)] uppercase tracking-widest border border-white/20"
              >
                <span className="relative z-10 flex items-center gap-2">
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
                      strokeWidth={2.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Book Appointment
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-[#58e6fc] to-[#075561] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              </motion.button>
            </Link>

            {/* زر الـ Watch Demo الجديد */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVideo(true)}
              className="relative overflow-hidden group bg-[#04333a]/50 backdrop-blur-sm text-white px-8 py-4 rounded-2xl text-lg font-black transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-widest border-2 border-[#2dd4bf] hover:bg-[#2dd4bf] hover:text-[#04333a]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Demo
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* الـ Modal السينمائي لعرض الفيديو */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] backdrop-blur-md p-4 md:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(45,212,191,0.2)] border border-gray-800"
          >
            {/* زر الإغلاق X */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center z-10 transition-colors border border-gray-600"
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

            {/* مشغل الفيديو iframe */}
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/0DwtHX162iE?autoplay=1"
              title="MidLink System Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
