'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Output extends Model {
    static associate({ Milestone }) {
      this.belongsTo(Milestone, {
        foreignKey: 'milestoneId',
        as: 'milestone',
      });

 
    }
  }

  Output.init({
    uuid: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    no:{
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    document_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    document_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isIn: {
          args: [[0, 1]],
          msg: 'Value must be either 0 or 1'
        }
      }
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    milestoneId: {
      type: DataTypes.UUID, 
      allowNull: false,
      references: {
        model: 'Milestones', 
        key: 'uuid',
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Output',
    schema: 'projects',
  });

  return Output;
};