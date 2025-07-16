const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ActivityLog = sequelize.define('ActivityLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., 'login', 'logout', 'create_user', 'update_profile', etc.
    },
    resource: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., 'user', 'equipment', 'staff', etc.
    },
    resourceId: {
      type: DataTypes.STRING,
      allowNull: true, // ID of the resource being acted upon
    },
    method: {
      type: DataTypes.STRING,
      allowNull: true, // HTTP method (GET, POST, PUT, DELETE)
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: true, // API endpoint
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true, // Additional details about the action
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true, // Duration in milliseconds
    },
    success: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'activity_logs',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['sessionId']
      },
      {
        fields: ['action']
      },
      {
        fields: ['resource']
      },
      {
        fields: ['timestamp']
      },
      {
        fields: ['userId', 'timestamp']
      }
    ]
  });

  ActivityLog.associate = (models) => {
    ActivityLog.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return ActivityLog;
};