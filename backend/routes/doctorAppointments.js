const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  getTodayAppointments,
  updateAppointment,
  addRecord,
  getRecords,
  softDelete,
  updateRecord,
  patientController,
  getWeeklyAppointments,
} = require("../controller/doctorAppointments");

router.patch("/healthcare_records/:id/softdelete", softDelete);
router.patch("/healthcare_records/:id/update", updateRecord);
router.get("/appointments", getAllAppointments);
router.get("/today-appointments", getTodayAppointments);
router.put("/update-appointment", updateAppointment);
router.post("/add-record", addRecord);
router.get("/patient-records", getRecords);
router.patch("/patients/:id/update", patientController.updatePatientInfo);
router.get("/weekly-appointments", getWeeklyAppointments);

module.exports = router;

// ---------------------------------

//?postman ...
//TODOO ...... doctorAvailability .... POST ...
//*https://midlink-of4r.onrender.com/api/doctor/set-availability
// {
//   "availableStartDate": "2024-09-21",
//   "availableEndDate": "2024-09-28",
//   "startTime": "09:00:00",
//   "endTime": "17:00:00",
//   "slotDuration": "00:30:00"
// }

//TODOO ...... getAvailability .... GET ...
//* https://midlink-of4r.onrender.com/api/doctor/availabilities/:staffId

//TODOO ...... getAllAppointments .... GET ...
//* https://midlink-of4r.onrender.com/api/doctor/appointments

//TODOO ...... getTodayAppointments .... GET ...
//* https://midlink-of4r.onrender.com/api/doctor/today-appointments

//TODOO ...... addRecord .... post ...
//* https://midlink-of4r.onrender.com/api/doctor/add-record

//TODOO ...... getRecords .... GET ...
//* https://midlink-of4r.onrender.com/api/doctor/patient-records

//--add doctor
// INSERT INTO medical_staff (staff_name, email, password, profile_image, specialty, bio, is_approved)
// VALUES
// ('Aya', 'aya@gmail.com', '$2b$10$6Lpag0fjYNqtgSAXZerD8enHdp3zdSmBZKpvhY8k.9YJUYCL.PEti', NULL, 'Cardiology', 'Experienced in heart health and patient care.', TRUE);

// -- إضافة توافر للطبيب
// INSERT INTO doctor_availability (
//     staff_id,
//     available_start_date,
//     available_end_date,
//     available_start_time,
//     available_end_time,
//     is_booked,
//     is_deleted
// )
// VALUES
// (1, '2024-09-25', '2024-09-25', '09:00:00', '9:30:00', FALSE, FALSE);

// -- إضافة موعد للمريض
// INSERT INTO appointments (available_id, id, status)
// VALUES (1, 1, 'SCHEDULED');
