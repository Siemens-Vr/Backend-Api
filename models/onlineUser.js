const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OnlineUser = sequelize.define('OnlineUser', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Assuming your user model is 'Users'
        key: 'id'
      }
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    socketId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    currentPage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('online', 'away', 'offline'),
      defaultValue: 'online',
    },
    lastActivity: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    connectedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'online_users',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['sessionId']
      },
      {
        fields: ['socketId']
      },
      {
        fields: ['lastActivity']
      }
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
