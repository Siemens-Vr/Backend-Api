// models/Cost_cat_entries_files.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cost_cat_entries_files extends Model {
    static associate(models) {
      this.belongsTo(models.Cost_cat_entries_folders, {
        foreignKey: 'cost_category_folder_id',
        as: 'folder',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.belongsTo(models.Cost_category_table, {
        foreignKey: 'cost_category_entry_id',
        as: 'cost_category_entry',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator',
      });
      this.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updater',
      });
      
    }
  }

  Cost_cat_entries_files.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cost_category_folder_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: { schema: 'projects', tableName: 'Cost_cat_entries_folders' },
          key:   'uuid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      cost_category_entry_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: { schema: 'projects', tableName: 'Cost_category_table' },
          key:   'uuid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      path: {
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
    },
    {
      sequelize,
      modelName:      'Cost_cat_entries_files',
      tableName:      'Cost_cat_entries_files',
      schema:         'projects',
      timestamps:     true,
      freezeTableName: true,
      hooks: {
      beforeValidate: (file, options) => {
        console.log('beforeValidate hook called');
        console.log('userId from options:', options.userId);
        
        if (options.userId) {
          // For create operations, set both fields
          if (file.isNewRecord) {
            file.createdBy = options.userId;
            file.updatedBy = options.userId;
            console.log('Set createdBy and updatedBy to:', options.userId);
          } else {
            // For update operations, only set updatedBy
            file.updatedBy = options.userId;
            console.log('Set updatedBy to:', options.userId);
          }
        } else {
          console.log('No userId in options!');
        }
      }
    }
    }
  );

  return Cost_cat_entries_files;
};
