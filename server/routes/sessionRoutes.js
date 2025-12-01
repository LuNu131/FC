const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessionController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// 1. Ai cũng xem được danh sách
router.get("/", verifyToken, controller.getAllSessions);

// 2. ⭐ API LẤY VERIFY OPTIONS (THIẾU NÀY SẼ LỖI FRONTEND)
router.get("/verify-options", verifyToken, controller.getVerifyOptions);

// 3. Cầu thủ tự điểm danh
router.post("/check-in", verifyToken, controller.selfCheckIn);

// --- ADMIN ROUTES ---
router.post("/", verifyToken, isAdmin, controller.createSession);
router.delete("/:id", verifyToken, isAdmin, controller.deleteSession);
router.put("/:id/status", verifyToken, isAdmin, controller.updateSessionStatus);
router.post("/admin/checkin", verifyToken, isAdmin, controller.adminCheckIn);
router.post(
  "/admin/remove",
  verifyToken,
  isAdmin,
  controller.adminRemoveCheckIn
);

module.exports = router;
