'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable({schema: 'users', tableName: 'LeaveRequests' },
      {
        uuid: {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
        },
        userId:{
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: {
              schema: 'users',
              tableName: 'Users',
            },
            key: 'uuid',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',

        },
        leaveId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: {
              schema: 'users',
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
        reason: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        approvalStatus: {
          type: Sequelize.ENUM('Approved', 'Pending', 'Denied'),
          allowNull: false,
          defaultValue: 'Pending',
        },
        status: {
          type: Sequelize.ENUM('Taken', 'Pending', 'Denied'),
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
      
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('LeaveRequests', { schema: 'users' });
  },
};