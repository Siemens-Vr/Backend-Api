'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Define associations here


            // One-to-one relationship with LeaveRequest
            User.hasOne(models.LeaveRequest, {
              foreignKey: 'userUUID',
              as: 'leaveRequest',
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            });
          }
        }
      
    
  

  User.init(
    {
      uuid: {
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      idNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      dateJoined: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      isDefaultPassword: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('Staff', 'Admin'),
        allowNull: false,
        defaultValue: 'Staff',
      },
      role: {
        type: DataTypes.ENUM('Admin', 'Project', 'Student', 'Equipment', 'Staff'),
        allowNull: false,
        defaultValue: 'Staff',
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'User',
      schema: 'users',
      timestamps: true,
    }
  );

  return User;
};
