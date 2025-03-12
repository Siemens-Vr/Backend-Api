'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the old projectId column
    await queryInterface.removeColumn(
      { schema: 'projects', tableName: 'Transport' },
      'projectId'
    );

    // Add the new outputId column
    await queryInterface.addColumn(
      { schema: 'projects', tableName: 'Transport' },
      'outputId',
      {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: { schema: 'projects', tableName: 'Outputs' },
          key: 'uuid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the outputId column
    await queryInterface.removeColumn(
      { schema: 'projects', tableName: 'Transport' },
      'outputId'
    );

    // Restore the projectId column
    await queryInterface.addColumn(
      { schema: 'projects', tableName: 'Transport' },
      'projectId',
      {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: { schema: 'projects', tableName: 'Projects' },
          key: 'uuid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    );
  }
};
