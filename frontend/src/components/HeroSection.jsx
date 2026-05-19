import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Link } from "react-router-dom";

const HeroSection = () => {
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
              {/* Background Image with Slow Zoom Effect */}
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: "easeOut" }}
                src={img}
                alt={`Medical slide ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Modern Gradient Overlay (Dark Teal to Transparent) */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#04333a]/95 via-[#04333a]/70 to-black/30" />

              {/* Content Container */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                {/* Floating Glassmorphism Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-6 inline-block px-6 py-2 rounded-full border border-[#58e6fc]/30 bg-white/10 backdrop-blur-md shadow-lg"
                >
                  <span className="text-[#58e6fc] font-bold tracking-widest text-sm uppercase">
                    ✨ Welcome to MidLink
                  </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 font-serif leading-tight drop-shadow-2xl"
                >
                  Your Health,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58e6fc] to-[#c4f7ff]">
                    Our Priority
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-base sm:text-lg md:text-xl text-gray-200 mb-10 max-w-3xl leading-relaxed drop-shadow-md"
                >
                  Connect with verified doctors across Jordan. Book
                  appointments, get consultations online, and manage your health
                  journey — all in one advanced platform.
                </motion.p>

                {/* Interactive Glowing Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.8,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <Link to="/doctor">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 0px 25px rgba(88, 230, 252, 0.5)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="relative overflow-hidden group/btn bg-gradient-to-r from-[#075561] to-[#04333a] border border-[#58e6fc]/50 text-white px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-xl"
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
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Book Appointment
                      </span>
                      {/* Hover effect overlay inside button */}
                      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-[#58e6fc] to-[#075561] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 z-0"></div>
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;
