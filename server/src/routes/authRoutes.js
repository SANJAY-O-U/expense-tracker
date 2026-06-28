const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many requests, try again later" },
});

router.post("/register", limiter, register);
router.post("/login", limiter, login);

module.exports = router;