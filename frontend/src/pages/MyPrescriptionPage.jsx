import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Calendar,
  User,
  Stethoscope,
  ClipboardList,
  Pill,
  Activity,
  ChevronDown,
  Sparkles,
  PlusCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropTypes from "prop-types";

axios.defaults.withCredentials = true;

// 🔥 حماية من الشاشة البيضاء: دالة ذكية لمعالجة التاريخ بأمان
const getSafeDate = (dateString) => {
  if (!dateString) return new Date().toLocaleDateString();
  const d = new Date(dateString);
  return isNaN(d.getTime())
    ? new Date().toLocaleDateString()
    : d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const PrescriptionCard = ({
  prescription,
  patientName,
  onDownload,
  index,
  isExpanded,
  onToggle,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white shadow-[0_10px_30px_rgba(4,51,58,0.08)] rounded-3xl overflow-hidden border border-gray-50 group hover:shadow-[0_20px_40px_rgba(4,51,58,0.15)] transition-shadow duration-300"
    >
      <div
        className="bg-gradient-to-r from-[#04333a] to-[#0a7a8c] p-6 text-white cursor-pointer relative overflow-hidden"
        onClick={onToggle}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#58e6fc] rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />

        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
              <Stethoscope className="w-6 h-6 text-[#58e6fc]" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase text-[#58e6fc] mb-1">
                Prescribing Doctor
              </p>
              <span className="font-black text-xl tracking-tight">
                Dr. {prescription.doctor_name}
              </span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-6 h-6 text-[#c4f7ff]" />
          </motion.div>
        </div>

        <div className="mt-6 flex justify-between items-center relative z-10 border-t border-white/10 pt-4">
          <div className="flex items-center space-x-2 text-[#c4f7ff]">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-bold">
              {/* 🔥 طباعة التاريخ الآمن هون */}
              {getSafeDate(prescription.created_at)}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[#c4f7ff] bg-white/10 px-3 py-1 rounded-full">
            <User className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {patientName}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-8 bg-white space-y-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center text-[#0a7a8c] mb-3">
                  <ClipboardList className="w-5 h-5 mr-3" />
                  <span className="font-black uppercase tracking-widest text-xs">
                    Diagnosis
                  </span>
                </div>
                <p className="text-[#04333a] font-serif italic text-lg leading-relaxed ml-8">
                  {prescription.diagnosis}
                </p>
              </div>

              <div className="bg-[#f0f9fa] p-5 rounded-2xl border border-[#c4f7ff]">
                <div className="flex items-center text-[#0a7a8c] mb-3">
                  <Pill className="w-5 h-5 mr-3" />
                  <span className="font-black uppercase tracking-widest text-xs">
                    Medications
                  </span>
                </div>
                <p className="text-[#04333a] font-bold text-lg leading-relaxed ml-8">
                  {prescription.drugs}
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center text-[#0a7a8c] mb-3">
                  <Activity className="w-5 h-5 mr-3" />
                  <span className="font-black uppercase tracking-widest text-xs">
                    Treatment Plan
                  </span>
                </div>
                <p className="text-gray-600 font-medium leading-relaxed ml-8">
                  {prescription.treatment_plan}
                </p>
              </div>

              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(4, 51, 58, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#04333a] to-[#0a7a8c] text-white font-black py-4 px-4 rounded-2xl transition duration-300 flex items-center justify-center gap-3 uppercase tracking-widest text-sm mt-4 group"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
              >
                Download Official PDF{" "}
                <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

PrescriptionCard.propTypes = {
  prescription: PropTypes.shape({
    doctor_name: PropTypes.string.isRequired,
    diagnosis: PropTypes.string.isRequired,
    drugs: PropTypes.string.isRequired,
    treatment_plan: PropTypes.string.isRequired,
    created_at: PropTypes.string,
  }).isRequired,
  patientName: PropTypes.string.isRequired,
  onDownload: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default function MyPrescriptionPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    fetchUserProfile();
    fetchPrescriptions();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        "https://midlink-of4r.onrender.com/api/patients/profile",
      );
      setPatientName(`${response.data.username}`);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to fetch user profile");
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(
        "https://midlink-of4r.onrender.com/api/prescription",
      );
      setPrescriptions(response.data);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError("Failed to fetch prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (prescription, patientName) => {
    Swal.fire({
      title: "Generating PDF...",
      text: "Please wait while we prepare your official document.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const printContainer = document.createElement("div");
    printContainer.style.position = "absolute";
    printContainer.style.left = "-9999px";
    printContainer.style.top = "-9999px";
    printContainer.style.width = "800px";
    printContainer.style.backgroundColor = "#ffffff";
    printContainer.style.padding = "40px";
    printContainer.style.fontFamily = "Arial, sans-serif";
    printContainer.style.color = "#04333a";
    printContainer.dir = "rtl";

    // 🔥 طباعة التاريخ الآمن جوا ملف الـ PDF كمان
    const pdfDate = getSafeDate(prescription.created_at);

    printContainer.innerHTML = `
      <div style="border: 2px solid #0a7a8c; border-radius: 20px; padding: 40px; background: #f8fafc;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e6f0f5; padding-bottom: 20px; margin-bottom: 30px;">
          <div style="text-align: right;">
            <h1 style="color: #04333a; margin: 0; font-size: 28px;">وصفة طبية رسمية</h1>
            <p style="color: #0a7a8c; margin: 5px 0 0 0; font-size: 16px; font-weight: bold;">MidLink Healthcare</p>
          </div>
          <div style="text-align: left;" dir="ltr">
            <h1 style="color: #04333a; margin: 0; font-size: 28px;">Medical Prescription</h1>
            <p style="color: #0a7a8c; margin: 5px 0 0 0; font-size: 16px;">Date: ${pdfDate}</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <div style="text-align: right; width: 48%;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">اسم المريض / Patient</p>
            <h3 style="margin: 5px 0 0 0; color: #04333a; font-size: 20px;">${patientName}</h3>
          </div>
          <div style="text-align: right; width: 48%; border-right: 2px solid #e2e8f0; padding-right: 20px;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">الطبيب المعالج / Doctor</p>
            <h3 style="margin: 5px 0 0 0; color: #04333a; font-size: 20px;">Dr. ${prescription.doctor_name}</h3>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="background: #04333a; color: white; padding: 10px 20px; border-radius: 10px 10px 0 0;">
            <h4 style="margin: 0; font-size: 18px;">التشخيص | Diagnosis</h4>
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; border-top: none; padding: 20px; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; font-size: 16px; line-height: 1.6;">${prescription.diagnosis}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="background: #0a7a8c; color: white; padding: 10px 20px; border-radius: 10px 10px 0 0;">
            <h4 style="margin: 0; font-size: 18px;">الأدوية | Medications</h4>
          </div>
          <div style="background: white; border: 1px solid #0a7a8c; border-top: none; padding: 20px; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; font-size: 16px; line-height: 1.8; font-weight: bold; color: #04333a;">${prescription.drugs}</p>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <div style="background: #e6f0f5; color: #04333a; padding: 10px 20px; border-radius: 10px 10px 0 0;">
            <h4 style="margin: 0; font-size: 18px; font-weight: bold;">خطة العلاج | Treatment Plan</h4>
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; border-top: none; padding: 20px; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; font-size: 16px; line-height: 1.6;">${prescription.treatment_plan}</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px dashed #cbd5e1; color: #94a3b8; font-size: 12px;" dir="ltr">
          <p style="margin-bottom: 5px;">This is a digitally generated official prescription by MidLink Healthcare System.</p>
          <p>© 2026 MidLink Healthcare. All rights reserved.</p>
        </div>
      </div>
    `;

    document.body.appendChild(printContainer);

    try {
      const canvas = await html2canvas(printContainer, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Prescription_${new Date().toLocaleDateString()}_${patientName}.pdf`,
      );

      Swal.close();
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.fire("Error", "Could not generate PDF. Please try again.", "error");
    } finally {
      document.body.removeChild(printContainer);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      <Navbar />

      <div className="bg-[#04333a] pt-40 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0a7a8c] rounded-full blur-[100px] opacity-20 -mr-48 -mt-48 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-[#58e6fc]/20 text-[#58e6fc] px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6 inline-flex items-center gap-2 border border-[#58e6fc]/30">
            <Sparkles size={14} /> Medical Records
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58e6fc] to-[#c4f7ff]">
              Prescriptions
            </span>
          </h1>
          <p className="text-[#c4f7ff] text-lg font-medium opacity-80 max-w-2xl mx-auto font-serif italic">
            Access, review, and download your official medical prescriptions
            securely generated by your doctors.
          </p>
        </motion.div>
      </div>

      <div className="flex-grow container mx-auto px-6 -mt-10 relative z-10 pb-32">
        <div className="max-w-7xl mx-auto">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border-2 border-red-100 text-red-700 p-5 mb-8 rounded-2xl flex items-center gap-4 shadow-lg"
            >
              <div className="bg-red-100 p-2 rounded-full">
                <Activity className="text-red-600" />
              </div>
              <div>
                <p className="font-black uppercase tracking-widest text-xs mb-1">
                  System Error
                </p>
                <p className="font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Sparkles className="text-[#0a7a8c] w-12 h-12" />
              </motion.div>
            </div>
          ) : prescriptions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {prescriptions.map((prescription, index) => (
                <PrescriptionCard
                  key={index}
                  index={index}
                  prescription={prescription}
                  patientName={patientName}
                  onDownload={() => downloadPDF(prescription, patientName)}
                  isExpanded={expandedIndex === index}
                  onToggle={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow-2xl rounded-[3rem] p-16 text-center max-w-3xl mx-auto border border-gray-100"
            >
              <div className="bg-[#e6f0f5] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <ClipboardList className="text-[#0a7a8c] w-12 h-12" />
              </div>
              <h3 className="text-3xl font-black text-[#04333a] mb-4">
                No Prescriptions Yet
              </h3>
              <p className="text-gray-500 text-lg mb-10 font-serif">
                You currently don't have any medical prescriptions in your
                history. Once a doctor prescribes medication, it will appear
                here securely.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#04333a] text-white py-4 px-8 rounded-2xl font-black hover:bg-[#0a7a8c] transition-all flex items-center justify-center mx-auto gap-3 uppercase tracking-widest text-sm shadow-xl"
              >
                <PlusCircle size={20} /> Request New Prescription
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
