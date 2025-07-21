'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Sequelize, DataTypes}  =  require('sequelize')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    await queryInterface.createTable({schema: 'users', tableName: 'users_Notifications' }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        // primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        allowNull: true,
        type: DataTypes.UUID,
        defaultValue:Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      outputId:{
      type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: { schema: 'projects', tableName: 'Outputs' }, // adjust schema/table name as needed
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'

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
      message: {
        type: Sequelize.TEXT
      },
      isRead: {
        type: Sequelize.BOOLEAN
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
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({schema: 'users', tableName: 'users_Notifications' });
  }
};