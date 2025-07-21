'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Ensure the uuid extension is available (Postgres)
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );

    // 2. Create the "students" schema if it doesn't exist
    await queryInterface.createSchema('students');

    // 3. Create the table
    await queryInterface.createTable(
      { schema: 'students', tableName: 'Students' },
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
        },
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        regNo: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        kcseNo: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        gender: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        feePayment: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        examResults: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()'),
        },
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the table and schema in reverse order
    await queryInterface.dropTable({ schema: 'students', tableName: 'Students' });
    await queryInterface.dropSchema('students');
  },
};