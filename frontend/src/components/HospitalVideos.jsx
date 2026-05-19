import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Film } from "lucide-react";

const hospitalVideos = [
  {
    id: 1,
    name: "Hospital Overview",
    description:
      "Experience our state-of-the-art facilities and comprehensive care.",
    videoUrl: "/videos/welcome.mp4",
  },
  {
    id: 2,
    name: "Patient Care Excellence",
    description:
      "Discover our commitment to compassionate, personalized patient care.",
    videoUrl: "/videos/patient-care.mp4",
  },
  {
    id: 3,
    name: "Meet Our Expert Team",
    description:
      "Get to know our world-class medical professionals dedicated to your health.",
    videoUrl: "/videos/meet-doctors.mp4",
  },
];

const HospitalVideos = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="bg-white py-24 px-4 sm:px-6 lg:px-24 font-serif relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-[#04333a]/10 text-[#04333a] text-sm font-bold tracking-widest mb-4 uppercase">
          <Film size={16} /> Virtual Tour
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#04333a] mb-4">
          Discover MidLink{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a7a8c] to-[#58e6fc]">
            in Action
          </span>
        </h2>
      </motion.div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hospitalVideos.map((video, index) => (
          <motion.div
            key={video.id}
            className="group relative rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 bg-black cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            onClick={() => setSelectedVideo(video)}
            whileHover={{
              y: -10,
              boxShadow: "0 25px 50px -12px rgba(4, 51, 58, 0.4)",
            }}
          >
            <video
              src={video.videoUrl}
              className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80"
              muted
              loop
              playsInline
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#04333a] via-[#04333a]/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

            <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-white mb-2">
                {video.name}
              </h3>
              <p className="text-sm text-[#c4f7ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                {video.description}
              </p>
            </div>

            {/* Pulsing Play Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(88,230,252,0.4)",
                    "0 0 0 20px rgba(88,230,252,0)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/40 group-hover:bg-[#58e6fc] group-hover:border-transparent transition-all duration-300"
              >
                <Play className="w-8 h-8 text-white group-hover:text-[#04333a] fill-current ml-1" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            className="fixed inset-0 bg-[#04333a]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-16 right-0 bg-white/10 hover:bg-red-500 rounded-full p-3 transition-colors duration-300 z-10 border border-white/20"
                onClick={() => setSelectedVideo(null)}
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <div className="relative bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(88,230,252,0.2)] border border-white/10">
                <video
                  src={selectedVideo.videoUrl}
                  className="w-full aspect-video object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-center"
              >
                <h3 className="text-3xl font-bold mb-2 text-white">
                  {selectedVideo.name}
                </h3>
                <p className="text-[#c4f7ff] text-lg max-w-2xl mx-auto">
                  {selectedVideo.description}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HospitalVideos;
