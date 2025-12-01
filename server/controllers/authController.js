const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "fcdbb_fallback_secret_key";

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await db.execute(
      `SELECT u.*, p.name as player_name, p.image_url as player_image
       FROM users u
       LEFT JOIN players p ON u.player_id = p.id
       WHERE u.username = ?`,
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Username does not exist",
      });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        playerId: user.player_id,
      },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name || user.player_name,
        role: user.role,
        playerId: user.player_id,
        avatar: user.avatar || user.player_image,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.register = async (req, res) => {
  const { username, password, displayName, playerId } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [result] = await db.execute(
      `INSERT INTO users (username, password, display_name, player_id, role)
       VALUES (?, ?, ?, ?, 'player')`,
      [username, passwordHash, displayName, playerId || null]
    );

    res.json({
      success: true,
      message: "Registration successful",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Register Error:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.seedAdmins = async () => {
  console.log("Checking admin users...");
};
