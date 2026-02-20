const pool = require("../../config/db");

/* ================= GET ALL MATERIALS ================= */
const getAllMaterials = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        code,
        category
      FROM material
      ORDER BY name ASC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};

module.exports = { getAllMaterials };
