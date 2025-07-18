'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable({ schema: 'projects', tableName: 'Personnel' }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: { schema: 'users', tableName: 'Users' }, // adjust schema/table name as needed
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: { schema: 'projects', tableName: 'Projects' },
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role: {
        type: Sequelize.ENUM(
          'Project Manager', 
          'Team Lead', 
          'Developer', 
          'Designer', 
          'Analyst', 
          'Tester', 
          'Stakeholder',
          'Client',
          'Consultant'
        ),
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      responsibilities: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: { schema: 'users', tableName: 'Users' },
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: { schema: 'users', tableName: 'Users' },
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });

    // Add composite unique constraint to prevent duplicate user-project-role combinations
    await queryInterface.addIndex({ schema: 'projects', tableName: 'Personnel' }, {
      fields: ['userId', 'projectId', 'role'],
      unique: true,
      name: 'unique_user_project_role'
    });

    // Add individual indexes for better query performance
    await queryInterface.addIndex({ schema: 'projects', tableName: 'Personnel' }, {
      fields: ['userId'],
      name: 'idx_personnel_user'
    });

    await queryInterface.addIndex({ schema: 'projects', tableName: 'Personnel' }, {
      fields: ['projectId'],
      name: 'idx_personnel_project'
    });

    await queryInterface.addIndex({ schema: 'projects', tableName: 'Personnel' }, {
      fields: ['role'],
      name: 'idx_personnel_role'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ schema: 'projects', tableName: 'Personnel' });
  }
};