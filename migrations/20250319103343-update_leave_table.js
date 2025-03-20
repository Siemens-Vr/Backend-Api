'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Describe the Leaves table schema
    const table = await queryInterface.describeTable({
      tableName: 'Leaves',
      schema: 'students',
    });

    // Ensure 'uuid' exists and is the primary key
    if (!table.uuid) {
      await queryInterface.addColumn(
        { tableName: 'Leaves', schema: 'students' },
        'uuid',
        {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        }
      );

      await queryInterface.addConstraint(
        { tableName: 'Leaves', schema: 'students' },
        {
          fields: ['uuid'],
          type: 'primary key',
          name: 'pk_leaves_uuid',
        }
      );
    }

    // Force rename 'staffUUID' to 'userUUID' without condition
    if (table.staffUUID) {
      await queryInterface.renameColumn(
        { tableName: 'Leaves', schema: 'students' },
        'staffUUID',
        'userUUID'
      );
    } else if (table.userUUID) {
      console.log('Column already renamed to userUUID');
    } else {
      console.warn('staffUUID column not found!');
    }

    // Force add 'name' column if missing
    if (!table.name) {
      await queryInterface.addColumn(
        { tableName: 'Leaves', schema: 'students' },
        'name',
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      );

      // Ensure existing rows are updated before making the column NOT NULL
      await queryInterface.sequelize.query(
        `UPDATE "students"."Leaves" SET "name" = 'Default Name' WHERE "name" IS NULL;`
      );

      // Make 'name' NOT NULL after population
      await queryInterface.changeColumn(
        { tableName: 'Leaves', schema: 'students' },
        'name',
        {
          type: Sequelize.STRING,
          allowNull: false,
        }
      );
    } else {
      console.log('name column already exists');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove uuid primary key if it exists
    await queryInterface.removeConstraint(
      { tableName: 'Leaves', schema: 'students' },
      'pk_leaves_uuid'
    );

    const table = await queryInterface.describeTable({
      tableName: 'Leaves',
      schema: 'students',
    });

    // Drop 'uuid' column
    if (table.uuid) {
      await queryInterface.removeColumn(
        { tableName: 'Leaves', schema: 'students' },
        'uuid'
      );
    }

    // Drop 'name' column
    if (table.name) {
      await queryInterface.removeColumn(
        { tableName: 'Leaves', schema: 'students' },
        'name'
      );
    }

    // Rename 'userUUID' back to 'staffUUID'
    if (table.userUUID) {
      await queryInterface.renameColumn(
        { tableName: 'Leaves', schema: 'students' },
        'userUUID',
        'staffUUID'
      );
    }
  },
};
