'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
        Todo.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
        });
    }
  }

  Todo.init(
    {
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: {
            schema: 'users',
            tableName: 'Users'
            },
            key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
        },
        uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true,
        },

      todo: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
      },
      todoDate: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      sequelize,
      schema: 'users',
      modelName: 'Todo',
      tableName: 'Todos',
    }
  );

  return Todo;
};
