"use strict";
const { Model } = require("sequelize");
const User = require("./user");
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserProfile.user = UserProfile.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  UserProfile.init(
    {
      userId: DataTypes.INTEGER,
      firstName: DataTypes.STRING,
      middleName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      bio: DataTypes.STRING,
      dateOfBirth: DataTypes.DATE,
      profileImage: DataTypes.STRING,
      phoneNumberVerifiedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserProfile",
    }
  );
  return UserProfile;
};
