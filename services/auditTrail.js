const { AuditLog, sequelize } = require('../models'); // adjust path as needed
const { Op } = require('sequelize');


class ArchiveService {
  
    // Generic archive function
    static async archiveRecord(model, recordId, userId = null, reason = null, metadata = {}) {
      const transaction = await sequelize.transaction();
      
      try {
        const record = await model.findByPk(recordId, { transaction });
        if (!record) {
          throw new Error('Record not found');
        }
  
        // Check if already archived
        const existingArchive = await AuditLog.findOne({
          where: {
            table_name: model.tableName,
            record_id: recordId,
            action: 'archived'
          },
          order: [['performed_at', 'DESC']],
          transaction
        });
  
        if (existingArchive) {
          // Check if it was later restored
          const laterRestore = await AuditLog.findOne({
            where: {
              table_name: model.tableName,
              record_id: recordId,
              action: 'restored',
              performed_at: {
                [Op.gt]: existingArchive.performed_at
              }
            },
            transaction
          });
  
          if (!laterRestore) {
            throw new Error('Record is already archived');
          }
        }
  
        // Update record status (if table has status field)
        if (record.status !== undefined) {
          await record.update({ status: 'archived' }, { transaction });
        }
  
        // Create audit log
        await AuditLog.create({
          table_name: model.tableName,
          record_id: recordId,
          action: 'archived',
          reason,
          performed_by: userId,
          metadata,
          original_data: record.toJSON()
        }, { transaction });
  
        await transaction.commit();
  
        return {
          success: true,
          message: 'Record archived successfully',
          data: record
        };
  
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
  
    // Generic soft delete function
    static async softDeleteRecord(model, recordId, userId = null, reason = null, metadata = {}) {
      const transaction = await sequelize.transaction();
      
      try {
        const record = await model.findByPk(recordId, { transaction });
        if (!record) {
          throw new Error('Record not found');
        }
  
        // Check if already deleted
        const existingDelete = await AuditLog.findOne({
          where: {
            table_name: model.tableName,
            record_id: recordId,
            action: 'deleted'
          },
          order: [['performed_at', 'DESC']],
          transaction
        });
  
        if (existingDelete) {
          const laterRestore = await AuditLog.findOne({
            where: {
              table_name: model.tableName,
              record_id: recordId,
              action: 'restored',
              performed_at: {
                [Op.gt]: existingDelete.performed_at
              }
            },
            transaction
          });
  
          if (!laterRestore) {
            throw new Error('Record is already deleted');
          }
        }
  
        // Update record status
        if (record.status !== undefined) {
          await record.update({ status: 'deleted' }, { transaction });
        }
  
        // Create audit log
        await AuditLog.create({
          table_name: model.tableName,
          record_id: recordId,
          action: 'deleted',
          reason,
          performed_by: userId,
          metadata,
          original_data: record.toJSON()
        }, { transaction });
  
        await transaction.commit();
  
        return {
          success: true,
          message: 'Record deleted successfully',
          data: record
        };
  
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
  
    // Simplified restore function - only needs userId and recordId
    static async restoreRecordById(recordId, userId, reason = null, metadata = {}) {
      const transaction = await sequelize.transaction();
      
      try {
        // First, find the last archived/deleted action for this record
        const lastAction = await AuditLog.findOne({
          where: {
            record_id: recordId,
            action: ['archived', 'deleted']
          },
          order: [['performed_at', 'DESC']],
          transaction
        });

        console.log(lastAction)

        if (!lastAction) {
          throw new Error('Record is not archived or deleted');
        }

        // Check if already restored after last archive/delete
        const laterRestore = await AuditLog.findOne({
          where: {
            table_name: lastAction.table_name,
            record_id: recordId,
            action: 'restored',
            performed_at: {
              [Op.gt]: lastAction.performed_at
            }
          },
          transaction
        });

        if (laterRestore) {
          throw new Error('Record is already restored');
        }

        // Get the model for this table
        const model = this.getModelByTableName(lastAction.table_name);
        if (!model) {
          throw new Error(`Model not found for table: ${lastAction.table_name}`);
        }

        console.log(model)
        const uuid = recordId

        // Find the actual record
        const record = await model.findByPk(uuid, { transaction });
        if (!record) {
          throw new Error('Record not found in database');
        }

        // Update record status if it has a status field
        if (record.status !== undefined) {
          await record.update({ status: 'active' }, { transaction });
        }

        // Create audit log for restoration
        await AuditLog.create({
          table_name: lastAction.table_name,
          record_id: recordId,
          action: 'restored',
          reason,
          performed_by: userId,
          metadata,
          original_data: record.toJSON()
        }, { transaction });

        await transaction.commit();

        return {
          success: true,
          message: 'Record restored successfully',
          data: {
            record: record.toJSON(),
            tableName: lastAction.table_name,
            modelName: model.name,
            restoredFrom: lastAction.action,
            restoredAt: new Date()
          }
        };

      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }

    // Keep the original function for backward compatibility
    static async restoreRecord(model, recordId, userId = null, reason = null, metadata = {}) {
      const transaction = await sequelize.transaction();
      
      try {
        const record = await model.findByPk(recordId, { transaction });
        if (!record) {
          throw new Error('Record not found');
        }

        // Check if record is actually archived/deleted
        const lastAction = await AuditLog.findOne({
          where: {
            table_name: model.tableName,
            record_id: recordId,
            action: ['archived', 'deleted']
          },
          order: [['performed_at', 'DESC']],
          transaction
        });

        if (!lastAction) {
          throw new Error('Record is not archived or deleted');
        }

        // Check if already restored after last archive/delete
        const laterRestore = await AuditLog.findOne({
          where: {
            table_name: model.tableName,
            record_id: recordId,
            action: 'restored',
            performed_at: {
              [Op.gt]: lastAction.performed_at
            }
          },
          transaction
        });

        if (laterRestore) {
          throw new Error('Record is already restored');
        }

        // Update record status
        if (record.status !== undefined) {
          await record.update({ status: 'active' }, { transaction });
        }

        // Create audit log
        await AuditLog.create({
          table_name: model.tableName,
          record_id: recordId,
          action: 'restored',
          reason,
          performed_by: userId,
          metadata,
          original_data: record.toJSON()
        }, { transaction });

        await transaction.commit();

        return {
          success: true,
          message: 'Record restored successfully',
          data: record
        };

      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
  
    // Permanent delete with file cleanup
    static async permanentDeleteRecord(model, recordId, userId = null, reason = null, metadata = {}) {
      const transaction = await sequelize.transaction();
      
      try {
        const record = await model.findByPk(recordId, { transaction });
        if (!record) {
          throw new Error('Record not found');
        }
  
        // Check if record is soft deleted first
        const lastAction = await AuditLog.findOne({
          where: {
            table_name: model.tableName,
            record_id: recordId,
            action: ['archived', 'deleted']
          },
          order: [['performed_at', 'DESC']],
          transaction
        });
  
        if (!lastAction) {
          throw new Error('Record must be archived or deleted before permanent deletion');
        }
  
        // Delete associated files if any
        const fileFields = ['document_path', 'file_path', 'path']; // Common file field names
        const fs = require('fs');
        
        for (const field of fileFields) {
          if (record[field]) {
            try {
              if (fs.existsSync(record[field])) {
                fs.unlinkSync(record[field]);
                console.log(`File deleted: ${record[field]}`);
              }
            } catch (fsError) {
              console.warn(`Could not delete file: ${record[field]}`, fsError.message);
            }
          }
        }
  
        // Create final audit log before deletion
        await AuditLog.create({
          table_name: model.tableName,
          record_id: recordId,
          action: 'permanently_deleted',
          reason,
          performed_by: userId,
          metadata,
          original_data: record.toJSON()
        }, { transaction });
  
        // Permanently delete the record
        await record.destroy({ transaction });
  
        await transaction.commit();
  
        return {
          success: true,
          message: 'Record permanently deleted'
        };
  
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
  
    // Get active records (excluding archived/deleted)
    static async getActiveRecords(model, whereClause = {}, options = {}) {
      const pkField = model.primaryKeyAttribute;

      try {
        // Get all archived/deleted record IDs
        const archivedDeletedIds = await AuditLog.findAll({
          where: {
            table_name: model.tableName,
            action: ['archived', 'deleted']
          },
          attributes: ['record_id', 'performed_at'],
          order: [['performed_at', 'DESC']]
        });
  
        // Get restored record IDs
        const restoredIds = await AuditLog.findAll({
          where: {
            table_name: model.tableName,
            action: 'restored'
          },
          attributes: ['record_id', 'performed_at'],
          order: [['performed_at', 'DESC']]
        });
  
        // Calculate actually archived/deleted records
        const actuallyInactive = [];
        const restoredMap = new Map();
        
        restoredIds.forEach(restore => {
          restoredMap.set(restore.record_id, restore.performed_at);
        });
  
        archivedDeletedIds.forEach(archived => {
          const restoreTime = restoredMap.get(archived.record_id);
          if (!restoreTime || archived.performed_at > restoreTime) {
            actuallyInactive.push(archived.record_id);
          }
        });
  
        // Query active records
        const activeWhereClause = {
          ...whereClause,
          [pkField]: { [Op.notIn]: actuallyInactive }
        };
  
        const records = await model.findAll({
          where: activeWhereClause,
          ...options
        });
  
        return {
          success: true,
          data: records,
          count: records.length
        };
  
      } catch (error) {
        throw error;
      }
    }


    static async getAllUserArchivedRecords(userId, action = 'archived', options = {}) {
      try {
      
    
        // Get all archived/deleted records by this user across all tables
        const userArchivedRecords = await AuditLog.findAll({
          where: {
            performed_by: userId,
            action: action
          },
          attributes: ['id', 'table_name', 'record_id', 'performed_at', 'reason', 'metadata', 'original_data'],
          order: [['performed_at', 'DESC']]
        });
    
       
    
        if (userArchivedRecords.length === 0) {
          return {
            success: true,
            data: [],
            count: 0,
            message: `No ${action} records found for this user`
          };
        }
    
        // Get all restored records to check which ones are actually still inactive
        const allRestoredRecords = await AuditLog.findAll({
          where: {
            action: 'restored'
          },
          attributes: ['table_name', 'record_id', 'performed_at']
        });
    
    
        // Create a map of restored records: table_name+record_id -> performed_at
        const restoredMap = new Map();
        allRestoredRecords.forEach(restore => {
          const key = `${restore.table_name}_${restore.record_id}`;
          restoredMap.set(key, restore.performed_at);
        });
    
        // Filter out records that have been restored after being archived
        const actuallyInactive = [];
        userArchivedRecords.forEach(archived => {
          const key = `${archived.table_name}_${archived.record_id}`;
          const restoreTime = restoredMap.get(key);
          
          if (!restoreTime || archived.performed_at > restoreTime) {
            actuallyInactive.push(archived);
          }
        });
    
        
    
        // Group records by table name and get current state
        const recordsByTable = {};
        
        for (const record of actuallyInactive) {
          if (!recordsByTable[record.table_name]) {
            recordsByTable[record.table_name] = {
              modelName: 'Unknown',
              records: []
            };
          }
    
          // Try to get current state of the record
          let currentState = null;
          let hasChanged = false;
          
          try {
            const model = this.getModelByTableName(record.table_name);
            if (model) {
              recordsByTable[record.table_name].modelName = model.name;
              
              const currentRecord = await model.findByPk(record.record_id, options);
              if (currentRecord) {
                currentState = currentRecord.toJSON();
                hasChanged = JSON.stringify(record.original_data) !== JSON.stringify(currentState);
              }
            }
          } catch (modelError) {
            console.warn(`⚠️ Error fetching current state for ${record.table_name}:`, modelError.message);
          }
    
          recordsByTable[record.table_name].records.push({
            recordId: record.record_id,
            archivedAt: record.performed_at,
            reason: record.reason,
            auditLogId: record.id,
            metadata: record.metadata || {},
            originalData: record.original_data || {},
            currentState: currentState,
            hasChanged: hasChanged,
            // Preview of key fields for quick reference
            preview: this.extractPreviewFromOriginalData(record.original_data)
          });
        }
    
        return {
          success: true,
          data: recordsByTable,
          count: actuallyInactive.length,
          summary: {
            totalTables: Object.keys(recordsByTable).length,
            recordsPerTable: Object.entries(recordsByTable).map(([table, tableData]) => ({
              tableName: table,
              count: tableData.records.length
            }))
          }
        };
    
      } catch (error) {
        console.error('Error getting all user archived records:', error);
        throw error;
      }
    }
    
    // Helper method to extract key fields for preview
    static extractPreviewFromOriginalData(originalData) {
      if (!originalData || typeof originalData !== 'object') {
        return null;
      }
    
      // Common fields to show in preview
      const previewFields = ['name', 'title', 'description', 'status', 'created_at', 'updated_at'];
      const preview = {};
      
      previewFields.forEach(field => {
        if (originalData[field] !== undefined) {
          preview[field] = originalData[field];
        }
      });
    
      return Object.keys(preview).length > 0 ? preview : null;
    }
    
    // Helper method to get model by table name
    static getModelByTableName(tableName) {
      try {
        // Method 1: Use sequelize.models to get the model
        if (sequelize && sequelize.models && sequelize.models[tableName]) {
          return sequelize.models[tableName];
        }
    
        // Method 2: Try to find by table name in sequelize models
        const model = Object.values(sequelize.models || {}).find(m => m.tableName === tableName);
        if (model) {
          return model;
        }
    
        // Method 3: Manual mapping if needed (you can customize this)
        const modelMap = {
          'Projects': sequelize.models.Project,
          'Users': sequelize.models.User,
          'Tasks': sequelize.models.Task,
          // Add other model mappings here based on your actual model names
        };
    
        return modelMap[tableName] || null;
    
      } catch (error) {
        console.warn(`Could not find model for table: ${tableName}`, error);
        return null;
      }
    }
    
  
    // Get archived/deleted records
    static async getInactiveRecords(model, action = 'archived', whereClause = {}, options = {}) {
      try {
        // Get archived/deleted record IDs
        const inactiveIds = await AuditLog.findAll({
          where: {
            table_name: model.tableName,
            action: action
          },
          attributes: ['record_id', 'performed_at'],
          order: [['performed_at', 'DESC']]
        });
  
        // Get restored record IDs
        const restoredIds = await AuditLog.findAll({
          where: {
            table_name: model.tableName,
            action: 'restored'
          },
          attributes: ['record_id', 'performed_at'],
          order: [['performed_at', 'DESC']]
        });
  
        // Calculate actually inactive records
        const actuallyInactive = [];
        const restoredMap = new Map();
        
        restoredIds.forEach(restore => {
          restoredMap.set(restore.record_id, restore.performed_at);
        });
  
        inactiveIds.forEach(inactive => {
          const restoreTime = restoredMap.get(inactive.record_id);
          if (!restoreTime || inactive.performed_at > restoreTime) {
            actuallyInactive.push(inactive.record_id);
          }
        });
  
        // Query inactive records
        const inactiveWhereClause = {
          ...whereClause,
          id: {
            [Op.in]: actuallyInactive
          }
        };
  
        const records = await model.findAll({
          where: inactiveWhereClause,
          ...options
        });
  
        return {
          success: true,
          data: records,
          count: records.length
        };
  
      } catch (error) {
        throw error;
      }
    }
  
    // Get audit history for a record
    static async getAuditHistory(model, recordId) {
      try {
        const history = await AuditLog.findAll({
          where: {
            table_name: model.tableName,
            record_id: recordId
          },
          order: [['performed_at', 'DESC']]
        });
  
        return {
          success: true,
          data: history,
          count: history.length
        };
  
      } catch (error) {
        throw error;
      }
    }
  }


  module.exports ={ArchiveService}
  