const express = require("express");
const { login, protectedRoute } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/protected", authMiddleware, protectedRoute);

module.exports = router;