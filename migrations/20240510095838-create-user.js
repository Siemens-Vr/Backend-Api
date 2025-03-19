'use strict';
const { Sequelize, DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Create enum types explicitly in the 'users' schema
  await queryInterface.sequelize.query(`
    DO $$ BEGIN 
      CREATE TYPE "users"."enum_Users_type" AS ENUM('Staff', 'Admin'); 
    EXCEPTION 
      WHEN duplicate_object THEN null; 
    END $$;
  `);

  await queryInterface.sequelize.query(`
    DO $$ BEGIN 
      CREATE TYPE "users"."enum_Users_role" AS ENUM('Admin', 'Project', 'Student', 'Equipment', 'Staff'); 
    EXCEPTION 
      WHEN duplicate_object THEN null; 
    END $$;
  `);

    await queryInterface.createTable(
      { schema: 'users', tableName: 'Users' },
      {
        uuid: {
          primaryKey: true,
          allowNull: false,
          type: DataTypes.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        gender: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        phoneNumber: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        idNumber: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true,
        },
        dateJoined: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        isDefaultPassword: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM({
            values: ['Staff', 'Admin'],
            schema: 'users', 
            name: 'enum_Users_type',
          }),
          allowNull: false,
          defaultValue: 'Staff',
        },
        role: {
          type: Sequelize.ENUM({
            values: ['Admin', 'Project', 'Student', 'Equipment', 'Staff'],
            schema: 'users',
            name: 'enum_Users_role',
          }),
          allowNull: false,
          defaultValue: 'Staff',
        },
        isApproved: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        resetPasswordToken: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        resetPasswordExpiresAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('NOW()'),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('NOW()'),
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ schema: 'users', tableName: 'Users' });
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "users"."enum_Users_type" CASCADE`);
  await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "users"."enum_Users_role" CASCADE`);
  },
};
