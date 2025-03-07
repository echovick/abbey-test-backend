"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.user = Post.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      Post.parentPost = Post.belongsTo(models.Post, {
        foreignKey: "parentPostId",
        as: "parentPost",
      });

      Post.replies = Post.hasMany(models.Post, {
        foreignKey: "parentPostId",
        as: "replies",
      });

      Post.likes = Post.hasMany(models.Like, {
        foreignKey: "postId",
        as: "likes",
      });
    }
  }
  Post.init(
    {
      userId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      parentPostId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );

  return Post;
};
