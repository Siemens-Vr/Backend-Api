'use strict';

module.exports = (sequelize, DataTypes) => {
  const Cost_categories = sequelize.define(
    'Cost_categories',
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        unique:true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:false
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
      tableName: 'Cost_categories',
      schema: 'projects',
      timestamps: true,
    }
  );

  Cost_categories.associate = (models) => {
    Cost_categories.belongsTo(models.Milestone, {
      foreignKey: 'milestoneId',
      targetKey: 'uuid',
      as: 'Milestone',
    });
  };

  return Cost_categories;
};
