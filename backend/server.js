require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http"); // 🔥 استدعاء http
const { Server } = require("socket.io"); // 🔥 استدعاء مكتبة السوكيت

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const OurdoctorRoutes = require("./routes/OurDoctorsAndDetailsRoutes");
const appointmentRoutes = require("./routes/AppointmentFormRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const DoctorCommentRoutes = require("./routes/DoctorCommentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const AdminpatientRoutes = require("./routes/AdminPatientRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// 🔥 إعدادات Socket.io الأساسية
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // رابط الفرونت-إند تبعك
    credentials: true,
  },
});

// 🔥 تخزين الـ io جوا الـ app عشان نقدر نستخدمه في أي كنترولر (حركة احترافية)
app.set("io", io);

// 🔥 الاستماع للاتصالات الجديدة
io.on("connection", (socket) => {
  console.log("A user connected with socket id:", socket.id);

  // لما المريض أو الدكتور يفتح الموقع، بندخله بـ "غرفة" خاصة فيه بناءً على الـ ID تبعه
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal notification room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mid-link-4b4q.vercel.app", // الرابط الجديد تبع Vercel (تأكد إنه بدون شرطة مايلة / بالآخر)
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// --- مساراتك (Routes) ---
app.use("/api/messages", messageRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", OurdoctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/prescription", prescriptionRoutes);
app.use("/api/comment", DoctorCommentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/patients", AdminpatientRoutes);

const AdminDoctorRoutes = require("./routes/AdminDoctorRoutes");
app.use("/api/admin", AdminDoctorRoutes);
const AdminManageDoctorRoutes = require("./routes/AdminManageDoctorRoutes");
app.use("/api/admin", AdminManageDoctorRoutes);
const AdminAllpatientRoutes = require("./routes/AdminAllPatientRoutes");
app.use("/api/Allpatients/", AdminAllpatientRoutes);
const scheduleRoutes = require("./routes/scheduleRoutes");
app.use("/api/schedules", scheduleRoutes);
const AdminPrescription = require("./routes/AdminPrescriptionRoutes");
app.use("/api/admin/Prescription", AdminPrescription);
const AdminAppointmentPatientRoutes = require("./routes/AdminAppointmentPatientRoutes");
app.use("/api/AdminPatientAppointments", AdminAppointmentPatientRoutes);
const doctorAppointments = require("./routes/doctorAppointments");
app.use("/api/doctor", doctorAppointments);
const doctorAvailability = require("./routes/doctorAvailability");
app.use("/api/doctor", doctorAvailability);
const feedbackRoutes = require("./routes/feedbackRoutes");
app.use("/api/feedback", feedbackRoutes);
const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notification", notificationRoutes);
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);

app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

// 🔥 التعديل الأهم: نشغل الـ server بدل الـ app
server.listen(PORT, () =>
  console.log(`Server & Socket.io running on port ${PORT}`),
);
