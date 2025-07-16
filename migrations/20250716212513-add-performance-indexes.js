'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add composite indexes for common query patterns
    
    // Online users performance indexes
    await queryInterface.addIndex('online_users', ['status', 'lastActivity'], {
      name: 'idx_online_users_status_activity'
    });

    await queryInterface.addIndex('online_users', ['userId', 'connectedAt'], {
      name: 'idx_online_users_user_connected'
    });

    // Activity logs performance indexes
    await queryInterface.addIndex('activity_logs', ['timestamp', 'success'], {
      name: 'idx_activity_logs_timestamp_success'
    });

    await queryInterface.addIndex('activity_logs', ['userId', 'action', 'timestamp'], {
      name: 'idx_activity_logs_user_action_timestamp'
    });

    await queryInterface.addIndex('activity_logs', ['resource', 'resourceId', 'timestamp'], {
      name: 'idx_activity_logs_resource_id_timestamp'
    });

    // Index for cleanup operations
    await queryInterface.addIndex('activity_logs', ['timestamp', 'userId'], {
      name: 'idx_activity_logs_cleanup'
    });

    await queryInterface.addIndex('online_users', ['lastActivity', 'status'], {
      name: 'idx_online_users_cleanup'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the performance indexes
    await queryInterface.removeIndex('online_users', 'idx_online_users_status_activity');
    await queryInterface.removeIndex('online_users', 'idx_online_users_user_connected');
    await queryInterface.removeIndex('activity_logs', 'idx_activity_logs_timestamp_success');
    await queryInterface.removeIndex('activity_logs', 'idx_activity_logs_user_action_timestamp');
    await queryInterface.removeIndex('activity_logs', 'idx_activity_logs_resource_id_timestamp');
    await queryInterface.removeIndex('activity_logs', 'idx_activity_logs_cleanup');
    await queryInterface.removeIndex('online_users', 'idx_online_users_cleanup');
  }
};