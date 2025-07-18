// migrations/20250704-create-cost-cat-entries-files.js
'use strict';
const { Sequelize, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      { schema: 'projects', tableName: 'Cost_cat_entries_files' },
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
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        cost_category_entry_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: { schema: 'projects', tableName: 'Cost_category_table' },
            key:   'uuid',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        cost_category_folder_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: { schema: 'projects', tableName: 'Cost_cat_entries_folders' },
            key:   'uuid',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        path: {
          type: Sequelize.STRING,
          allowNull: false,
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
      { schema: 'projects', tableName: 'Cost_cat_entries_files' }
    );
  },
};
