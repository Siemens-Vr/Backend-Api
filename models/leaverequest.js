'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class LeaveRequests extends Model {
    static associate(models) {
      // Define associations here
      LeaveRequests.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user', // Alias for association
      });
      LeaveRequests.belongsTo(models.Leaves, {
        foreignKey: 'leaveId',
        as: 'leave', // Alias for association
      });
    }
  }

  LeaveRequests.init({
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: {
          schema: 'users',
          tableName: 'Users',
        },
        key: 'uuid',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    leaveId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: {
          schema: 'users',
          tableName: 'Leaves',
        },
        key: 'uuid',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    approvalStatus: {
      type: DataTypes.ENUM('Approved', 'Pending', 'Denied'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    status: {
      type: DataTypes.ENUM('Taken', 'Pending', 'Denied'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'LeaveRequests',
    schema: 'users', // Specify the schema
    tableName: 'LeaveRequests',
    timestamps: true, // Enables createdAt and updatedAt fields
  });

  return LeaveRequests;
};
