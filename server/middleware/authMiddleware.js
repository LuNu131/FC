const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load env

// Fix: Lấy key từ .env
const SECRET_KEY = process.env.JWT_SECRET || "fcdbb_fallback_secret_key";

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "⛔ Truy cập bị từ chối! Thiếu Token.",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Token Error:", err.message);
      // Trả về 401 chuẩn để Frontend tự logout
      return res
        .status(401)
        .json({ success: false, message: "⚠️ Phiên đăng nhập hết hạn!" });
    }
    req.user = decoded;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "🚫 Chỉ dành cho Quản lý (Admin)!" });
  }
  next();
};
