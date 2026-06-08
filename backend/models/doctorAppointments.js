const db = require("../config/db");

const getDoctorAppointments = async (staffId) => {
  const query = `
    SELECT 
      a.appointment_id, 
      da.available_start_date,
      da.available_end_date,
      da.available_start_time,
      da.available_end_time,
      p.username AS patient_name,
      p.id AS patient_id,
      a.status,
      a.is_done,
      a.appointment_type -- 🔥 الحلقة المفقودة: جلب نوع الموعد
    FROM appointments a
    JOIN doctor_availability da ON a.available_id = da.available_id
    JOIN patients p ON a.id = p.id
    WHERE da.staff_id = $1 AND a.status = 'SCHEDULED'
    ORDER BY da.available_start_date, da.available_start_time
  `;
  const { rows } = await db.query(query, [staffId]);
  return rows;
};

const getAppointmentsCount = async (staffId) => {
  const query = `
    SELECT COUNT(*) 
    FROM appointments a
    JOIN doctor_availability da ON a.available_id = da.available_id
    WHERE da.staff_id = $1 
    AND a.status != 'CANCELLED' 
    AND a.is_deleted = FALSE
  `;
  const { rows } = await db.query(query, [staffId]);
  return parseInt(rows[0].count);
};

const getTodayDoctorAppointments = async (staffId) => {
  const query = `
    SELECT 
      a.appointment_id, 
      da.available_start_time,
      da.available_end_time,
      p.username AS patient_name,
      p.id AS patient_id,
      a.status,
      a.is_done,
      a.appointment_type -- 🔥 الحلقة المفقودة هنا أيضاً
    FROM appointments a
    JOIN doctor_availability da ON a.available_id = da.available_id
    JOIN patients p ON a.id = p.id
    WHERE 
      da.staff_id = $1 
      AND da.available_start_date = CURRENT_DATE
      AND a.status != 'CANCELLED'
      AND a.is_deleted = FALSE
    ORDER BY da.available_start_time
  `;
  const { rows } = await db.query(query, [staffId]);
  return rows;
};

const getTodayAppointmentsCount = async (staffId) => {
  const query = `
    SELECT COUNT(*) 
    FROM appointments a
    JOIN doctor_availability da ON a.available_id = da.available_id
    WHERE da.staff_id = $1 AND da.available_start_date = CURRENT_DATE
  `;
  const { rows } = await db.query(query, [staffId]);
  return parseInt(rows[0].count);
};

const getTodayScheduledAppointmentsCount = async (staffId) => {
  const query = `
    SELECT COUNT(*) 
    FROM appointments a
    JOIN doctor_availability da ON a.available_id = da.available_id
    WHERE da.staff_id = $1 AND a.status = 'SCHEDULED'
    AND da.available_start_date = CURRENT_DATE
  `;
  const { rows } = await db.query(query, [staffId]);
  return parseInt(rows[0].count);
};

const getWeeklyAppointmentsData = async (staffId) => {
  const query = `
    SELECT 
      DATE_TRUNC('day', da.available_start_date) AS day,
      COUNT(*) AS count,
      -- 🔥 سحر الـ SQL: فصل الأرقام للرسم البياني بناءً على النوع
      SUM(CASE WHEN a.appointment_type = 'ONLINE' OR a.appointment_type IS NULL THEN 1 ELSE 0 END) as "onlineCount",
      SUM(CASE WHEN a.appointment_type = 'IN_CLINIC' THEN 1 ELSE 0 END) as "clinicCount"
    FROM appointments a
    JOIN doctor_availability da ON a.available_id = da.available_id
    WHERE 
      da.staff_id = $1 
      AND da.available_start_date >= DATE_TRUNC('week', CURRENT_DATE)
      AND da.available_start_date < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
      AND a.status != 'CANCELLED' -- 🔥 هذا السطر الأول لمنع حساب الملغى
      AND a.is_deleted = FALSE    -- 🔥 وهذا السطر الثاني
    GROUP BY DATE_TRUNC('day', da.available_start_date)
    ORDER BY day
  `;
  const { rows } = await db.query(query, [staffId]);
  return rows;
};

