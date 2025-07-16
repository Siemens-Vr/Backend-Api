'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define schema-qualified table references
    const onlineTable = { schema: 'users', tableName: 'online_users' };
    const logsTable   = { schema: 'users', tableName: 'activity_logs' };

    // Enforce lastActivity not in the future
    await queryInterface.addConstraint(onlineTable, {
      fields: ['lastActivity'],
      type: 'check',
      where: Sequelize.where(
        Sequelize.col('lastActivity'),
        '<=',
        Sequelize.fn('NOW')
      ),
      name: 'chk_online_users_last_activity'
    });

    // Enforce timestamp not in the future
    await queryInterface.addConstraint(logsTable, {
      fields: ['timestamp'],
      type: 'check',
      where: Sequelize.where(
        Sequelize.col('timestamp'),
        '<=',
        Sequelize.fn('NOW')
      ),
      name: 'chk_activity_logs_timestamp'
    });

    // Enforce duration non-negative
    await queryInterface.addConstraint(logsTable, {
      fields: ['duration'],
      type: 'check',
      where: Sequelize.where(
        Sequelize.col('duration'),
        '>=',
        0
      ),
      name: 'chk_activity_logs_duration'
    });

    // Prevent duplicate active sessions per user
    await queryInterface.addConstraint(onlineTable, {
      fields: ['userId', 'sessionId'],
      type: 'unique',
      name: 'unique_user_session'
    });
  },

  down: async (queryInterface, Sequelize) => {
    const onlineTable = { schema: 'users', tableName: 'online_users' };
    const logsTable   = { schema: 'users', tableName: 'activity_logs' };

    // Remove constraints
    await queryInterface.removeConstraint(onlineTable, 'chk_online_users_last_activity');
    await queryInterface.removeConstraint(logsTable,   'chk_activity_logs_timestamp');
    await queryInterface.removeConstraint(logsTable,   'chk_activity_logs_duration');
    await queryInterface.removeConstraint(onlineTable, 'unique_user_session');
  }
};
