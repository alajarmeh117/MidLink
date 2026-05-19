const db = require("../config/db");
const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies["Patient Token"];
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

exports.getAvailableSlots = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const result = await db.query(
      // 🔥 ضفنا AND is_deleted = FALSE عشان المواعيد المحذوفة تختفي من المريض
      "SELECT * FROM doctor_availability WHERE staff_id = $1 AND is_booked = FALSE AND is_deleted = FALSE AND available_start_date >= CURRENT_DATE ORDER BY available_start_date, available_start_time",
      [doctorId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching available slots" });
  }
};

exports.bookAppointment = async (req, res) => {
  const { available_id } = req.body;
  const patientId = req.user.id;
  try {
    await db.query("BEGIN");

    // 🔥 جلب بيانات الموعد للتأكد منه ولجلب ID الدكتور
    const slotCheck = await db.query(
      "SELECT * FROM doctor_availability WHERE available_id = $1 AND is_booked = FALSE AND is_deleted = FALSE",
      [available_id],
    );

    if (slotCheck.rows.length === 0) {
      await db.query("ROLLBACK");
      return res.status(400).json({
        message:
          "This slot is no longer available or has been removed by the doctor.",
      });
    }

    // استخراج رقم الدكتور
    const doctorId = slotCheck.rows[0].staff_id;

    const result = await db.query(
      "INSERT INTO appointments (available_id, id, status) VALUES ($1, $2, $3) RETURNING appointment_id",
      [available_id, patientId, "SCHEDULED"],
    );

    await db.query(
      "UPDATE doctor_availability SET is_booked = TRUE WHERE available_id = $1",
      [available_id],
    );

    // 🔥 1. إضافة إشعار الحجز للداتابيس
    const patientResult = await db.query(
      "SELECT username FROM patients WHERE id = $1",
      [patientId],
    );
    const patientName = patientResult.rows[0].username;

    await db.query(
      "INSERT INTO notifications (user_id, doctor_id, message) VALUES ($1, $2, $3)",
      [patientId, doctorId, `New appointment booked by ${patientName}`],
    );

    await db.query("COMMIT");

    // 🔥 2. إطلاق رنة السوكيت (Ping) للدكتور لايف!
    const io = req.app.get("io");
    if (io) {
      io.to(doctorId.toString()).emit("newNotification");
    }

    res.status(201).json({
      appointment_id: result.rows[0].appointment_id,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error booking appointment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while booking the appointment" });
  }
};

exports.getUnreviewedAppointments = async (req, res) => {
  const patientId = req.user.id;
  try {
    const query = `
      SELECT a.appointment_id, da.staff_id AS doctor_id, da.available_start_date, da.available_start_time
      FROM appointments a
      JOIN doctor_availability da ON a.available_id = da.available_id
      WHERE a.id = $1 AND a.is_Deleted = FALSE AND a.is_Done = TRUE
      AND NOT EXISTS (
        SELECT 1 FROM reviews r WHERE r.appointment_id = a.appointment_id
      )
    `;
    const result = await db.query(query, [patientId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching unreviewed appointments:", error);
    res.status(500).json({
      error: "An error occurred while fetching unreviewed appointments.",
    });
  }
};

exports.submitReview = async (req, res) => {
  const { rating, reviewContent, appointment_id } = req.body;
  const patientId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }
  if (!appointment_id) {
    return res.status(400).json({ message: "appointment_id is required." });
  }

  try {
    const appointmentQuery = `
      SELECT a.appointment_id, da.staff_id AS doctor_id
      FROM appointments a
      JOIN doctor_availability da ON a.available_id = da.available_id
      WHERE a.appointment_id = $1
        AND a.id = $2
        AND a.is_Deleted = FALSE
        AND a.is_Done = TRUE
    `;
    const appointmentResult = await db.query(appointmentQuery, [
      appointment_id,
      patientId,
    ]);

    if (appointmentResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Appointment not found or not completed." });
    }

    const doctorId = appointmentResult.rows[0].doctor_id;

    const existingReview = await db.query(
      "SELECT 1 FROM reviews WHERE appointment_id = $1 AND patient_id = $2",
      [appointment_id, patientId],
    );
    if (existingReview.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Review already submitted for this appointment." });
    }

    await db.query(
      "INSERT INTO reviews (appointment_id, patient_id, staff_id, rating, review_content) VALUES ($1, $2, $3, $4, $5)",
      [appointment_id, patientId, doctorId, rating, reviewContent],
    );

    return res.status(201).json({ message: "Review submitted successfully." });
  } catch (error) {
    console.error("Error submitting review:", error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting the review." });
  }
};

exports.getDoctorByAppointmentId = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const query = `
      SELECT ms.staff_name
      FROM appointments a
      JOIN doctor_availability da ON a.available_id = da.available_id
      JOIN medical_staff ms ON da.staff_id = ms.staff_id
      WHERE a.appointment_id = $1
    `;
    const result = await db.query(query, [appointmentId]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Appointment or doctor not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching doctor by appointment ID:", error);
    res.status(500).json({
      message: "Error fetching doctor information",
      error: error.message,
    });
  }
};

exports.getDoctorRating = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const query = `
      SELECT 
        ROUND(AVG(rating)::numeric, 1) AS average_rating,
        COUNT(*) AS total_reviews
      FROM reviews
      WHERE staff_id = $1
    `;
    const result = await db.query(query, [doctorId]);
    const { average_rating, total_reviews } = result.rows[0];
    res.json({
      average_rating: average_rating ? parseFloat(average_rating) : null,
      total_reviews: parseInt(total_reviews),
    });
  } catch (error) {
    console.error("Error fetching doctor rating:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching doctor rating." });
  }
};

