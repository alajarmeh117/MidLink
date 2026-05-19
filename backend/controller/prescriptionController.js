const db = require("../config/db");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

exports.getPrescriptions = async (req, res) => {
  try {
    const patientId = req.user.id;
    // 🔥 ضفنا جلب التاريخ (created_at) ورتبناهم من الأحدث للأقدم
    const query = `
      SELECT hr.diagnosis, hr.drugs, hr.treatment_plan, hr.created_at, ms.staff_name AS doctor_name
      FROM healthcare_records hr
      JOIN medical_staff ms ON hr.staff_id = ms.staff_id
      WHERE hr.id = $1 AND hr.is_deleted = false
      ORDER BY hr.created_at DESC
    `;
    const result = await db.query(query, [patientId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
