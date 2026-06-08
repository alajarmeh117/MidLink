import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Shield, Calendar, Video, MapPin } from "lucide-react";

const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book an appointment on MidLink?",
      answer:
        "Simply search for a doctor, choose your preferred consultation type (In-Clinic Visit or Video Call), select a time slot, and complete the secure payment. You'll receive an instant confirmation.",
      icon: Calendar,
    },
    {
      question: "How do I find the doctor's clinic for an In-Clinic visit?",
      answer:
        "MidLink provides a built-in Google Maps integration. Just click the 'Get Directions' button from the doctor's profile or your medical history dashboard, and it will navigate you straight to the clinic.",
      icon: MapPin,
    },
    {
      question: "How does the Online Video consultation work?",
      answer:
        "If you book an Online session, you'll receive a 'Join Call' button in your dashboard. At the scheduled time, click it to join a secure WebRTC video session with screen sharing capabilities.",
      icon: Video,
    },
    {
      question: "Are the doctors on MidLink verified?",
      answer:
        "Yes! All doctors on MidLink are strictly verified through the Jordan Medical Association. We manually review their medical licenses before they are approved to join the platform.",
      icon: Shield,
    },
  ];

  return (
    <section className="py-24 bg-[#f8fafc] font-sans">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-[#0a7a8c] font-bold tracking-widest uppercase text-sm mb-3 block">
            Got Questions?
          </span>
          <h2 className="text-4xl font-black text-[#04333a] font-serif tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isActive = expandedIndex === index;
            return (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  backgroundColor: isActive ? "#ffffff" : "#ffffff",
                  borderColor: isActive ? "#0a7a8c" : "#f1f5f9",
                }}
                className={`rounded-2xl border-2 overflow-hidden shadow-sm transition-colors duration-300`}
              >
                <motion.div
                  onClick={() => setExpandedIndex(isActive ? null : index)}
                  className="flex items-center justify-between p-6 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl transition-colors ${isActive ? "bg-[#e6f0f5] text-[#0a7a8c]" : "bg-gray-50 text-gray-400"}`}
                    >
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3
                      className={`text-lg font-bold transition-colors ${isActive ? "text-[#0a7a8c]" : "text-[#04333a]"}`}
                    >
                      {item.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isActive ? "bg-[#e6f0f5]" : "bg-gray-50"}`}
                  >
                    <ChevronDown className="w-5 h-5 text-[#04333a]" />
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="px-6 pb-6 pt-2"
                    >
                      <div className="p-5 bg-[#f8fafc] rounded-xl border border-gray-100">
                        <p className="text-gray-600 text-sm leading-relaxed font-medium">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
