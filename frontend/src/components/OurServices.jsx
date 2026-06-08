import { motion } from "framer-motion";

const ServicesSection = () => {
  const services = [
    {
      title: "Hybrid Booking System",
      description:
        "Choose between physical In-Clinic visits or secure Online Video Consultations based on your needs.",
      image: "https://cdn-icons-png.flaticon.com/512/2966/2966488.png",
    },
    {
      title: "Smart Clinic Navigation",
      description:
        "Get instant Google Maps directions directly to your doctor's clinic from your appointment dashboard.",
      image: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    },
    {
      title: "Verified Specialists",
      description:
        "All doctors are strictly verified through the Jordan Medical Association database for your safety.",
      image: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
    },
    {
      title: "AI Symptom Checker",
      description:
        "Intelligent AI triage to assess your symptoms and recommend the exact specialty you need.",
      image: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
    },
    {
      title: "Smart Waiting List",
      description:
        "Get instant notifications when a fully booked doctor has a sudden cancellation slot available.",
      image: "https://cdn-icons-png.flaticon.com/512/1827/1827370.png",
    },
    {
      title: "Secure Health Records",
      description:
        "Your medical history, prescriptions, and diagnosis reports are encrypted and accessible 24/7.",
      image: "https://cdn-icons-png.flaticon.com/512/2271/2271083.png",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-24 bg-white font-sans relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#0a7a8c] font-bold tracking-widest uppercase text-sm mb-3 block">
            Why Choose MidLink
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#04333a] font-serif tracking-tight">
            Comprehensive Care <br className="hidden md:block" />
            <span className="text-[#0a7a8c]">Built for Modern Needs</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow:
                  "0 20px 25px -5px rgba(4, 51, 58, 0.1), 0 10px 10px -5px rgba(4, 51, 58, 0.04)",
              }}
              className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-8 flex flex-col items-center text-center transition-all group"
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                <motion.img
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  src={service.image}
                  alt={`${service.title} Icon`}
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="text-[#04333a] font-black text-xl mb-3">
                {service.title}
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
