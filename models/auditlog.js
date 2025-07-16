'use strict';

module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    table_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    record_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM(
        'archived',
        'deleted',
        'restored',
        'unarchived',
        'updated',
        'created',
        'permanently_deleted'
      ),
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    performed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    performed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    original_data: {
      type: DataTypes.JSONB,
      allowNull: true,
    }
  }, {
    tableName: 'audit_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  // Optional: define associations here if you need to
  AuditLog.associate = function(models) {
    // Example:
    // AuditLog.belongsTo(models.User, { foreignKey: 'performed_by' });
  };

  return AuditLog;
};
