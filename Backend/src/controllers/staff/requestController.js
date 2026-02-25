const pool = require("../../config/db");

const sendEmail = require("../../emailService");
const requestApprovalTemplate = require("../../templates/requestApprovalTemplate");

/* ================= GET PENDING REQUESTS ================= */
const getPendingRequests = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        r.id,
        s.name AS student_name,
        e.name AS event_name,
        r.status,
        r.request_time,
        
        COUNT(rm.id) AS materials_count,

        JSON_AGG(
          JSON_BUILD_OBJECT(
            'material_name', m.name,
            'quantity', rm.quantity
          )
        ) FILTER (WHERE m.id IS NOT NULL) AS materials_list

      FROM request r

      JOIN student s 
        ON s.student_id = r.student_id

      JOIN event e 
        ON e.id = r.event_id

      JOIN special_lab sl
        ON sl.speciallab_id = r.special_lab_id

      LEFT JOIN request_material rm
        ON rm.request_id = r.id

      LEFT JOIN material m
        ON m.id = rm.material_id

      WHERE r.status = 'PENDING'
        AND sl.speciallab_incharge_id = $1

      GROUP BY 
        r.id,
        s.name,
        e.name,
        r.status,
        r.request_time

      ORDER BY r.request_time DESC
      `,
      [id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET COMPLETED REQUESTS ================= */
const getCompletedRequests = async (req, res) => {
  const { id } = req.params; // staff_id

  try {
    const result = await pool.query(
      `
      SELECT 
        r.id,
        s.name AS student_name,
        e.name AS event_name,
        r.status,
        r.request_time,

        COUNT(rm.id) AS materials_count,

        MAX(rm.lab_incharge_remarks) AS lab_incharge_remarks,

        JSON_AGG(
          JSON_BUILD_OBJECT(
            'material_name', m.name,
            'quantity', rm.quantity
          )
        ) FILTER (WHERE m.id IS NOT NULL) AS materials_list

      FROM request r

      JOIN student s 
        ON s.student_id = r.student_id

      JOIN event e 
        ON e.id = r.event_id

      JOIN special_lab sl
        ON sl.speciallab_id = r.special_lab_id

      LEFT JOIN request_material rm
        ON rm.request_id = r.id

      LEFT JOIN material m
        ON m.id = rm.material_id

      WHERE r.status IN ('STAFF_APPROVED', 'REJECTED')
        AND sl.speciallab_incharge_id = $1

      GROUP BY 
        r.id,
        s.name,
        e.name,
        r.status,
        r.request_time

      ORDER BY r.request_time DESC
      `,
      [id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  try {
    await pool.query("BEGIN");

    // Update request status
    await pool.query(
      `
      UPDATE request
      SET status = $1
      WHERE id = $2
      `,
      [status, id],
    );

    // Save remarks in request_material (optional)
    if (remarks) {
      await pool.query(
        `
        UPDATE request_material
        SET lab_incharge_remarks = $1
        WHERE request_id = $2
        `,
        [remarks, id],
      );
    }

    await pool.query("COMMIT");

    const io = req.app.get("io");

    const studentResult = await pool.query(
      `SELECT student_id FROM request WHERE id = $1`,
      [id],
    );

    const studentId = studentResult.rows[0].student_id;

    io.to(studentId.toString()).emit("requestStatusUpdated", {
      requestId: id,
      status: status,
    });

    //io.to(roomName) → send only to that room
    // .emit(eventName, data) → send event
    // Event name: "requestStatusUpdated"
    // Data sent:
    // {
    //   requestId: id,
    //   status: status
    // }

    /* ================= EMAIL SECTION ================= */
    if (status === "STAFF_APPROVED" || status === "REJECTED") {
      const emailResult = await pool.query(
        `
    SELECT s.email
    FROM request r
    JOIN student s ON r.student_id = s.student_id
    WHERE r.id = $1
    `,
        [id],
      );

      if (emailResult.rows.length > 0) {
        const studentEmail = emailResult.rows[0].email;

        sendEmail({
          to: studentEmail,
          subject:
            status === "STAFF_APPROVED"
              ? "Request Approved by Staff"
              : "Request Rejected by Staff",
          html: requestApprovalTemplate({
            role: "staff",
            status,
            requestId: id,
            remarks: remarks || "No remarks provided",
          }),
        });
      }
    }

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPendingRequests,
  getCompletedRequests,
  updateRequestStatus,
};
