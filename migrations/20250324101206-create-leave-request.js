'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        schema: 'users', 
        tableName: 'LeaveRequests'
      },
      {
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
          allowNull: false
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: {
              schema: 'users',
              tableName: 'Users'
            },
            key: 'uuid'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        leaveId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: {
              schema: 'users',
              tableName: 'Leaves'
            },
            key: 'uuid'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        startDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        endDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        reason: {
          type: Sequelize.STRING(500),
          allowNull: false
        },
        approvalStatus: {
          type: Sequelize.ENUM('Pending', 'Approved', 'Denied'),
          defaultValue: 'Pending',
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('Pending', 'Taken', 'Denied'),
          defaultValue: 'Pending',
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW')
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true
        }
      },
      {
        paranoid: true  // Enables soft delete
      }
    );

    // Add unique constraint using fully qualified table name
    await queryInterface.addConstraint({
      schema: 'users',
      tableName: 'LeaveRequests'
    }, {
      fields: ['userId', 'startDate', 'endDate'],
      type: 'unique',
      name: 'unique_user_leave_period'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the unique constraint with fully qualified table name
    await queryInterface.removeConstraint({
      schema: 'users',
      tableName: 'LeaveRequests'
    }, 'unique_user_leave_period');
    
    // Drop the table with schema
    await queryInterface.dropTable({
      schema: 'users', 
      tableName: 'LeaveRequests'
    });
  }
};