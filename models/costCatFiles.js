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
    },
    {
      sequelize,
      modelName:      'Cost_cat_entries_files',
      tableName:      'Cost_cat_entries_files',
      schema:         'projects',
      timestamps:     true,
      freezeTableName: true,
    }
  );

  return Cost_cat_entries_files;
};
