const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const nodemailer = require("nodemailer");

exports.signup = async (req, res) => {
  try {
    const { username, email, password, gender, dob } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO patients (username, email, password, gender, dob, is_approved)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [username, email, hashedPassword, gender, dob, true];
    const result = await db.query(query, values);
    res.status(201).json({
      message: "Patient registered successfully",
      patientId: result.rows[0].id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering patient", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    let query, user;

    if (userType === "patient") {
      query = "SELECT * FROM patients WHERE email = $1";
    } else if (userType === "doctor") {
      query = "SELECT * FROM medical_staff WHERE email = $1";
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    const result = await db.query(query, [email]);
    user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.is_approved) {
      return res
        .status(403)
        .json({ message: "Your account is not approved yet" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // const tokenPayload = {
    //   id: user.id,
    //   email: user.email,
    //   userType,
    //   staff_name: userType === 'doctor' ? user.staff_name : null
    // };

    const tokenPayload = {
      id: user.id || user.staff_id,
      email: user.email,
      userType,
      staff_name: userType === "doctor" ? user.staff_name : null,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const tokenName = userType === "doctor" ? "Doctor Token" : "Patient Token";

    res.cookie(tokenName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({ userType, message: "Login successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("Doctor Token");
  res.clearCookie("Patient Token");
  res.clearCookie("AdminToken");

  res.json({ message: "Logged out successfully" });
};

exports.checkAuthStatus = async (req, res) => {
  // 🔥 ضفنا async
  const doctorToken = req.cookies["Doctor Token"];
  const patientToken = req.cookies["Patient Token"];
  const token = doctorToken || patientToken;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 جلب بيانات المستخدم كاملة (مع الصورة) من الداتابيس
    let query = "";
    if (decoded.userType === "doctor") {
      query =
        "SELECT staff_id as id, staff_name, email, profile_image FROM medical_staff WHERE staff_id = $1";
    } else {
      query =
        "SELECT id, username, email, profile_image FROM patients WHERE id = $1";
    }

    const result = await db.query(query, [decoded.id]);
    const user = result.rows[0];

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      isAuthenticated: true,
      userType: decoded.userType,
      user: {
        id: user.id,
        email: user.email,
        staff_name: decoded.userType === "doctor" ? user.staff_name : null,
        username: decoded.userType === "patient" ? user.username : null,
        profile_image: user.profile_image, // 🔥 السر هون: إرسال الصورة للفرونت-إند
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// إعداد إيميل الإرسال (نفس اللي استخدمناه بالمواعيد)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "midlink81@gmail.com",
    pass: "nqjz gdaz ylfo dvtj",
  },
});

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // 1. نبحث عن الإيميل في جدول المرضى أولاً
    let query = "SELECT * FROM patients WHERE email = $1";
    let result = await db.query(query, [email]);
    let user = result.rows[0];
    let userType = "patient";

    // 2. إذا مش مريض، نبحث في جدول الدكاترة
    if (!user) {
      query = "SELECT * FROM medical_staff WHERE email = $1";
      result = await db.query(query, [email]);
      user = result.rows[0];
      userType = "doctor";
    }

    // 3. إذا الإيميل مش موجود أبداً
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // 4. إنشاء Token سري محمي بالباسورد القديم (ينتهي خلال 15 دقيقة)
    const userId = userType === "patient" ? user.id : user.staff_id;
    const secret = process.env.JWT_SECRET + user.password;
    const payload = { email: user.email, id: userId, userType };
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });

    // 5. إنشاء رابط الترجيع وإرساله
    const link = `http://localhost:5173/reset-password/${userId}/${token}`;

    const mailOptions = {
      from: "midlink81@gmail.com",
      to: email,
      subject: "Password Reset Request - MidLink",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #04333a;">Reset Your Password</h2>
          <p>You requested a password reset for your MidLink account.</p>
          <p>Please click the button below to set a new password. This link is valid for <strong>15 minutes</strong> only.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background-color: #0a7a8c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #777;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    // إرسال الإيميل بالخلفية بدون تعطيل الرد
    transporter
      .sendMail(mailOptions)
      .catch((err) => console.error("Email error:", err));

    // الرد فوراً على الفرونت-إند بجزء من الثانية
    res.json({ message: "Password reset link sent to your email!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error sending email", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    // 1. فحص هل المستخدم موجود
    let query = "SELECT * FROM patients WHERE id = $1";
    let result = await db.query(query, [id]);
    let user = result.rows[0];
    let userType = "patient";
    let idColumn = "id";

    if (!user) {
      query = "SELECT * FROM medical_staff WHERE staff_id = $1";
      result = await db.query(query, [id]);
      user = result.rows[0];
      userType = "doctor";
      idColumn = "staff_id";
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. فحص صحة الـ Token (نفس السر اللي أنشأناه فيه)
    const secret = process.env.JWT_SECRET + user.password;
    try {
      jwt.verify(token, secret);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Link has expired or is invalid." });
    }

    // 3. تشفير الباسورد الجديد وتحديث الداتابيس
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateQuery = `UPDATE ${userType === "patient" ? "patients" : "medical_staff"} SET password = $1 WHERE ${idColumn} = $2`;
    await db.query(updateQuery, [hashedPassword, id]);

    res.json({ message: "Password has been reset successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error resetting password", error: error.message });
  }
};
