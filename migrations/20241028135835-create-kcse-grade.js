'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable the "uuid-ossp" extension for generating UUIDs
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    
    // Create the 'KcseGrades' table in the 'applicants' schema
    await queryInterface.createTable({ tableName: 'KcseGrades', schema: 'applicants' }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        unique:true,
      },
      student_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'StudentInfos',
            schema: 'applicants',
          },
          key: 'uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      kcse_index: {
        type: Sequelize.STRING,
      },
      kcse_year: {
        type: Sequelize.STRING,
      },
      preferred_campus: {
        type: Sequelize.STRING,
      },
      kcse_mean_grade: {
        type: Sequelize.STRING,
      },
      kcse_certificate:{
        type: Sequelize.STRING,
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
    // Drop the 'KcseGrades' table from the 'applicants' schema
    await queryInterface.dropTable({ tableName: 'KcseGrades', schema: 'applicants' });
  }
};
