'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Output extends Model {
    static associate({ Milestone, Document }) {
      this.belongsTo(Milestone, {
        foreignKey: 'milestoneId',
        as: 'milestone',
      });

      this.hasMany(Document, {
        foreignKey: 'outputId',
        as: 'documents',
      });
      
    }

    
  }

  Output.init({
    uuid: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
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
