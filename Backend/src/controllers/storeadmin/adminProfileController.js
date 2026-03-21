const pool = require("../../config/db");

exports.getAdminDashboardDetails = async (req, res) => {
  try {
    // Get Store Admin Profile
    const profileQuery = `
      SELECT 
        staff_id,
        name,
        role,
        email
      FROM staff
      WHERE role = 'STORE_ADMIN'
      LIMIT 1
    `;

    const profileResult = await pool.query(profileQuery);

    if (profileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store Admin not found",
      });
    }

    const adminId = profileResult.rows[0].staff_id;

    // Total Requests Handled
    const totalQuery = `
      SELECT COUNT(*) FROM request;
    `;

    const totalResult = await pool.query(totalQuery);

    // Pending Deliveries
    const pendingQuery = `
      SELECT COUNT(*)
      FROM request
      WHERE status IN ('APPROVED', 'STAFF_APPROVED');
    `;

    const pendingResult = await pool.query(pendingQuery);

    const profile = profileResult.rows[0];

    res.status(200).json({
      success: true,
      data: {
        name: profile.name,
        employee_id: profile.staff_id,
        role: profile.role,
        email: profile.email,
        total_requests: totalResult.rows[0].count,
        pending_deliveries: pendingResult.rows[0].count,
      },
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
