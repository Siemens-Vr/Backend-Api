
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
    },
    {
      sequelize,
      modelName:      'Cost_cat_entries_folders',
      tableName:      'Cost_cat_entries_folders',
      schema:         'projects',
      timestamps:     true,
      freezeTableName: true,
    }
  );

  return Cost_cat_entries_folders;
};
