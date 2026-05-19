const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/AppointmentFormController");
const {
  getDoctorByAppointmentId,
  getDoctorRating,
} = require("../controller/AppointmentFormController");

router.get(
  "/doctors/:doctorId/available-slots",
  appointmentController.authenticateToken,
  appointmentController.getAvailableSlots,
);
router.post(
  "/appointments",
  appointmentController.authenticateToken,
  appointmentController.bookAppointment,
);
router.post(
  "/submit-review",
  appointmentController.authenticateToken,
  appointmentController.submitReview,
);
router.put(
  "/appointments/:appointmentId/cancel",
  appointmentController.authenticateToken,
  appointmentController.cancelAppointment,
);
router.get(
  "/unreviewed-appointments",
  appointmentController.authenticateToken,
  appointmentController.getUnreviewedAppointments,
);

// --- المسار الجديد لقائمة الانتظار ---
router.post(
  "/doctors/:doctorId/waiting-list",
  appointmentController.authenticateToken,
  appointmentController.joinWaitingList,
);

// routes بدون authentication
router.get("/doctor/:id", getDoctorByAppointmentId);
router.get("/doctor/:doctorId/rating", getDoctorRating);

module.exports = router;
