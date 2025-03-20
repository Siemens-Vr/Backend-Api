// migrations/xxxx-create-todos.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Todos',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userUUID: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'Users',
              schema: 'users', // Ensure correct schema
            },
            key: 'uuid',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        createdDate: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW'),
        },
        dueDate: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        isCompleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW'),
        },
      },
      {
        schema: 'students', // Ensure Todos table is on the correct schema
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Todos', { schema: 'students' });
  },
};
