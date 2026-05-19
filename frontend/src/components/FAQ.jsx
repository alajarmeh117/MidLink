import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Heart,
  Shield,
  Calendar,
  UserPlus,
  Video,
  Brain,
  CreditCard,
  Bell,
  Sparkles,
} from "lucide-react";

const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book an appointment on MidLink?",
      answer:
        "Simply search for a doctor by specialty or name, select an available time slot, choose your consultation type (in-clinic or video), and complete the payment. You'll receive an instant confirmation.",
      icon: Calendar,
    },
    {
      question: "Are the doctors on MidLink verified?",
      answer:
        "Yes! All doctors on MidLink are verified through the Jordan Medical Association (JMA). Each doctor must upload their medical license and credentials, which are reviewed by our admin team before approval.",
      icon: Shield,
    },
    {
      question: "How does the video consultation work?",
      answer:
        "Once your appointment is confirmed, you'll receive a link to join a secure video session at the scheduled time. The consultation uses WebRTC technology, supports screen sharing, file transfer, and optional session recording with consent.",
      icon: Video,
    },
    {
      question: "What is the AI Symptom Checker?",
      answer:
        "The AI Symptom Checker helps you describe your symptoms and recommends the most suitable medical specialty. It is a guidance tool only and does not replace professional medical diagnosis.",
      icon: Brain,
    },
    {
      question: "What payment methods are supported?",
      answer:
        "MidLink supports credit and debit cards via Stripe. You'll receive a digital invoice after each payment, and refunds are processed automatically based on the cancellation policy.",
      icon: CreditCard,
    },
    {
      question: "How does the waiting list work?",
      answer:
        "If your preferred time slot is fully booked, you can join the waiting list. You'll be automatically notified via SMS, WhatsApp, or email when a slot becomes available.",
      icon: Bell,
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer:
        "Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours may be subject to the platform's refund policy.",
      icon: UserPlus,
    },
    {
      question: "Is my medical data secure on MidLink?",
      answer:
        "Absolutely. MidLink uses end-to-end encryption for all sensitive health information and complies with the Jordanian Personal Data Protection Law and international healthcare privacy standards (HIPAA).",
      icon: Heart,
    },
  ];

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#f6f5f2] font-serif relative">
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-[#04333a]/10 text-[#04333a] text-sm font-bold tracking-widest mb-4 uppercase">
            <Sparkles size={16} /> Support Center
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#04333a] mb-4">
            Got Questions?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a7a8c] to-[#58e6fc]">
              We've Got Answers
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Everything you need to know about MidLink's smart healthcare
            platform.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((item, index) => {
            const isActive = expandedIndex === index;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                  isActive
                    ? "shadow-[0_10px_30px_rgba(4,51,58,0.1)] border border-[#58e6fc]/50"
                    : "shadow-md border border-transparent hover:shadow-lg"
                }`}
              >
                <motion.div
                  className="p-6 cursor-pointer flex items-center justify-between"
                  onClick={() => setExpandedIndex(isActive ? null : index)}
                  whileHover={{ backgroundColor: "#f8fafc" }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl transition-colors duration-300 ${isActive ? "bg-gradient-to-br from-[#04333a] to-[#0a7a8c] text-white" : "bg-[#e6f0f5] text-[#04333a]"}`}
                    >
                      <item.icon className="w-6 h-6 flex-shrink-0" />
                    </div>
                    <h3
                      className={`text-base font-bold transition-colors ${isActive ? "text-[#0a7a8c]" : "text-[#04333a]"}`}
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
                      <div className="p-4 bg-[#f8fafc] rounded-xl border border-gray-100">
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
