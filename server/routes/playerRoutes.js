const express = require("express");
const router = express.Router();
const controller = require("../controllers/playerController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, controller.getAllPlayers);
router.get("/:id", verifyToken, controller.getPlayerById);

// Admin Only
router.post("/", verifyToken, isAdmin, controller.createPlayer);
router.put("/:id", verifyToken, isAdmin, controller.updatePlayer);
router.delete("/:id", verifyToken, isAdmin, controller.deletePlayer);

module.exports = router;
