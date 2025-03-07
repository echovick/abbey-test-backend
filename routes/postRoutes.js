const express = require("express");
const {
  createPost,
  likePost,
  getUserPosts,
  getLoggedInUserPosts,
  getFeed,
} = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createPost);
router.post("/:id/like", authMiddleware, likePost);
router.get("/user/:userId", authMiddleware, getUserPosts);
router.get("/", authMiddleware, getLoggedInUserPosts);
router.get("/feed", authMiddleware, getFeed);

module.exports = router;
