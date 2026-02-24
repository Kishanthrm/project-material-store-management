const pool = require("../../config/db");

// Get Pending Requests
const getPendingRequests = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        r.id,
        e.name AS event_name,
        r.status,
        r.request_time AS time,
        COUNT(rm.id) AS materials_count,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'material_name', m.name,
            'quantity', rm.quantity
          )
        ) FILTER (WHERE m.id IS NOT NULL) AS materials_list
      FROM request r
      JOIN event e ON e.id = r.event_id
      LEFT JOIN request_material rm ON rm.request_id = r.id
      LEFT JOIN material m ON m.id = rm.material_id
      WHERE r.status IN ('PENDING', 'STAFF_APPROVED','APPROVED')
        AND r.student_id = $1   
      GROUP BY r.id, e.name, r.status, r.request_time
      ORDER BY r.request_time DESC
    `, [id]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get Completed Requests
const getCompletedRequests = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        r.id,
        e.name AS event_name,
        r.status,
        r.request_time AS time,
        COUNT(rm.id) AS materials_count,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'material_name', m.name,
            'quantity', rm.quantity
          )
        ) FILTER (WHERE m.id IS NOT NULL) AS materials_list
      FROM request r
      JOIN event e ON e.id = r.event_id
      LEFT JOIN request_material rm ON rm.request_id = r.id
      LEFT JOIN material m ON m.id = rm.material_id
      WHERE r.status = 'ISSUED'
        AND r.student_id = $1   
      GROUP BY r.id, e.name, r.status, r.request_time
      ORDER BY r.request_time DESC
    `, [id]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRequest = async (req, res) => {
  const { student_id, special_lab_id, event_id, materials } = req.body;

  try {
    await pool.query("BEGIN");

    const requestResult = await pool.query(
      `INSERT INTO request 
       (student_id, special_lab_id, request_time, status, event_id)
       VALUES ($1, $2, NOW(), 'PENDING', $3)
       RETURNING id`,
      [student_id, special_lab_id, event_id]
    );

    const requestId = requestResult.rows[0].id;

    for (let item of materials) {
      await pool.query(
        `INSERT INTO request_material
         (request_id, material_id, quantity)
         VALUES ($1, $2, $3)`,
        [requestId, item.material_id, item.quantity]
      );
    }

    await pool.query("COMMIT");

    res.status(201).json({ message: "Request created successfully" });

  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPendingRequests,
  getCompletedRequests,
  createRequest,
};
