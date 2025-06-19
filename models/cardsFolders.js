'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CardsFolders extends Model {
    static associate(models) {
      this.belongsTo(models.Cards, {
        foreignKey: 'cardId',
        allowNull: false,
        as: 'cards',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.CardFiles, {
        foreignKey: 'cardFolderId',
        as: 'files',
      });
    }
  }

  CardsFolders.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      folderName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'unique_folder_name_per_project',
      },
      cardId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Cards',
          key: 'uuid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'CardsFolders',
      tableName: 'CardsFolders',
      schema: 'projects',
      timestamps: true,
    }
  );

  return CardsFolders;
};
