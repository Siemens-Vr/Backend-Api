'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  class UsersNotification extends Model {
    /**
     * Define associations for this model.
     */
    static associate(models) {
      // Notification owner
      UsersNotification.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      // Creator of the notification
      UsersNotification.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator',
      });

      // Last updater of the notification
      UsersNotification.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updater',
      });

      UsersNotification.belongsTo(models.Output, {
        foreignKey: 'outputId',
        as: 'output',
      });
    }
  
  }

  UsersNotification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      outputId:{
       type: DataTypes.UUID,
        allowNull: false,

      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UsersNotification',
      tableName: 'users_Notifications',
      schema: 'users',
      timestamps: true,
          hooks: {
      beforeValidate: (notification, options) => {
        if (options.userId) {
          if (notification.isNewRecord) {
            notification.createdBy = options.userId;
            notification.updatedBy = options.userId;
          } else {
            notification.updatedBy = options.userId;
          }
        }
      }
    }
    }
  );

  return UsersNotification;
};
