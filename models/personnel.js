// personnel.js model
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Personnel extends Model {
    static associate({ User, Project }) {
      this.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
      });
      this.belongsTo(Project, {
        foreignKey: 'projectId',
        as: 'project',
      });
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

  Personnel.init({
    uuid: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(
        'Project Manager', 'Team Lead', 'Developer', 
        'Designer', 'Analyst', 'Tester', 'Stakeholder',
        'Client', 'Consultant'
      ),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    responsibilities: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Personnel',
    schema: 'projects',
    tableName: 'Personnel',
    hooks: {
      beforeValidate: (personnel, options) => {
        if (options.userId) {
          if (personnel.isNewRecord) {
            personnel.createdBy = options.userId;
            personnel.updatedBy = options.userId;
          } else {
            personnel.updatedBy = options.userId;
          }
        }
      }
    }
  });

  return Personnel;
};