const db = require("../config/db");

// 1. إضافة تعليق وإطلاق إشعارات السوكيت
exports.addComment = async (req, res) => {
  let { doctor_id, parent_comment_id, comment_text } = req.body;
  const patient_id = req.user.id;

  if (!comment_text || comment_text.trim() === "") {
    return res.status(400).json({ error: "Comment cannot be empty" });
  }

  try {
    const commenterResult = await db.query(
      "SELECT username FROM patients WHERE id = $1",
      [patient_id],
    );
    const commenterName = commenterResult.rows[0].username;
    const io = req.app.get("io");

    if (parent_comment_id) {
      const parentCommentResult = await db.query(
        "SELECT parent_comment_id, patient_id FROM doctor_comments WHERE comment_id = $1",
        [parent_comment_id],
      );

      let actual_parent_id = parent_comment_id;
      if (parentCommentResult.rows[0].parent_comment_id !== null) {
        actual_parent_id = parentCommentResult.rows[0].parent_comment_id;
      }

      if (parentCommentResult.rows[0].patient_id !== patient_id) {
        await db.query(
          "INSERT INTO notifications (user_id, message, doctor_id, comment_id) VALUES ($1, $2, $3, $4)",
          [
            parentCommentResult.rows[0].patient_id,
            `${commenterName} replied to your comment`,
            doctor_id,
            actual_parent_id,
          ],
        );
        if (io)
          io.to(parentCommentResult.rows[0].patient_id.toString()).emit(
            "newNotification",
          );
      }
      parent_comment_id = actual_parent_id;
    }

    const result = await db.query(
      "INSERT INTO doctor_comments (doctor_id, patient_id, parent_comment_id, comment_text) VALUES ($1, $2, $3, $4) RETURNING *",
      [doctor_id, patient_id, parent_comment_id, comment_text.trim()],
    );
    const newComment = result.rows[0];

    // إشعار الدكتور في حال كان تعليق رئيسي
    if (!parent_comment_id) {
      await db.query(
        "INSERT INTO notifications (user_id, doctor_id, message, comment_id) VALUES ($1, $2, $3, $4)",
        [
          patient_id,
          doctor_id,
          `${commenterName} left a new review on your profile`,
          newComment.comment_id,
        ],
      );
      if (io) {
        io.to(doctor_id.toString()).emit("newNotification");
        io.to(doctor_id).emit("newNotification");
      }
    }

    const patientResult = await db.query(
      "SELECT username, profile_image FROM patients WHERE id = $1",
      [patient_id],
    );
    newComment.username = patientResult.rows[0].username;
    newComment.profile_image = patientResult.rows[0].profile_image;

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// 2. جلب التعليقات
exports.getCommentsByDoctor = async (req, res) => {
  const { doctor_id } = req.params;
  try {
    if (!doctor_id) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    const result = await db.query(
      `WITH RECURSIVE comment_tree AS (
            SELECT dc.*, p.username, p.profile_image, 0 AS level
            FROM doctor_comments dc
            JOIN patients p ON dc.patient_id = p.id
            WHERE dc.doctor_id = $1 AND dc.parent_comment_id IS NULL

            UNION ALL

            SELECT dc.*, p.username, p.profile_image, ct.level + 1 AS level
            FROM doctor_comments dc
            JOIN patients p ON dc.patient_id = p.id
            JOIN comment_tree ct ON dc.parent_comment_id = ct.comment_id
          )
          SELECT * FROM comment_tree
          ORDER BY CASE WHEN parent_comment_id IS NULL THEN comment_id ELSE parent_comment_id END, level, created_at DESC`,
      [doctor_id],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching comments" });
  }
};

// 3. تعديل التعليق
exports.updateComment = async (req, res) => {
  const { comment_id } = req.params;
  const { comment_text } = req.body;
  const patient_id = req.user.id;

  if (!comment_text || comment_text.trim() === "") {
    return res.status(400).json({ error: "Comment text cannot be empty" });
  }

  try {
    const result = await db.query(
      "UPDATE doctor_comments SET comment_text = $1 WHERE comment_id = $2 AND patient_id = $3 RETURNING *",
      [comment_text.trim(), comment_id, patient_id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Comment not found or you do not have permission to edit it",
      });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the comment" });
  }
};

// 4. حذف التعليق والردود
exports.deleteComment = async (req, res) => {
  const { comment_id } = req.params;
  const patient_id = req.user.id;
  try {
    const checkResult = await db.query(
      "SELECT * FROM doctor_comments WHERE comment_id = $1 AND patient_id = $2",
      [comment_id, patient_id],
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: "Comment not found or you do not have permission to delete it",
      });
    }

    await db.query("DELETE FROM doctor_comments WHERE parent_comment_id = $1", [
      comment_id,
    ]);
    await db.query(
      "DELETE FROM doctor_comments WHERE comment_id = $1 AND patient_id = $2",
      [comment_id, patient_id],
    );

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the comment" });
  }
};

// 🔥 دالة جلب الإشعارات المعدلة لفتح كل أنواع الإشعارات للمريض والدكتور
exports.getNotifications = async (req, res) => {
  const userId = req.user.id;
  const userType = req.user.userType;

  try {
    let query = "";
    if (userType === "doctor") {
      // إشعارات الدكتور بناءً على الـ doctor_id
      query =
        "SELECT * FROM notifications WHERE doctor_id = $1 ORDER BY created_at DESC";
    } else {
      // 🔥 التعديل السحري: شلنا شرط LIKE '%replied%' عشان تظهر إشعارات الـ Waiting List وأي إشعار مستقبلي للمريض
      query =
        "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC";
    }

    const result = await db.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching notifications" });
  }
};

// 6. تعليم الإشعار كمقروء
exports.markNotificationAsRead = async (req, res) => {
  const { notification_id } = req.params;
  const userId = req.user.id;
  const userType = req.user.userType;

  try {
    let query = "";
    if (userType === "doctor") {
      query =
        "UPDATE notifications SET read = true WHERE id = $1 AND doctor_id = $2 RETURNING *";
    } else {
      query =
        "UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2 RETURNING *";
    }

    const result = await db.query(query, [notification_id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error marking as read:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};
