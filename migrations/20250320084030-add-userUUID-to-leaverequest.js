'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add 'userUUID' column with allowNull: true temporarily
    await queryInterface.addColumn(
      { tableName: 'LeaveRequests', schema: 'students' },
      'userUUID',
      {
        type: Sequelize.UUID,
        allowNull: true, // Temporarily allow NULL
        references: {
          model: {
            tableName: 'Users',
            schema: 'users',
          },
          key: 'uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    );

    // Step 2: Populate existing rows with a default userUUID
    await queryInterface.sequelize.query(`
      UPDATE "students"."LeaveRequests"
      SET "userUUID" = (
        SELECT "uuid" FROM "users"."Users" LIMIT 1
      )
      WHERE "userUUID" IS NULL;
    `);

    // Step 3: Alter column to allowNull: false
    await queryInterface.changeColumn(
      { tableName: 'LeaveRequests', schema: 'students' },
      'userUUID',
      {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'Users',
            schema: 'users',
          },
          key: 'uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      { tableName: 'LeaveRequests', schema: 'students' },
      'userUUID'
    );
  },
};
