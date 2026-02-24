const pool = require("../../config/db");

// ==========================================
// Get Pending Requests (For Store)
// ==========================================
exports.getPendingRequests = async (req, res) => {
  try {
    const query = `
      SELECT 
    r.id,
    e.name AS event_name,
    r.request_time,
    r.status,
    s.name AS student_name,
    json_agg(
      json_build_object(
        'material_id', m.id,
        'material_name', m.name,
        'requested_qty', rm.quantity
      )
    ) AS materials_list
  FROM request r
  JOIN student s ON r.student_id = s.student_id
  JOIN event e ON r.event_id = e.id
  JOIN request_material rm ON r.id = rm.request_id
  JOIN material m ON rm.material_id = m.id
  WHERE r.status IN ('STAFF_APPROVED','APPROVED')
  GROUP BY r.id, e.name, r.request_time, r.status, s.name
  ORDER BY r.request_time DESC
    `;

    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
//  Get Completed Requests
// ==========================================
exports.getCompletedRequests = async (req, res) => {
  try {
    const query = `
      SELECT 
    r.id,
    e.name AS event_name,
    r.request_time,
    r.status,
    r.delivery_date,
    s.name AS student_name,
    rm.store_remarks,
    json_agg(
      json_build_object(
        'material_name', m.name,
        'requested_qty', rm.quantity
      )
    ) AS materials_list
  FROM request r
  JOIN student s ON r.student_id = s.student_id
  JOIN event e ON r.event_id = e.id
  JOIN request_material rm ON r.id = rm.request_id
  JOIN material m ON rm.material_id = m.id
  WHERE r.status IN ('ISSUED', 'REJECTED')
  GROUP BY r.id, e.name, r.request_time, r.status, 
           r.delivery_date, s.name, rm.store_remarks
  ORDER BY r.request_time DESC
    `;

    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching completed requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// Update Request Status (Approve/Issue/Reject)
// ==========================================
exports.updateRequestStatus = async (req, res) => {
  const client = await pool.connect();

  try {
    const { requestId } = req.params;
    const { status, remarks, deliveryDate } = req.body;

    await client.query("BEGIN");

    // 🔵 APPROVED → Save delivery date
    if (status === "APPROVED") {
      if (!deliveryDate) {
        throw new Error("Delivery date is required before approval");
      }

      await client.query(
        `
        UPDATE request
        SET status = 'APPROVED',
            delivery_date = $1
        WHERE id = $2
        `,
        [deliveryDate, requestId]
      );
    }

    // 🟢 ISSUED
    if (status === "ISSUED") {

      const materials = await client.query(
        `
        SELECT material_id, quantity
        FROM request_material
        WHERE request_id = $1
        `,
        [requestId]
      );

      for (let item of materials.rows) {
        await client.query(
          `
          UPDATE material
          SET quantity = quantity - $1
          WHERE id = $2
          `,
          [item.quantity, item.material_id]
        );
      }

      await client.query(
        `
        UPDATE request
        SET status = 'ISSUED'
        WHERE id = $1
        `,
        [requestId]
      );
    }

    // 🔴 REJECTED
    if (status === "REJECTED") {
      await client.query(
        `
        UPDATE request
        SET status = 'REJECTED'
        WHERE id = $1
        `,
        [requestId]
      );
    }

    // Save store remarks
    await client.query(
      `
      UPDATE request_material
      SET store_remarks = $1
      WHERE request_id = $2
      `,
      [remarks, requestId]
    );

    await client.query("COMMIT");

    res.status(200).json({ message: "Updated successfully" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};
