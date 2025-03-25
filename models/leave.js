'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Leaves extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Leaves.init({
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true, // Assuming name can be null, change to false if required
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // Assuming description can be null, change to false if required
    },
    days: {
      type: DataTypes.INTEGER,
      allowNull: true, // Assuming days can be null, change to false if required
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
  }, {
    sequelize,
    modelName: 'Leaves',
    schema: 'users', // Specify the schema
    tableName: 'Leaves',
    timestamps: true, // Enables createdAt and updatedAt fields
  });

  return Leaves;
};
