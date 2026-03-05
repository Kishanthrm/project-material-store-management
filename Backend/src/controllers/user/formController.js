const pool = require("../../config/db");

const getStudentById = async (req, res) => {
  const id = req.user.id; 

  try {
    const result = await pool.query(
      `
      SELECT 
        s.student_id,
        s.name,
        s.reg_no,
        s.year,
        s.semester,
        d.name AS department_name,
        sl.speciallab_id,
        sl.name AS special_lab_name
      FROM student s
      JOIN department d ON d.department_id = s.department_id
      JOIN special_lab sl ON sl.speciallab_id = s.speciallab_id
      WHERE s.student_id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

// ================= GET EVENTS =================
const getEvents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name
      FROM event
      ORDER BY name ASC
    `);

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// ================= GET MATERIALS =================
const getMaterials = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name
      FROM material
      ORDER BY name ASC
    `);

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};

module.exports = {
  getEvents,
  getMaterials,
  getStudentById,
};
