
'use strict';
const { Sequelize, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { schema: 'projects', tableName: 'Cost_cat_entries_folders' },
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
        },
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        folderName: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: 'unique_folder_name_per_cost_category',
        },
        cost_category_entry_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { schema: 'projects', tableName: 'Cost_category_table' },
            key:   'uuid'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: { schema: 'users', tableName: 'Users' }, 
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: { schema: 'users', tableName: 'Users' }, 
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
 
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      }
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable(
      { schema: 'projects', tableName: 'Cost_cat_entries_folders' }
    );
  },
};
