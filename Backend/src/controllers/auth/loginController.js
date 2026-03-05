const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../../config/db");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let userId = null;

    if (user.role === "student") {
      userId = user.student_id;
    }

    if (user.role === "lab_incharge" || user.role === "store_admin") {
      userId = user.staff_id;
    }

    const token = jwt.sign(
      {
        id: userId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      token,
      role: user.role,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};