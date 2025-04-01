'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class LeaveRequests extends Model {
    static associate(models) {
      // Define associations
      LeaveRequests.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      LeaveRequests.belongsTo(models.Leaves, {
        foreignKey: 'leaveId',
        as: 'leave'
      });
    }

    // Add a method to validate and potentially fix UUIDs
    static validateAndFixUUID(uuid) {
      // Check if the UUID is in the correct format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (!uuidRegex.test(uuid)) {
        // If not in correct format, try to remove extra characters
        const cleanedUUID = uuid.replace(/[^0-9a-f]/gi, '');
        
        // If cleaned UUID is 32 characters long, format it
        if (cleanedUUID.length === 32) {
          return `${cleanedUUID.slice(0,8)}-${cleanedUUID.slice(8,12)}-${cleanedUUID.slice(12,16)}-${cleanedUUID.slice(16,20)}-${cleanedUUID.slice(20)}`;
        }
        
        // If cleaning doesn't work, generate a new UUID
        return uuidv4();
      }
      
      return uuid;
    }
  }

  LeaveRequests.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        isUUID: {
          args: 4,
          msg: 'Invalid UUID format for userId'
        }
      },
      // Add a setter to validate and fix UUID
      set(value) {
        this.setDataValue('userId', LeaveRequests.validateAndFixUUID(value));
      }
    },
    leaveId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        isUUID: {
          args: 4,
          msg: 'Invalid UUID format for leaveId'
        }
      },
      // Add a setter to validate and fix UUID
      set(value) {
        this.setDataValue('leaveId', LeaveRequests.validateAndFixUUID(value));
      }
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterStartDate(value) {
          if (new Date(value) < new Date(this.startDate)) {
            throw new Error('End date must be after start date');
          }
        }
      }
    },
    reason: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 500]
      }
    },
    approvalStatus: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Denied'),
      defaultValue: 'Pending',
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Taken', 'Denied'),
      defaultValue: 'Pending',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'LeaveRequests',
    schema: 'users',
    tableName: 'LeaveRequests',
    timestamps: true,
    paranoid: true
  });

  return LeaveRequests;
};