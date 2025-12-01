const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "fcdbb_fallback_secret_key";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      playerId: decoded.playerId,
    };

    next();
  });
};

const isAdmin = async (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }

  res.status(403).json({ message: "Admin access required" });
};

module.exports = { authenticateToken, isAdmin };
