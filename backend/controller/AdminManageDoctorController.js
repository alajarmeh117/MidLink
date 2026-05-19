// Backend: controllers/adminController.js
const db = require("../config/db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "midlink81@gmail.com",
    pass: "nqjz gdaz ylfo dvtj",
  },
});

exports.getAllStaff = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM medical_staff ORDER BY staff_id DESC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "An error occurred while fetching staff" });
  }
};

exports.approveStaff = async (req, res) => {
  const { id } = req.params;
  const { isApproved } = req.body;

  try {
    const result = await db.query(
      "UPDATE medical_staff SET is_approved = $1 WHERE staff_id = $2 RETURNING *",
      [isApproved, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    const staffMember = result.rows[0];

    // Send verification email matching MidLink standards
    const mailOptions = {
      from: "midlink81@gmail.com",
      to: staffMember.email,
      subject: `MidLink Platform: Doctor Verification Status`,
      text: isApproved
        ? `Congratulations Dr. ${staffMember.staff_name},\n\nYour account and medical license have been successfully verified by the MidLink administration. You can now log in and start receiving patients.\n\nWelcome to MidLink!`
        : `Dear Dr. ${staffMember.staff_name},\n\nYour account verification on the MidLink platform has been revoked or declined. Please contact administration for more details regarding your license or credentials.`,
    };

    // شلنا كلمة await وضفنا catch عشان يكمل إرسال الإيميل بالخلفية
    transporter
      .sendMail(mailOptions)
      .catch((err) => console.error("Error sending email:", err));

    res.json({
      message: "Doctor verification status updated successfully",
      staff: staffMember,
    });
  } catch (error) {
    console.error("Error updating staff member:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating verification status" });
  }
};

// New function to get doctor count
exports.getDoctorCount = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) FROM medical_staff WHERE specialty IS NOT NULL",
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error("Error fetching doctor count:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching doctor count" });
  }
};
