'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      { schema: 'projects', tableName: 'Procurements' }, // scoped to 'projects' schema
      'checkNo',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      { schema: 'projects', tableName: 'Procurements' },
      'checkNo'
    );
  }
};
