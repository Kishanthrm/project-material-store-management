const pool = require("../../config/db");

const getStaffProfile = async (req, res) => {
  try {
    const staffId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
          st.staff_id,
          st.name AS staff_name,
          st.role AS designation,
          st.email,

          d.name AS department_name,

          sl.name AS special_lab_name,

          (
              SELECT COUNT(*)
              FROM student s
              WHERE s.speciallab_id = sl.speciallab_id
          ) AS number_of_students,

          (
              SELECT COUNT(*)
              FROM request r
              WHERE r.special_lab_id = sl.speciallab_id
          ) AS number_of_requests

      FROM staff st

      JOIN department d
          ON d.department_id = st.department_id

      LEFT JOIN special_lab sl
          ON sl.speciallab_incharge_id = st.staff_id

      WHERE st.staff_id = $1
      `,
      [staffId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getStaffProfile };
