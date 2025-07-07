
'use strict';

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
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()'),
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
