'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('activity_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users', // Make sure this matches your users table name
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sessionId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      resource: {
        type: Sequelize.STRING,
        allowNull: true
      },
      resourceId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      method: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      endpoint: {
        type: Sequelize.STRING,
        allowNull: true
      },
      details: {
        type: Sequelize.JSON,
        allowNull: true
      },
      ipAddress: {
        type: Sequelize.STRING(45), // IPv6 support
        allowNull: true
      },
      userAgent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Duration in milliseconds'
      },
      success: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      errorMessage: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('activity_logs', ['userId'], {
      name: 'idx_activity_logs_user_id'
    });

    await queryInterface.addIndex('activity_logs', ['sessionId'], {
      name: 'idx_activity_logs_session_id'
    });

    await queryInterface.addIndex('activity_logs', ['action'], {
      name: 'idx_activity_logs_action'
    });

    await queryInterface.addIndex('activity_logs', ['resource'], {
      name: 'idx_activity_logs_resource'
    });

    await queryInterface.addIndex('activity_logs', ['timestamp'], {
      name: 'idx_activity_logs_timestamp'
    });

    await queryInterface.addIndex('activity_logs', ['success'], {
      name: 'idx_activity_logs_success'
    });

    await queryInterface.addIndex('activity_logs', ['userId', 'timestamp'], {
      name: 'idx_activity_logs_user_timestamp'
    });

    await queryInterface.addIndex('activity_logs', ['action', 'timestamp'], {
      name: 'idx_activity_logs_action_timestamp'
    });

    await queryInterface.addIndex('activity_logs', ['resource', 'timestamp'], {
      name: 'idx_activity_logs_resource_timestamp'
    });

    await queryInterface.addIndex('activity_logs', ['userId', 'action'], {
      name: 'idx_activity_logs_user_action'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('activity_logs', 'idx_activity_logs_user_id');
    await queryInterface.removeIndex('activity_logs', 'idx_activity_logs_session_id');
    await queryInterface.removeIndex('activity_logs', 'idx_activity_logs_action');
    await queryInterface.removeIndex('activity_logs', 'idx_activity_logs_resource');
    await queryInterface.removeIndex('activity_logs', 'idx_activity_logs_timestamp');
    await queryInterface.removeIndex('activity_logs', 'idx_activity_logs_success');
    await queryInterface.removeIndex('activity_logs', 'idx_activity_logs_user_timestamp');
    await queryInterface.removeIndex('activity_logs', 'idx_activity_logs_action_timestamp');
    await queryInterface.removeIndex('activity_logs', 'idx_activity_logs_resource_timestamp');
    await queryInterface.removeIndex('activity_logs', 'idx_activity_logs_user_action');

    // Drop the table
    await queryInterface.dropTable('activity_logs');
  }
};