'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      { tableName: 'Leaves', schema: 'students' }, // Ensure the schema is specified
      'userUUID'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      { tableName: 'Leaves', schema: 'students' }, 
      'userUUID',
      {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      }
    );
  }
};
