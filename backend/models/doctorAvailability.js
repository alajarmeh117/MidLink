const db = require("../config/db");

const generateTimeSlots = (startTime, endTime) => {
  const slots = [];
  let current = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);

  while (current < end) {
    const slotStart = current.toTimeString().substring(0, 5);
    const next = new Date(current.getTime() + 30 * 60000);
    if (next > end) break;
    const slotEnd = next.toTimeString().substring(0, 5);
    slots.push({ start: slotStart, end: slotEnd });
    current = next;
  }
  return slots;
};

const DoctorAvailability = {
  // 🔥 1. إضافة المواعيد (تم إضافة slotType لاستقبال النوع من الكنترولر)
  setAvailability: async (
    staffId,
    availableStartDate,
    availableEndDate,
    startTime,
    endTime,
    slotType, // 👈 استقبلنا نوع الدوام
  ) => {
    const start = new Date(availableStartDate);
    const end = availableEndDate
      ? new Date(availableEndDate)
      : new Date(availableStartDate);
    const insertedRows = [];
    const timeSlots = generateTimeSlots(startTime, endTime);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const currentDateStr = `${year}-${month}-${day}`;

      for (const slot of timeSlots) {
        const checkQuery = `
          SELECT available_id, is_deleted 
          FROM doctor_availability 
          WHERE staff_id = $1 AND available_start_date = $2 AND available_start_time = $3
        `;
        const checkRes = await db.query(checkQuery, [
          staffId,
          currentDateStr,
          slot.start,
        ]);

        if (checkRes.rows.length > 0) {
          const existingSlot = checkRes.rows[0];
          if (existingSlot.is_deleted) {
            // 🧟‍♂️ إحياء الموعد المحذوف مع تحديث نوعه الجديد
            const updateQuery = `
              UPDATE doctor_availability 
              SET is_deleted = FALSE, is_booked = FALSE, available_end_time = $1, slot_type = $3
              WHERE available_id = $2 RETURNING *
            `;
            const result = await db.query(updateQuery, [
              slot.end,
              existingSlot.available_id,
              slotType || "ONLINE", // 👈 تحديث النوع
            ]);
            insertedRows.push(result.rows[0]);
          }
        } else {
          // 🆕 موعد جديد كلياً (تم إضافة slot_type لجملة الإدخال)
          const insertQuery = `
            INSERT INTO doctor_availability
            (staff_id, available_start_date, available_end_date, available_start_time, available_end_time, is_deleted, is_booked, slot_type)
            VALUES ($1, $2, NULL, $3, $4, FALSE, FALSE, $5)
            RETURNING *
          `;
          const result = await db.query(insertQuery, [
            staffId,
            currentDateStr,
            slot.start,
            slot.end,
            slotType || "ONLINE", // 👈 إدخال النوع
          ]);
          insertedRows.push(result.rows[0]);
        }
      }
    }
    return insertedRows;
  },

  // 3. جلب المواعيد (تم إضافة جلب عمود slot_type ليرسل للفرونت-إند)
  getDoctorAvailabilities: async (staffId) => {
    const query = `
      SELECT da.available_id, ms.staff_name, da.available_start_date, da.available_start_time, da.available_end_time, da.is_booked, da.slot_type
      FROM doctor_availability da
      JOIN medical_staff ms ON da.staff_id = ms.staff_id
      WHERE da.staff_id = $1 AND da.is_deleted = FALSE
      ORDER BY da.available_start_date, da.available_start_time
    `;
    const result = await db.query(query, [staffId]);
    return result.rows;
  },

  // 4. التحديث
  updateAvailability: async (availableId, staffId, updatedData) => {
    const { availableStartDate, availableEndDate, startTime, endTime } =
      updatedData;
    const start = new Date(availableStartDate);
    const end = availableEndDate
      ? new Date(availableEndDate)
      : new Date(availableStartDate);
    const timeSlots = generateTimeSlots(startTime, endTime);
    if (timeSlots.length === 0) return null;

    const y1 = start.getFullYear();
    const m1 = String(start.getMonth() + 1).padStart(2, "0");
    const d1 = String(start.getDate()).padStart(2, "0");
    const firstDateStr = `${y1}-${m1}-${d1}`;

    const firstSlot = timeSlots[0];
    const updateQuery = `
      UPDATE doctor_availability SET available_start_date = $1, available_end_date = NULL, available_start_time = $2, available_end_time = $3
      WHERE available_id = $4 AND staff_id = $5 AND is_deleted = FALSE RETURNING *
    `;
    const updateResult = await db.query(updateQuery, [
      firstDateStr,
      firstSlot.start,
      firstSlot.end,
      availableId,
      staffId,
    ]);
    if (updateResult.rows.length === 0) return null;

    for (let i = 1; i < timeSlots.length; i++) {
      await db.query(
        `INSERT INTO doctor_availability (staff_id, available_start_date, available_end_date, available_start_time, available_end_time, is_deleted, is_booked) VALUES ($1, $2, NULL, $3, $4, FALSE, FALSE)`,
        [staffId, firstDateStr, timeSlots[i].start, timeSlots[i].end],
      );
    }
    return updateResult.rows[0];
  },

  // 5. الحذف الوهمي (Soft Delete)
  softDeleteAvailability: async (availableId, staffId) => {
    const query = `UPDATE doctor_availability SET is_deleted = TRUE WHERE available_id = $1 AND staff_id = $2 AND is_deleted = FALSE RETURNING *`;
    const result = await db.query(query, [availableId, staffId]);
    return result.rows[0];
  },

  // 6. جلب المرضى المحجوزين
  getBookedPatientsForSlot: async (availableId) => {
    const query = `
      SELECT p.email AS patient_email, p.username AS patient_name, ms.staff_name AS doctor_name, da.available_start_date AS appointment_date, da.available_start_time AS appointment_time
      FROM appointments a JOIN patients p ON a.id = p.id JOIN doctor_availability da ON a.available_id = da.available_id JOIN medical_staff ms ON da.staff_id = ms.staff_id
      WHERE a.available_id = $1 AND a.status = 'SCHEDULED' AND a.is_deleted = FALSE
    `;
    const result = await db.query(query, [availableId]);
    return result.rows;
  },

  // 7. إلغاء الحجوزات المرتبطة
  cancelAppointmentsForSlot: async (availableId) => {
    const query = `UPDATE appointments SET status = 'CANCELLED', is_deleted = TRUE WHERE available_id = $1 AND status = 'SCHEDULED' RETURNING *`;
    const result = await db.query(query, [availableId]);
    return result.rows;
  },

  // 8. الإنهاء التلقائي
  autoCompleteExpiredAppointments: async () => {
    const query = `
      UPDATE appointments SET status = 'COMPLETED', is_done = TRUE
      WHERE status = 'SCHEDULED' AND is_deleted = FALSE AND available_id IN (
        SELECT available_id FROM doctor_availability WHERE (available_start_date < CURRENT_DATE OR (available_start_date = CURRENT_DATE AND available_end_time < CURRENT_TIME)) AND is_deleted = FALSE
      ) RETURNING appointment_id
    `;
    const result = await db.query(query);
    return result.rows;
  },
};

module.exports = DoctorAvailability;
