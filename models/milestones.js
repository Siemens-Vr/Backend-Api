'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Milestone extends Model {
    static associate({ Project, Output, User }) {
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
    },
  }, {
    sequelize,
    modelName: 'Milestone',
    schema: 'projects',
    hooks: {
      beforeValidate: (milestone, options) => {
        console.log('beforeValidate hook called');
        console.log('userId from options:', options.userId);
        
        if (options.userId) {
          // For create operations, set both fields
          if (milestone.isNewRecord) {
            milestone.createdBy = options.userId;
            milestone.updatedBy = options.userId;
            console.log('Set createdBy and updatedBy to:', options.userId);
          } else {
            // For update operations, only set updatedBy
            milestone.updatedBy = options.userId;
            console.log('Set updatedBy to:', options.userId);
          }
        } else {
          console.log('No userId in options!');
        }
      }
    }
  });

  return Milestone;
};
