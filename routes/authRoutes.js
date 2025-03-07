const express = require("express");
const {
  register,
  login,
  googleAuth,
  getLoggedInUser,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/google", googleAuth);
router.get("/me", getLoggedInUser);

module.exports = router;
