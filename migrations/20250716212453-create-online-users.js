'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
    );
    // Create table in 'users' schema
    await queryInterface.createTable(
      { schema: 'users', tableName: 'online_users' },
      {
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { schema: 'users', tableName: 'Users' },
            key: 'uuid'
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
          type: Sequelize.STRING(45),
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
          allowNull: false,
          defaultValue: 'online'
        },
        lastActivity: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        connectedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: { // FIXED: was "updatedat"
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }
    );

    // Add indexes specifying the same schema
    const tableRef = { schema: 'users', tableName: 'online_users' };
    await queryInterface.addIndex(tableRef, ['userId'], { name: 'idx_online_users_user_id' });
    await queryInterface.addIndex(tableRef, ['sessionId'], { name: 'idx_online_users_session_id' });
    await queryInterface.addIndex(tableRef, ['socketId'], { name: 'idx_online_users_socket_id' });
    await queryInterface.addIndex(tableRef, ['lastActivity'], { name: 'idx_online_users_last_activity' });
    await queryInterface.addIndex(tableRef, ['status'], { name: 'idx_online_users_status' });
    await queryInterface.addIndex(tableRef, ['userId', 'status'], { name: 'idx_online_users_user_status' });
  },

  down: async (queryInterface, Sequelize) => {
    const tableRef = { schema: 'users', tableName: 'online_users' };
    // Remove indexes
    await queryInterface.removeIndex(tableRef, 'idx_online_users_user_id');
    await queryInterface.removeIndex(tableRef, 'idx_online_users_session_id');
    await queryInterface.removeIndex(tableRef, 'idx_online_users_socket_id');
    await queryInterface.removeIndex(tableRef, 'idx_online_users_last_activity');
    await queryInterface.removeIndex(tableRef, 'idx_online_users_status');
    await queryInterface.removeIndex(tableRef, 'idx_online_users_user_status');

    // Drop table (this also drops the ENUM type in Postgres automatically)
    await queryInterface.dropTable(tableRef);
  }
};