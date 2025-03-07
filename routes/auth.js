const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// User Registration
router.post("/register", authController.register);

// User Login
router.post("/login", authController.login);

// Google OAuth
router.get("/auth/google", authController.googleAuth);
router.get("/auth/google/callback", authController.googleAuthCallback);

module.exports = router;
