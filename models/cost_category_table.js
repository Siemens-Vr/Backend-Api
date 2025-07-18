'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cost_category_table extends Model {
    static associate({ Milestone, Document,User, Cost_categories }) {
      // this.belongsTo(Milestone, {
      //   foreignKey: 'milestoneId',
      //   as: 'milestone',
      // });
      this.belongsTo(Cost_categories, {
        foreignKey: 'cost_category_Id',
        as: 'cost_category_entries',
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

  Cost_category_table.init({
    uuid: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    no:{
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(20, 2),  
      allowNull: false,
      defaultValue: 0.00,
    },

    cost_category_Id: {
      type: DataTypes.UUID, 
      allowNull: false,
      references: {
        model: 'Cost_categories', 
        key: 'uuid',
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
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
    tableName:'Cost_category_table',
    modelName: 'Cost_category_table',
    schema: 'projects',
        hooks: {
      beforeValidate: (category_table, options) => {
        console.log('beforeValidate hook called');
        console.log('userId from options:', options.userId);
        
        if (options.userId) {
          // For create operations, set both fields
          if (category_table.isNewRecord) {
            category_table.createdBy = options.userId;
            category_table.updatedBy = options.userId;
            console.log('Set createdBy and updatedBy to:', options.userId);
          } else {
            // For update operations, only set updatedBy
            category_table.updatedBy = options.userId;
            console.log('Set updatedBy to:', options.userId);
          }
        } else {
          console.log('No userId in options!');
        }
      }
    }
  });

  return  Cost_category_table;
};
