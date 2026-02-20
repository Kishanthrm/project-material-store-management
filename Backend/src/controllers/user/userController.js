const pool = require("../../config/db");

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
          s.student_id,
          s.name,
          s.reg_no,
          s.year,
          s.semester,
          d.name AS department_name,
          sl.name AS lab_name,
          st.name AS lab_incharge_name,
          COUNT(r.id) AS total_requests
      FROM student s
      JOIN department d 
          ON s.department_id = d.department_id
      JOIN special_lab sl 
          ON s.speciallab_id = sl.speciallab_id
      LEFT JOIN staff st 
          ON sl.speciallab_incharge_id = st.staff_id
      LEFT JOIN request r 
          ON s.student_id = r.student_id
      WHERE s.student_id = $1
      GROUP BY 
          s.student_id,
          s.name,
          s.reg_no,
          s.year,
          s.semester,
          d.name,
          sl.name,
          st.name`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getUserProfile };
