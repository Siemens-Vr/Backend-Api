
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cost_cat_entries_folders extends Model {
    static associate(models) {
      this.belongsTo(models.Cost_category_table, {
        foreignKey: 'cost_category_entry_id',
        as: 'cost_category_entry',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.Cost_cat_entries_files, {
        foreignKey: 'cost_category_folder_id',
        as: 'files',
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

  Cost_cat_entries_folders.init(
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
      folderName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'unique_folder_name_per_project',
      },
      cost_category_entry_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: { schema: 'projects', tableName: 'Cost_category_table' },
          key:   'uuid',
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
    },
    {
      sequelize,
      modelName:      'Cost_cat_entries_folders',
      tableName:      'Cost_cat_entries_folders',
      schema:         'projects',
      timestamps:     true,
      freezeTableName: true,
      hooks: {
      beforeValidate: (folder, options) => {
        console.log('beforeValidate hook called');
        console.log('userId from options:', options.userId);
        
        if (options.userId) {
          // For create operations, set both fields
          if (folder.isNewRecord) {
            folder.createdBy = options.userId;
            folder.updatedBy = options.userId;
            console.log('Set createdBy and updatedBy to:', options.userId);
          } else {
            // For update operations, only set updatedBy
            folder.updatedBy = options.userId;
            console.log('Set updatedBy to:', options.userId);
          }
        } else {
          console.log('No userId in options!');
        }
      }
    }
    }
  );

  return Cost_cat_entries_folders;
};
