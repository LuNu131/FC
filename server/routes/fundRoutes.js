const express = require("express");
const router = express.Router();
const controller = require("../controllers/fundController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Ai cũng xem được
router.get("/", verifyToken, controller.getAllFunds);

// Chỉ Admin được tạo và xóa
router.post("/", verifyToken, isAdmin, controller.createFund);
router.delete("/:id", verifyToken, isAdmin, controller.deleteFund);

module.exports = router;
