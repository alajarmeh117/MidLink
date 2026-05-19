import { motion } from "framer-motion";

const ServicesSection = () => {
  const services = [
    {
      title: "Verified Doctors",
      description:
        "All doctors verified through Jordan Medical Association database",
      image: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
    },
    {
      title: "Video Consultations",
      description:
        "Secure HD video calls with screen sharing and file transfer",
      image: "https://cdn-icons-png.flaticon.com/512/2966/2966488.png",
    },
    {
      title: "AI Symptom Checker",
      description:
        "Intelligent chatbot for initial assessment and specialty recommendations",
      image: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
    },
    {
      title: "Secure Payments",
      description: "Multiple payment options with Stripe integration",
      image: "https://cdn-icons-png.flaticon.com/512/2271/2271083.png",
    },
    {
      title: "Smart Reminders",
      description: "SMS, WhatsApp, and email notifications for appointments",
      image: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",
    },
    {
      title: "Waiting List",
      description:
        "Automatic notification when preferred slots become available",
      image: "https://cdn-icons-png.flaticon.com/512/2693/2693507.png",
    },
  ];

  // إعدادات لظهور الكروت بالتتابع (Stagger Effect)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="features"
      className="py-24 px-6 md:px-12 lg:px-24 bg-white font-serif relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#e6f0f5] rounded-bl-[100px] opacity-50 z-0"></div>

      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
        {/* Left Image with Floating Animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/3 relative"
        >
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#04333a] to-transparent opacity-10 rounded-3xl blur-xl"></div>
            <img
              src="https://i.imgur.com/T7w58X6.png"
              alt="MidLink Doctor"
              className="w-full h-auto object-contain rounded-3xl drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* Right Content */}
        <div className="lg:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#04333a] mb-4">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a7a8c] to-[#58e6fc]">
                MidLink?
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto lg:mx-0">
              Experience healthcare reimagined with our comprehensive suite of
              advanced medical features designed for your comfort and safety.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
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
                className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center transition-all group"
              >
                <div className="w-16 h-16 mb-5 flex items-center justify-center p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                  <motion.img
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    src={service.image}
                    alt={`${service.title} Icon`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h4 className="text-[#04333a] font-bold text-lg mb-2 font-serif">
                  {service.title}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
