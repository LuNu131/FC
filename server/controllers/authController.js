const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "fcdbb_fallback_secret_key";

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const { data: users, error } = await supabase
      .from("users")
      .select(
        `
        *,
        players:player_id (
          id,
          name,
          image_url
        )
      `
      )
      .eq("username", username)
      .maybeSingle();

    if (error) throw error;
    if (!users) {
      return res.status(401).json({
        success: false,
        message: "Username does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, users.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        userId: users.id,
        role: users.role,
        playerId: users.player_id,
      },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: users.id,
        username: users.username,
        displayName: users.display_name || users.players?.name,
        role: users.role,
        playerId: users.player_id,
        avatar: users.avatar || users.players?.image_url,
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

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username,
          password: passwordHash,
          display_name: displayName,
          player_id: playerId || null,
          role: "player",
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: "Registration successful",
      userId: data.id,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.seedAdmins = async () => {
  console.log("Checking admin users...");
};
