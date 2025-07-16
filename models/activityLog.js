const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ActivityLog = sequelize.define('ActivityLog', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: { schema: 'users', tableName: 'Users' },
        key: 'uuid'
      }
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resource: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resourceId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: true
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isBeforeNow(value) {
          if (new Date(value) > new Date()) {
            throw new Error('timestamp cannot be in the future');
          }
        }
      }
    }
  }, {
    schema: 'users',
    tableName: 'activity_logs',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['sessionId'] },
      { fields: ['action'] },
      { fields: ['resource'] },
      { fields: ['timestamp'] },
      { fields: ['success'] },
      { fields: ['userId', 'timestamp'] },
      { fields: ['action', 'timestamp'] },
      { fields: ['resource', 'timestamp'] },
      { fields: ['userId', 'action'] }
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