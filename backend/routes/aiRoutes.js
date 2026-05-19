const express = require("express");
const router = express.Router();
const aiController = require("../controller/aiController");

// المسار اللي رح يبعث عليه الفرونت إند الأعراض
router.post("/check", aiController.checkSymptoms);

module.exports = router;