const updateAppointmentStatus = async (appointmentId, isDone) => {
  const query = `
    UPDATE appointments
    SET is_done = $1, status = CASE WHEN $1 THEN 'COMPLETED'::appointment_status_enum ELSE 'SCHEDULED'::appointment_status_enum END
    WHERE appointment_id = $2
    RETURNING *
  `;
  const { rows } = await db.query(query, [isDone, appointmentId]);
  return rows[0];
};

const addHealthcareRecord = async (
  patientId,
  staffId,
  diagnosis,
  drugs,
  treatmentPlan,
) => {
  const query = `
    INSERT INTO healthcare_records (id, staff_id, diagnosis, drugs, treatment_plan)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const { rows } = await db.query(query, [
    patientId,
    staffId,
    diagnosis,
    drugs,
    treatmentPlan,
  ]);
  return rows[0];
};

const getPatientRecords = async (staffId) => {
  const query = `
    SELECT 
      p.id          AS patient_id,
      p.username,
      p.email,
      p.gender,
      p.dob,
      p.blood_type,
      p.haveallergy,
      p.chronic_diseases,
      p.profile_image,
      p.is_approved,
      hr.record_id,
      hr.diagnosis,
      hr.drugs,
      hr.treatment_plan,
      hr.tests,
      hr.rays,
      hr.instructions,
      hr.created_at,
      hr.is_deleted  AS record_deleted
    FROM patients p
    JOIN appointments a ON p.id = a.id
    LEFT JOIN healthcare_records hr 
      ON p.id = hr.id 
      AND hr.is_deleted = FALSE
    WHERE 
      a.status = 'COMPLETED' 
      AND a.is_done = TRUE
      AND EXISTS (
        SELECT 1 FROM doctor_availability da 
        WHERE da.available_id = a.available_id 
          AND da.staff_id = $1
      )
    GROUP BY 
      p.id, p.username, p.email, p.gender, p.dob,
      p.blood_type, p.haveallergy, p.chronic_diseases,
      p.profile_image, p.is_approved,
      hr.record_id, hr.diagnosis, hr.drugs, hr.treatment_plan,
      hr.tests, hr.rays, hr.instructions, hr.created_at, hr.is_deleted
    ORDER BY p.id, hr.created_at DESC
  `;
  const { rows } = await db.query(query, [staffId]);
  return rows;
};

const HealthcareRecord = {
  softDelete: async (recordId) => {
    try {
      await db.query(
        "UPDATE healthcare_records SET is_deleted = TRUE WHERE record_id = $1",
        [recordId],
      );
      return { message: "Record soft deleted successfully." };
    } catch (error) {
      console.error("Error in softDelete:", error);
      throw new Error("Error deleting the record.");
    }
  },

  updateRecord: async (recordId, updates) => {
    const { diagnosis, drugs, treatment_plan } = updates;
    try {
      const result = await db.query(
        `UPDATE healthcare_records
         SET diagnosis = $1, drugs = $2, treatment_plan = $3
         WHERE record_id = $4 AND is_deleted = FALSE`,
        [diagnosis, drugs, treatment_plan, recordId],
      );
      if (result.rowCount === 0) {
        throw new Error("No record found or record is deleted.");
      }
      return { message: "Record updated successfully." };
    } catch (error) {
      console.error("Error in updateRecord:", error);
      throw new Error("Error updating the record.");
    }
  },
};

const Patient = {
  updatePatientInfo: async (patientId, updates) => {
    const { chronic_diseases, blood_type, haveallergy } = updates;
    const sanitize = (val) =>
      val === "null" || val === "" || val === undefined ? null : val;

    return await db.query(
      `UPDATE patients
       SET chronic_diseases = $1, blood_type = $2, haveAllergy = $3
       WHERE id = $4`,
      [
        sanitize(chronic_diseases),
        sanitize(blood_type),
        sanitize(haveallergy),
        patientId,
      ],
    );
  },
};

module.exports = {
  getDoctorAppointments,
  getAppointmentsCount,
  getTodayDoctorAppointments,
  getTodayAppointmentsCount,
  updateAppointmentStatus,
  addHealthcareRecord,
  getPatientRecords,
  HealthcareRecord,
  Patient,
  getTodayScheduledAppointmentsCount,
  getWeeklyAppointmentsData,
};
