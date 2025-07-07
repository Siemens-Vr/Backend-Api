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
    no:{
      allowNull: false,
      type: DataTypes.INTEGER,

    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    implementation_startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    implementation_endDate: {
      type: DataTypes.DATE,
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
