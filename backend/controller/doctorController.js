const db = require("../config/db");
const bcrypt = require("bcrypt");

const DEFAULT_PROFILE_IMAGE = "uploads/default-doctor.png";

exports.getDoctorProfile = async (req, res) => {
  try {
    const staffId = req.user.staff_id;
    const query =
      "SELECT staff_id, staff_name, email, specialty, bio, profile_image, cv FROM medical_staff WHERE staff_id = $1";
    const result = await db.query(query, [staffId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res
      .status(500)
      .json({ message: "Error fetching doctor profile", error: error.message });
  }
};

exports.updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.user.staff_id;
    const { staff_name, email, password, specialty, bio } = req.body;
    let query =
      "UPDATE medical_staff SET staff_name = $1, email = $2, specialty = $3, bio = $4";
    let values = [staff_name, email, specialty, bio];
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ", password = $5";
      values.push(hashedPassword);
    }
    query +=
      " WHERE staff_id = $" +
      (values.length + 1) +
      " RETURNING staff_id, staff_name, email, specialty, bio, profile_image, cv";
    values.push(doctorId);
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    res
      .status(500)
      .json({ message: "Error updating doctor profile", error: error.message });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    const doctorId = req.user.staff_id;
    const profileImage = req.file ? req.file.path : null;
    if (!profileImage) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
    const query =
      "UPDATE medical_staff SET profile_image = $1 WHERE staff_id = $2 RETURNING staff_id, profile_image";
    const result = await db.query(query, [profileImage, doctorId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating profile image:", error);
    res
      .status(500)
      .json({ message: "Error updating profile image", error: error.message });
  }
};

exports.updateCV = async (req, res) => {
  try {
    const doctorId = req.user.staff_id;
    const cvPath = req.file ? `uploads/cv/${req.file.filename}` : null;
    if (!cvPath) {
      return res.status(400).json({ message: "No CV file uploaded" });
    }
    const query =
      "UPDATE medical_staff SET cv = $1 WHERE staff_id = $2 RETURNING staff_id, cv";
    const result = await db.query(query, [cvPath, doctorId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating CV:", error);
    res
      .status(500)
      .json({ message: "Error updating CV", error: error.message });
  }
};

exports.registerDoctor = async (req, res) => {
  const { staff_name, email, password, specialty, bio } = req.body;

  // جلب مسار صورة البروفايل (إذا رفعها)
  const profile_image =
    req.files && req.files["profile_image"]
      ? `uploads/${req.files["profile_image"][0].filename}`
      : null; // أو أي مسار صورة افتراضية إنت بتستخدمه

  // جلب مسار ملف الـ CV
  const cv =
    req.files && req.files["cv"]
      ? `uploads/cv/${req.files["cv"][0].filename}`
      : null;

  // 🚨 الجدار الناري (Backend Validation): منع التسجيل إجبارياً إذا الـ CV مش موجود
  if (!cv) {
    return res.status(400).json({
      message: "Registration Failed: CV document is strictly mandatory.",
    });
  }

  try {
    // 1. فحص إذا الإيميل موجود مسبقاً
    const checkEmail = await db.query(
      "SELECT * FROM medical_staff WHERE email = $1",
      [email],
    );
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. تشفير الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. إدخال البيانات في الداتابيس
    const query = `
      INSERT INTO medical_staff (staff_name, email, password, profile_image, specialty, bio, cv, is_approved)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING staff_id, staff_name, email, profile_image, specialty, bio, cv, is_approved`;

    const values = [
      staff_name,
      email,
      hashedPassword,
      profile_image,
      specialty,
      bio,
      cv, // الآن نحن متأكدين 100% أنه يحتوي على ملف
      false, // الحساب بيحتاج موافقة الأدمن
    ];

    const result = await db.query(query, values);

    // 4. الرد بنجاح
    res.status(201).json({
      message: "Doctor registered successfully! Pending admin approval.",
      doctor: result.rows[0],
    });
  } catch (error) {
    console.error("Error registering doctor:", error);
    res
      .status(500)
      .json({ message: "Error registering doctor", error: error.message });
  }
};