exports.joinWaitingList = async (req, res) => {
  const { doctorId } = req.params;
  const patientId = req.user.id;

  try {
    const checkQuery =
      "SELECT * FROM waiting_list WHERE doctor_id = $1 AND patient_id = $2 AND is_notified = FALSE";
    const existing = await db.query(checkQuery, [doctorId, patientId]);

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "You are already on the waiting list for this doctor.",
      });
    }

    const insertQuery =
      "INSERT INTO waiting_list (doctor_id, patient_id) VALUES ($1, $2)";
    await db.query(insertQuery, [doctorId, patientId]);

    res.status(201).json({
      message:
        "Successfully joined the waiting list! We will notify you if a slot opens up.",
    });
  } catch (error) {
    console.error("Error joining waiting list:", error);
    res
      .status(500)
      .json({ error: "An error occurred while joining the waiting list." });
  }
};

exports.cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const patientId = req.user.id;

  try {
    await db.query("BEGIN");

    // 1. جلب بيانات الموعد والدكتور
    const appQuery = `
      SELECT a.status, da.available_start_date, da.available_start_time, da.available_id, da.staff_id, p.username as patient_name
      FROM appointments a
      JOIN doctor_availability da ON a.available_id = da.available_id
      JOIN patients p ON a.id = p.id
      WHERE a.appointment_id = $1 AND a.id = $2
    `;
    const appResult = await db.query(appQuery, [appointmentId, patientId]);

    if (appResult.rows.length === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ message: "Appointment not found." });
    }

    const appData = appResult.rows[0];

    // 2. تحديث حالة الموعد إلى ملغي
    await db.query(
      "UPDATE appointments SET status = 'CANCELLED' WHERE appointment_id = $1",
      [appointmentId],
    );

    // 3. تحرير المقعد (إرجاع is_booked إلى FALSE)
    await db.query(
      "UPDATE doctor_availability SET is_booked = FALSE WHERE available_id = $1",
      [appData.available_id],
    );

    // 4. إشعار الدكتور بالإلغاء
    await db.query(
      "INSERT INTO notifications (user_id, doctor_id, message) VALUES ($1, $2, $3)",
      [
        patientId,
        appData.staff_id,
        `Appointment cancelled by ${appData.patient_name}`,
      ],
    );

    // 5. 🪄 سحر قائمة الانتظار (Waiting List Trigger)
    const waitListQuery =
      "SELECT patient_id FROM waiting_list WHERE doctor_id = $1";
    const waitListResult = await db.query(waitListQuery, [appData.staff_id]);
    const io = req.app.get("io");

    if (waitListResult.rows.length > 0) {
      const formattedDate = new Date(
        appData.available_start_date,
      ).toLocaleDateString();
      const waitMsg = `A new slot opened up on ${formattedDate} at ${appData.available_start_time.slice(0, 5)}. Book now!`;

      for (let row of waitListResult.rows) {
        // نرسل إشعار لكل مريض عالانتظار (بنعكس الـ user_id لأنه هو المستقبل)
        await db.query(
          "INSERT INTO notifications (user_id, doctor_id, message) VALUES ($1, $2, $3)",
          [row.patient_id, appData.staff_id, waitMsg],
        );
        if (io) io.to(row.patient_id.toString()).emit("newNotification");
      }
    }

    if (io) io.to(appData.staff_id.toString()).emit("newNotification");

    await db.query("COMMIT");
    res.json({ message: "Appointment cancelled successfully." });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Cancel Error:", error);
    res.status(500).json({ error: "Server error during cancellation." });
  }
};
