'use strict';

module.exports = (sequelize, DataTypes) => {
  const Cost_categories = sequelize.define(
    'Cost_categories',
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        unique:true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:false
      },
      milestoneId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            schema: 'projects',
            tableName: 'Milestones',
          },
          key: 'uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    },
    {
      tableName: 'Cost_categories',
      schema: 'projects',
      timestamps: true,
          hooks: {
      beforeValidate: (cost_category, options) => {
        console.log('beforeValidate hook called');
        console.log('userId from options:', options.userId);
        
        if (options.userId) {
          // For create operations, set both fields
          if (cost_category.isNewRecord) {
            cost_category.createdBy = options.userId;
            cost_category.updatedBy = options.userId;
            console.log('Set createdBy and updatedBy to:', options.userId);
          } else {
            // For update operations, only set updatedBy
            cost_category.updatedBy = options.userId;
            console.log('Set updatedBy to:', options.userId);
          }
        } else {
          console.log('No userId in options!');
        }
      }
    }
    }
  );

  Cost_categories.associate = (models) => {
    Cost_categories.belongsTo(models.Milestone, {
      foreignKey: 'milestoneId',
      targetKey: 'uuid',
      as: 'Milestone',
    });
    Cost_categories.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updater',
      });
    Cost_categories.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator',
    });
  };

  return Cost_categories;
};
