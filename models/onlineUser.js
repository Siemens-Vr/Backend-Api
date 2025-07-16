const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OnlineUser = sequelize.define('OnlineUser', {
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
    socketId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    currentPage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('online', 'away', 'offline'),
      allowNull: false,
      defaultValue: 'online'
    },
    lastActivity: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isBeforeNow(value) {
          if (new Date(value) > new Date()) {
            throw new Error('lastActivity cannot be in the future');
          }
        }
      }
    },
    connectedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    schema: 'users',
    tableName: 'online_users',
    timestamps: true,

    indexes: [
      { fields: ['userId'] },
      { fields: ['sessionId'] },
      { fields: ['socketId'] },
      { fields: ['lastActivity'] },
      { fields: ['status'] },
      { unique: true, fields: ['userId', 'sessionId'], name: 'unique_user_session' }
    ]
  });

  OnlineUser.associate = (models) => {
    OnlineUser.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return OnlineUser;
};