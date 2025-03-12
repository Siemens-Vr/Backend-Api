'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn({ schema: 'equipments', tableName: 'Components' }, 'modelNumber', {
      type: Sequelize.STRING,
      allowNull: true, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn({ schema: 'equipments', tableName: 'Components' },'modelNumber');
  },
};
