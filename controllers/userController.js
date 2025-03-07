const { User, Follower, UserProfile } = require("../models");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found", data: null });
    res.json({ success: true, message: "User profile retrieved", data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
};

exports.followUser = async (req, res) => {
  try {
    await Follower.create({
      followerId: req.user.id,
      followingId: req.params.id,
    });
    res.json({ success: true, message: "Followed user", data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    await Follower.destroy({
      where: { followerId: req.user.id, followingId: req.params.id },
    });
    res.json({ success: true, message: "Unfollowed user", data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const followers = await Follower.findAll({
      where: { followingId: req.user.id },
      include: [{ model: User, as: "follower" }],
    });
    res.json({
      success: true,
      message: "Followers retrieved",
      data: followers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
};

exports.getFollowed = async (req, res) => {
  try {
    const followed = await Follower.findAll({
      where: { followerId: req.user.id },
      include: [{ model: User, as: "following" }],
    });
    res.json({
      success: true,
      message: "Followed users retrieved",
      data: followed,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
};

exports.getUserFollowers = async (req, res) => {
  try {
    const followers = await Follower.findAll({
      where: { followingId: req.params.id },
      include: [{ model: User, as: "follower" }],
    });
    const followersCount = await Follower.count({
      where: { followingId: req.params.id },
    });
    res.json({
      success: true,
      message: "User followers retrieved",
      data: { followersCount, followers },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
};

exports.getUserFollowed = async (req, res) => {
  try {
    const followed = await Follower.findAll({
      where: { followerId: req.params.id },
      include: [{ model: User, as: "following" }],
    });
    const followedCount = await Follower.count({
      where: { followerId: req.params.id },
    });
    res.json({
      success: true,
      message: "User followed retrieved",
      data: { followedCount, followed },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
};

exports.updateProfile = [
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string"),
  body("middleName")
    .optional()
    .isString()
    .withMessage("Middle name must be a string"),
  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string"),
  body("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  body("bio").optional().isString().withMessage("Bio must be a string"),
  body("dateOfBirth").optional().isDate().withMessage("Invalid date of birth"),
  body("profileImage")
    .optional()
    .isURL()
    .withMessage("Profile image must be a valid URL"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found", data: null });
      }

      const {
        firstName,
        middleName,
        lastName,
        phoneNumber,
        bio,
        dateOfBirth,
        profileImage,
      } = req.body;
      const userProfile = await UserProfile.findOne({
        where: { userId: req.user.id },
      });

      if (userProfile) {
        await userProfile.update({
          firstName,
          middleName,
          lastName,
          phoneNumber,
          bio,
          dateOfBirth,
          profileImage,
        });
      } else {
        await UserProfile.create({
          userId: req.user.id,
          firstName,
          middleName,
          lastName,
          phoneNumber,
          bio,
          dateOfBirth,
          profileImage,
        });
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: userProfile,
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: err.message, data: null });
    }
  },
];

exports.changePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found", data: null });
      }

      const { currentPassword, newPassword } = req.body;
      if (!(await bcrypt.compare(currentPassword, user.password))) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
          data: null,
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });

      res.json({
        success: true,
        message: "Password changed successfully",
        data: null,
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: err.message, data: null });
    }
  },
];
