'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('online_users', {
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
        allowNull: false,
        unique: true
      },
      socketId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      ipAddress: {
        type: Sequelize.STRING(45), // IPv6 support
        allowNull: true
      },
      userAgent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      currentPage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('online', 'away', 'offline'),
        defaultValue: 'online',
        allowNull: false
      },
      lastActivity: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      connectedAt: {
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
    await queryInterface.addIndex('online_users', ['userId'], {
      name: 'idx_online_users_user_id'
    });

    await queryInterface.addIndex('online_users', ['sessionId'], {
      name: 'idx_online_users_session_id'
    });

    await queryInterface.addIndex('online_users', ['socketId'], {
      name: 'idx_online_users_socket_id'
    });

    await queryInterface.addIndex('online_users', ['lastActivity'], {
      name: 'idx_online_users_last_activity'
    });

    await queryInterface.addIndex('online_users', ['status'], {
      name: 'idx_online_users_status'
    });

    await queryInterface.addIndex('online_users', ['userId', 'status'], {
      name: 'idx_online_users_user_status'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('online_users', 'idx_online_users_user_id');
    await queryInterface.removeIndex('online_users', 'idx_online_users_session_id');
    await queryInterface.removeIndex('online_users', 'idx_online_users_socket_id');
    await queryInterface.removeIndex('online_users', 'idx_online_users_last_activity');
    await queryInterface.removeIndex('online_users', 'idx_online_users_status');
    await queryInterface.removeIndex('online_users', 'idx_online_users_user_status');

    // Drop the table
    await queryInterface.dropTable('online_users');
  }
};