const express = require("express");
const router = express.Router();
const controller = require("../controllers/traitController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, controller.getCustomTraits);
router.post("/", verifyToken, isAdmin, controller.createCustomTrait);

module.exports = router;
