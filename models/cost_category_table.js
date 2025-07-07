'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cost_category_table extends Model {
    static associate({ Milestone, Document, Cost_categories }) {
      // this.belongsTo(Milestone, {
      //   foreignKey: 'milestoneId',
      //   as: 'milestone',
      // });
      this.belongsTo(Cost_categories, {
        foreignKey: 'cost_category_Id',
        as: 'cost_category_entries',
      });

      // this.hasMany(Document, {
      //   foreignKey: 'outputId',
      //   as: 'documents',
      // });
      
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
      type: DataTypes.DECIMAL(10, 2),  // up to 10 digits total, 2 after the decimal
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
  });

  return  Cost_category_table;
};
