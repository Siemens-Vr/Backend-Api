'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add uuid column
    await queryInterface.addColumn(
      { tableName: 'Leaves', schema: 'students' },
      'uuid',
      {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      }
    );

    // Add name column
    await queryInterface.addColumn(
      { tableName: 'Leaves', schema: 'students' },
      'name',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );

    // Rename staffUUID to userUUID
    await queryInterface.renameColumn(
      { tableName: 'Leaves', schema: 'students' },
      'staffUUID',
      'userUUID'
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Remove uuid column
    await queryInterface.removeColumn(
      { tableName: 'Leaves', schema: 'students' },
      'uuid'
    );

    // Remove name column
    await queryInterface.removeColumn(
      { tableName: 'Leaves', schema: 'students' },
      'name'
    );

    // Rename userUUID back to staffUUID
    await queryInterface.renameColumn(
      { tableName: 'Leaves', schema: 'students' },
      'userUUID',
      'staffUUID'
    );
  }
};
