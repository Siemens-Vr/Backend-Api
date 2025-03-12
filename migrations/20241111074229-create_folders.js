'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        schema: 'projects',
        tableName: 'Folders',
      },
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: false,
        },
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        folderName: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: 'unique_folder_name_per_project',
        },
        // description: {
        //   type: Sequelize.STRING,
        //   allowNull: false,
        // },
        outputId: {
          type: Sequelize.UUID,
          references: {
            model: 'Outputs',
            key: 'uuid'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      }
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable({
      schema: 'projects',
      tableName: 'Folders',
    });
  },
};
