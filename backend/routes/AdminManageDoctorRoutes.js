// Backend: routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controller/AdminManageDoctorController"); // تأكد إن اسم الكنترولر هون مطابق لاسم الملف عندك

router.get("/staff", adminController.getAllStaff);
router.put("/staff/:id/approve", adminController.approveStaff);
router.get("/doctors/count", adminController.getDoctorCount);

module.exports = router;
