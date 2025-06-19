'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      { schema: 'projects', tableName: 'Transport' }, // scoped to 'projects' schema
      'cashReceiptNo',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      { schema: 'projects', tableName: 'Transport' },
      'cashReceiptNo'
    );
  }
};
