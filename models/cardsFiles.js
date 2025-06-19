// models/cardFiles.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CardFiles extends Model {
    static associate(models) {
     
      this.belongsTo(models.CardsFolders, {
        foreignKey: 'cardFolderId',
        targetKey: 'uuid',
        as: 'cardFolder',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  CardFiles.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cardFolderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: { schema: 'projects', tableName: 'CardsFolders' },
          key: 'uuid',
        },
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CardFiles',
      tableName: 'CardFiles',   // ensure this matches your CardFiles migration
      schema: 'projects',
      timestamps: true,
    }
  );

  return CardFiles;
};
