'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate({ Assignee, Milestone, Document }) {
      this.hasMany(Assignee, {
        foreignKey: 'projectId',
        as: 'assignees',
      });
      this.hasMany(Milestone, {
        foreignKey: 'projectId',
        as: 'milestones',
      });
      this.hasMany(Document, {
        foreignKey: 'projectId',
        as: 'documents',
      });
    }
  }

  Project.init({
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
    project_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
   type:{
      type: DataTypes.ENUM('Milestones', 'Work Package', 'Duration Years'),
      defaultValue:"Milestones",
      allowNull:false
    },
    total_value: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    approved_funding: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    implementation_startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    implementation_endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'Project',
    schema: 'projects',
    tableName: 'Projects', // ensure table name matches migration
  });

  return Project;
};
