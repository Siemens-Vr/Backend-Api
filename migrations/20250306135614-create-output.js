'use strict';
const { Sequelize, DataTypes } = require('sequelize');


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable({
      schema: 'projects',
      tableName: 'Outputs',
    }, {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true,
      },
      no:{
        type: Sequelize.INTEGER,
        allowNull: false,

      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      document_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      document_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isIn: [[0, 1]]
        },
        comment: 'Value can only be 0 or 1'
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Approval status of the output'
      },
      milestoneId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            schema: 'projects',
            tableName: 'Milestones',
          },
          key: 'uuid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
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
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable({
      schema: 'projects',
      tableName: 'Outputs',
    });
  }
};