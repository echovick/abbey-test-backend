const { Post, Like, User } = require("../models");
const { body, validationResult } = require("express-validator");

exports.createPost = [
  body("content").notEmpty().withMessage("Content is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        data: errors.array(),
      });
    }

    try {
      const post = await Post.create({
        userId: req.user.id,
        content: req.body.content,
      });
      res
        .status(201)
        .json({ success: true, message: "Post created", data: post });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: err.message, data: null });
    }
  },
];

exports.likePost = async (req, res) => {
  try {
    const like = await Like.findOne({
      where: { userId: req.user.id, postId: req.params.id },
    });
    if (like) {
      await like.destroy();
      return res.json({ success: true, message: "Post unliked", data: null });
    }
    await Like.create({ userId: req.user.id, postId: req.params.id });
    res.json({ success: true, message: "Post liked", data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.params.userId },
      include: [
        { model: Like, as: "likes" },
        { model: Post, as: "replies" },
        { model: User, as: "user" },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, message: "User posts retrieved", data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
};

exports.getLoggedInUserPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Like, as: "likes" },
        { model: Post, as: "replies" },
        { model: User, as: "user" },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({
      success: true,
      message: "Logged-in user posts retrieved",
      data: posts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: Like, as: "likes" },
        { model: Post, as: "replies" },
        { model: User, as: "user" },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, message: "Feed retrieved", data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
};
