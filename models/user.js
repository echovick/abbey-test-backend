"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.userProfile = User.hasOne(models.UserProfile, {
        foreignKey: "userId",
        as: "userProfile",
      });

      User.posts = User.hasMany(models.Post, {
        foreignKey: "userId",
        as: "posts",
      });

      User.likes = User.hasMany(models.Like, {
        foreignKey: "userId",
        as: "likes",
      });
    }
  }
  User.init(
    {
      googleId: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      emailVerifiedAt: DataTypes.DATE,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
