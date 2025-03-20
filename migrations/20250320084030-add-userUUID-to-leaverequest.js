'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      { tableName: 'LeaveRequests', schema: 'students' }, // Ensure schema is provided
      'userUUID',
      {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'Users',
            schema: 'users', // Ensure correct schema for Users table
          },
          key: 'uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      { tableName: 'LeaveRequests', schema: 'students' },
      'userUUID'
    );
  },
};
