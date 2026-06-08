const DoctorAvailability = require("../models/doctorAvailability");
const nodemailer = require("nodemailer");
const db = require("../config/db");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "midlink81@gmail.com",
    pass: "nqjz gdaz ylfo dvtj",
  },
});

const sendCancellationEmail = async (patient) => {
  const {
    patient_email,
    patient_name,
    doctor_name,
    appointment_date,
    appointment_time,
  } = patient;
  const formattedDate = new Date(appointment_date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = appointment_time?.slice(0, 5) || appointment_time;

  const mailOptions = {
    from: "midlink81@gmail.com",
    to: patient_email,
    subject: "Appointment Cancellation Notice",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #04333a;">Appointment Cancellation</h2>
        <p>Dear <strong>${patient_name}</strong>,</p>
        <p>We regret to inform you that your appointment has been cancelled by <strong>Dr. ${doctor_name}</strong>.</p>
        <div style="background-color: #f6f5f2; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedTime}</p>
        </div>
        <p>We sincerely apologize for the inconvenience. We will contact you shortly to reschedule your appointment at a more convenient time.</p>
        <p>Best regards,<br/>The Medical Team</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const notifyWaitingList = async (staffId) => {
  try {
    const query = `
      SELECT w.waiting_id, p.email, p.username, m.staff_name
      FROM waiting_list w
      JOIN patients p ON w.patient_id = p.id
      JOIN medical_staff m ON w.doctor_id = m.staff_id
      WHERE w.doctor_id = $1 AND w.is_notified = FALSE
    `;
    const result = await db.query(query, [staffId]);
    if (result.rows.length === 0) return;

    for (const patient of result.rows) {
      const mailOptions = {
        from: "midlink81@gmail.com",
        to: patient.email,
        subject: "New Appointment Slot Available - MidLink",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #22c55e;">Great News!</h2>
            <p>Dear <strong>${patient.username}</strong>,</p>
            <p>A new appointment slot has just opened up for <strong>Dr. ${patient.staff_name}</strong>.</p>
            <p>Since you are on our waiting list, we wanted to notify you right away. Hurry up and log in to book your appointment before it gets taken!</p>
            <br/>
            <p>Best regards,<br/>MidLink Healthcare Team</p>
          </div>
        `,
      };
      transporter
        .sendMail(mailOptions)
        .catch((err) =>
          console.error("Error sending waiting list email:", err),
        );
      await db.query(
        "UPDATE waiting_list SET is_notified = TRUE WHERE waiting_id = $1",
        [patient.waiting_id],
      );
    }
  } catch (error) {
    console.error("Error checking waiting list:", error);
  }
};

const setAvailability = async (req, res) => {
  try {
    // 🔥 التعديل: استقبلنا slot_type من الواجهة
    const {
      availableStartDate,
      availableEndDate,
      startTime,
      endTime,
      slot_type,
    } = req.body;
    const staffId = req.user.id;

    if (!staffId)
      return res.status(400).json({ message: "Staff ID is missing" });

    // 🔥 التعديل: مررنا slot_type للموديل
    const availability = await DoctorAvailability.setAvailability(
      staffId,
      availableStartDate,
      availableEndDate,
      startTime,
      endTime,
      slot_type || "ONLINE", // تمرير النوع (والقيمة الافتراضية أونلاين للحماية)
    );

    notifyWaitingList(staffId).catch((err) => console.error(err));

    res
      .status(201)
      .json({ message: "Availability set successfully", availability });
  } catch (error) {
    console.error("Error setting availability:", error);
    res
      .status(500)
      .json({ message: "Error setting availability", error: error.message });
  }
};
const getDoctorAvailabilities = async (req, res) => {
  try {
    const staffId = req.user.id;
    await DoctorAvailability.autoCompleteExpiredAppointments();
    const availabilities =
      await DoctorAvailability.getDoctorAvailabilities(staffId);
    res.status(200).json({
      message: "Doctor availabilities retrieved successfully",
      availabilities,
    });
  } catch (error) {
    console.error("Error getting doctor availabilities:", error);
    res.status(500).json({
      message: "Error getting doctor availabilities",
      error: error.message,
    });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const staffId = req.user.id;
    const availableId = req.params.availableId;
    const updatedData = req.body;
    const updatedAvailability = await DoctorAvailability.updateAvailability(
      availableId,
      staffId,
      updatedData,
    );
    if (!updatedAvailability)
      return res
        .status(404)
        .json({ message: "Availability not found or no permission" });
    res.status(200).json({
      message: "Availability updated successfully",
      availability: updatedAvailability,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating availability", error: error.message });
  }
};

const deleteAvailability = async (req, res) => {
  try {
    const staffId = req.user.id;
    const availableId = req.params.availableId;

    await db.query("BEGIN");
    const bookedPatients =
      await DoctorAvailability.getBookedPatientsForSlot(availableId);

    if (bookedPatients.length > 0) {
      await DoctorAvailability.cancelAppointmentsForSlot(availableId);
    }

    const deletedAvailability = await DoctorAvailability.softDeleteAvailability(
      availableId,
      staffId,
    );

    if (!deletedAvailability) {
      await db.query("ROLLBACK");
      return res.status(404).json({
        message: "Availability not found or you don't have permission",
      });
    }

    await db.query("COMMIT");

    if (bookedPatients.length > 0) {
      Promise.allSettled(
        bookedPatients.map((patient) => sendCancellationEmail(patient)),
      ).then((results) => {
        results.forEach((result, i) => {
          if (result.status === "rejected")
            console.error(`Failed to send email:`, result.reason);
        });
      });
    }

    res.status(200).json({
      message: "Availability deleted successfully",
      availability: deletedAvailability,
      notifiedPatients: bookedPatients.length,
    });
  } catch (error) {
    await db.query("ROLLBACK");
    res
      .status(500)
      .json({ message: "Error deleting availability", error: error.message });
  }
};

module.exports = {
  setAvailability,
  getDoctorAvailabilities,
  updateAvailability,
  deleteAvailability,
};
