'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn({ tableName: 'Report', schema: 'projects' }, 'projectId');
    await queryInterface.addColumn({ tableName: 'Report', schema: 'projects' }, 'outputId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Outputs',
        key: 'uuid',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn({ tableName: 'Report', schema: 'projects' }, 'outputId');
    await queryInterface.addColumn({ tableName: 'Report', schema: 'projects' }, 'projectId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'uuid',
      },
    });
  },
};
