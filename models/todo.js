 
// models/Todo.js
const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Todo extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userUUID',
        targetKey: 'uuid',
        as: 'userleaves',
      });
    }
  }

  Todo.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        allowNull:false,        
        primaryKey: true,
      },
      userUUID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      
      isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Todo',
      schema: 'students', // Ensure it is on the correct schema
      timestamps: true,
    }
  );

  return Todo;
};

