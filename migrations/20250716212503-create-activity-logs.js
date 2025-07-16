'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create table in 'users' schema
    await queryInterface.createTable(
      { schema: 'users', tableName: 'activity_logs' },
      {
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { schema: 'users', tableName: 'Users' },
            key: 'uuid',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        sessionId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        action: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        resource: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        resourceId: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        method: {
          type: Sequelize.STRING(10),
          allowNull: true,
        },
        endpoint: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        details: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        ipAddress: {
          type: Sequelize.STRING(45),
          allowNull: true,
        },
        userAgent: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        duration: {
          type: Sequelize.INTEGER,
          allowNull: true,
          comment: 'Duration in milliseconds',
        },
        success: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        errorMessage: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        timestamp: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      }
    );

    // Add indexes for better query performance
    const tableRef = { schema: 'users', tableName: 'activity_logs' };
    await queryInterface.addIndex(tableRef, ['userId'], { name: 'idx_activity_logs_user_id' });
    await queryInterface.addIndex(tableRef, ['sessionId'], { name: 'idx_activity_logs_session_id' });
    await queryInterface.addIndex(tableRef, ['action'], { name: 'idx_activity_logs_action' });
    await queryInterface.addIndex(tableRef, ['resource'], { name: 'idx_activity_logs_resource' });
    await queryInterface.addIndex(tableRef, ['timestamp'], { name: 'idx_activity_logs_timestamp' });
    await queryInterface.addIndex(tableRef, ['success'], { name: 'idx_activity_logs_success' });
    await queryInterface.addIndex(tableRef, ['userId','timestamp'], { name: 'idx_activity_logs_user_timestamp' });
    await queryInterface.addIndex(tableRef, ['action','timestamp'], { name: 'idx_activity_logs_action_timestamp' });
    await queryInterface.addIndex(tableRef, ['resource','timestamp'], { name: 'idx_activity_logs_resource_timestamp' });
    await queryInterface.addIndex(tableRef, ['userId','action'], { name: 'idx_activity_logs_user_action' });
  },

  down: async (queryInterface, Sequelize) => {
    const tableRef = { schema: 'users', tableName: 'activity_logs' };
    // Remove indexes
    await queryInterface.removeIndex(tableRef, 'idx_activity_logs_user_id');
    await queryInterface.removeIndex(tableRef, 'idx_activity_logs_session_id');
    await queryInterface.removeIndex(tableRef, 'idx_activity_logs_action');
    await queryInterface.removeIndex(tableRef, 'idx_activity_logs_resource');
    await queryInterface.removeIndex(tableRef, 'idx_activity_logs_timestamp');
    await queryInterface.removeIndex(tableRef, 'idx_activity_logs_success');
    await queryInterface.removeIndex(tableRef, 'idx_activity_logs_user_timestamp');
    await queryInterface.removeIndex(tableRef, 'idx_activity_logs_action_timestamp');
    await queryInterface.removeIndex(tableRef, 'idx_activity_logs_resource_timestamp');
    await queryInterface.removeIndex(tableRef, 'idx_activity_logs_user_action');

    // Drop the table (drops any associated types automatically)
    await queryInterface.dropTable(tableRef);
  }
};
