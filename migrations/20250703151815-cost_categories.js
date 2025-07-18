'use strict';
const { Sequelize, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ensure uuid-ossp extension is available
    await queryInterface.sequelize.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
    );

    // create the card table
    await queryInterface.createTable(
      { schema: 'projects', tableName: 'Cost_categories' },
      {
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          allowNull: false,
          primaryKey: true,
        },
        id: {
          allowNull: false,
          autoIncrement: true,
          type: Sequelize.INTEGER,
          unique:true

        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
          unique:false
        },
        milestoneId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { schema: 'projects', tableName: 'Milestones' },
            key: 'uuid',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
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
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable({ schema: 'projects', tableName: 'Cost_categories' });
  }
};
