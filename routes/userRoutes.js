const express = require("express");
const {
  getProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowed,
  getUserFollowers,
  getUserFollowed,
  updateProfile,
  changePassword,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/:id", getProfile);
router.post("/:id/follow", authMiddleware, followUser);
router.post("/:id/unfollow", authMiddleware, unfollowUser);
router.get("/me/followers", authMiddleware, getFollowers);
router.get("/me/followed", authMiddleware, getFollowed);
router.get("/:id/followers", authMiddleware, getUserFollowers);
router.get("/:id/followed", authMiddleware, getUserFollowed);
router.put("/me/profile", authMiddleware, updateProfile);
router.put("/me/change-password", authMiddleware, changePassword);

module.exports = router;
