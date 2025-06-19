'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Milestone extends Model {
    static associate({ Project, Output }) {
      this.belongsTo(Project, {
        foreignKey: 'projectId',
        as: 'project',
      });
      //  Added a one to many releationship between Milestone and output
      this.hasMany(Output, {
        foreignKey: 'milestoneId',
        as: 'outputs',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      
       
    }
  }

  Milestone.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    uuid: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'Milestone',
    schema: 'projects',
  });

  return Milestone;
};
