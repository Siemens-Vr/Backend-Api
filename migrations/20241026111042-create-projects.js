'use strict';
const { allow } = require('joi');
const { Sequelize, DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryInterface.createTable({ schema: 'projects', tableName: 'Projects'},  {
      id:{
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
      project_id:{
        type:Sequelize.STRING,
        allowNull:true,
        unique:true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type:{
        type: Sequelize.ENUM('Milestones', 'Work Package', 'Duration Years'),
        defaultValue:"Milestones",
        allowNull:false
      },
      total_value: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      approved_funding: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      implementation_startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      implementation_endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
       createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: { schema: 'users', tableName: 'Users' }, // adjust schema/table name as needed
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: { schema: 'users', tableName: 'Users' }, // adjust schema/table name as needed
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
 
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ schema: 'projects', tableName: 'Projects'});
  }
};