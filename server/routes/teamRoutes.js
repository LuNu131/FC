const express = require("express");
const router = express.Router();
const controller = require("../controllers/teamController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Sửa controller.getAllTeams -> controller.getTeamsWithMembers
router.get("/", verifyToken, controller.getTeamsWithMembers);

// Route cập nhật thành viên (Admin)
router.post("/members", verifyToken, isAdmin, controller.updateTeamMembers); // Lưu ý: Hàm này cần có trong controller nếu bạn dùng tính năng chia lại đội

module.exports = router;
