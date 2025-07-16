'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      table_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      record_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING(50),
        allowNull: false,
        // You can use validate or enum in the model, but not in migration
        // comment: "'archived', 'deleted', 'restored', 'unarchived'",
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      performed_by: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      performed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      original_data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes
    await queryInterface.addIndex('audit_logs', ['table_name', 'record_id'], {
      name: 'idx_audit_logs_table_record',
    });
    await queryInterface.addIndex('audit_logs', ['action'], {
      name: 'idx_audit_logs_action',
    });
    await queryInterface.addIndex('audit_logs', ['performed_at'], {
      name: 'idx_audit_logs_performed_at',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('audit_logs', 'idx_audit_logs_table_record');
    await queryInterface.removeIndex('audit_logs', 'idx_audit_logs_action');
    await queryInterface.removeIndex('audit_logs', 'idx_audit_logs_performed_at');
    await queryInterface.dropTable('audit_logs');
  },
};
