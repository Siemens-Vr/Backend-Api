'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add a new UUID column (temporary)
    await queryInterface.addColumn(
      { tableName: 'Todos', schema: 'students' },
      'new_id',
      {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      }
    );

    // Step 2: Copy data from 'id' to 'new_id'
    await queryInterface.sequelize.query(
      'UPDATE "students"."Todos" SET "new_id" = gen_random_uuid();'
    );

    // Step 3: Drop the old 'id' column
    await queryInterface.removeColumn(
      { tableName: 'Todos', schema: 'students' },
      'id'
    );

    // Step 4: Rename 'new_id' to 'id'
    await queryInterface.renameColumn(
      { tableName: 'Todos', schema: 'students' },
      'new_id',
      'id'
    );

    // Step 5: Remove 'dueDate' column
    await queryInterface.removeColumn(
      { tableName: 'Todos', schema: 'students' },
      'dueDate'
    );
  },

  async down(queryInterface, Sequelize) {
    // Revert: Add old 'id' column (INTEGER)
    await queryInterface.addColumn(
      { tableName: 'Todos', schema: 'students' },
      'old_id',
      {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      }
    );

    // Drop the UUID 'id' column
    await queryInterface.removeColumn(
      { tableName: 'Todos', schema: 'students' },
      'id'
    );

    // Rename 'old_id' back to 'id'
    await queryInterface.renameColumn(
      { tableName: 'Todos', schema: 'students' },
      'old_id',
      'id'
    );

    // Restore 'dueDate' column
    await queryInterface.addColumn(
      { tableName: 'Todos', schema: 'students' },
      'dueDate',
      {
        type: Sequelize.DATEONLY,
        allowNull: false,
      }
    );
  },
};
