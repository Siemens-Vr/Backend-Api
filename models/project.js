'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate({ Assignee, Milestone, Document, User }) {
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
      
      // Add associations for createdBy and updatedBy
      this.belongsTo(User, {
        foreignKey: 'createdBy',
        as: 'creator',
      });
      this.belongsTo(User, {
        foreignKey: 'updatedBy',
        as: 'updater',
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
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.UUID,
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
    tableName: 'Projects',
     hooks: {
      beforeValidate: (project, options) => {
        console.log('beforeValidate hook called');
        console.log('userId from options:', options.userId);
        
        if (options.userId) {
          // For create operations, set both fields
          if (project.isNewRecord) {
            project.createdBy = options.userId;
            project.updatedBy = options.userId;
            console.log('Set createdBy and updatedBy to:', options.userId);
          } else {
            // For update operations, only set updatedBy
            project.updatedBy = options.userId;
            console.log('Set updatedBy to:', options.userId);
          }
        } else {
          console.log('No userId in options!');
        }
      }
    }

  });

  return Project;
};