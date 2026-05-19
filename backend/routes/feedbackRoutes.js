const express = require("express");
const router = express.Router();

// 1. استدعاء دوال الكنترولر (من مجلد controller بدون s)
const {
  createFeedback,
  getFeedbacks,
  toggleFeedbackStatus,
  getUserFeedback,
} = require("../controller/feedbackController");

// 2. استدعاء حارس الأمن
const { authenticateToken } = require("../middleware/authMiddleware");

// 3. الراوتس
router.post("/", authenticateToken, createFeedback);
router.get("/", getFeedbacks);
router.get("/me", authenticateToken, getUserFeedback);
router.patch("/admin/feedbacks/:id", toggleFeedbackStatus);

module.exports = router;
