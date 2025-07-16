'use strict';
const { Sequelize, DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable({schema: 'projects', tableName: 'Milestones'}, {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      no:{
        allowNull: false,
        type: Sequelize.INTEGER,
        

      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      implementation_startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      implementation_endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      projectId: {
        type: Sequelize.UUID,
        references: {
          model: 'Projects',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({schema: 'projects', tableName: 'Milestones'});
  },
};
