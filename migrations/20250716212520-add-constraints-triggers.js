'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add check constraints
    await queryInterface.addConstraint('online_users', {
      fields: ['lastActivity'],
      type: 'check',
      where: {
        lastActivity: {
          [Sequelize.Op.lte]: Sequelize.fn('NOW')
        }
      },
      name: 'chk_online_users_last_activity'
    });

    await queryInterface.addConstraint('activity_logs', {
      fields: ['timestamp'],
      type: 'check',
      where: {
        timestamp: {
          [Sequelize.Op.lte]: Sequelize.fn('NOW')
        }
      },
      name: 'chk_activity_logs_timestamp'
    });

    await queryInterface.addConstraint('activity_logs', {
      fields: ['duration'],
      type: 'check',
      where: {
        duration: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_activity_logs_duration'
    });

    // Add unique constraint to prevent duplicate active sessions
    await queryInterface.addConstraint('online_users', {
      fields: ['userId', 'sessionId'],
      type: 'unique',
      name: 'unique_user_session'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove constraints
    await queryInterface.removeConstraint('online_users', 'chk_online_users_last_activity');
    await queryInterface.removeConstraint('activity_logs', 'chk_activity_logs_timestamp');
    await queryInterface.removeConstraint('activity_logs', 'chk_activity_logs_duration');
    await queryInterface.removeConstraint('online_users', 'unique_user_session');
  }
};
