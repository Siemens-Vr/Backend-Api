'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'LeaveRequests',
      {
        uuid: {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
        },
        leaveUUID: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: {
              schema: 'students',
              tableName: 'Leaves',
            },
            key: 'uuid',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        endDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        Reason: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        Status: {
          type: Sequelize.ENUM('Approved', 'Pending', 'Denied'),
          allowNull: false,
          defaultValue: 'Pending',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW'),
        },
      },
      {
        schema: 'students',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('LeaveRequests', { schema: 'students' });
  },
};
