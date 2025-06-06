'use strict';
const { Sequelize, DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable({ schema: 'materials', tableName: 'Weeks' }, {
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
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      weekname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      facilitatorId: {
        type: Sequelize.UUID,
        references: {
          model: { schema: 'students', tableName: 'Facilitators' },
          key: 'uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      levelId: {
        type: Sequelize.UUID,
        references: {
          model: { schema: 'students', tableName: 'Levels' },
          key: 'uuid',
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
    await queryInterface.dropTable({ schema: 'materials', tableName: 'Weeks' });
  },
};
