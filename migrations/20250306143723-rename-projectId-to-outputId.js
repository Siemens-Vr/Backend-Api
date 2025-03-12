'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      { schema: 'projects', tableName: 'Documents' },
      'outputId',
      {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: { schema: 'projects', tableName: 'Outputs' }, // Ensure correct schema
          key: 'uuid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      { schema: 'projects', tableName: 'Documents' },
      'outputId',
      {
        type: Sequelize.UUID,
        allowNull: false,
      }
    );
  }
};
