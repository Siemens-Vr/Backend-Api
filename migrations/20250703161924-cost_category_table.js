'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable({
      schema: 'projects',
      tableName: 'Cost_category_table',
    }, {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true,
      },
      no: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),  // up to 10 digits total, 2 after the decimal
        allowNull: false,
        defaultValue: 0.00,
      },
      cost_category_Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            schema: 'projects',
            tableName: 'Cost_categories',
          },
          key: 'uuid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable({
      schema: 'projects',
      tableName: 'Cost_category_table',
    });
  }
};
