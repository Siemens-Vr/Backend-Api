'use strict';

module.exports = (sequelize, DataTypes) => {
  const Cards = sequelize.define(
    'Cards',
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      milestoneId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            schema: 'projects',
            tableName: 'Milestones',
          },
          key: 'uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    },
    {
      tableName: 'Cards',
      schema: 'projects',
      timestamps: true,
    }
  );

  Cards.associate = (models) => {
    Cards.belongsTo(models.Milestone, {
      foreignKey: 'milestoneId',
      targetKey: 'uuid',
      as: 'Milestone',
    });
  };

  return Cards;
};
