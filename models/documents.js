'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate({ Output, Folder, SubFolder }) {
    
    }
  }

  Document.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    uuid: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    outputId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Outputs',
        key: 'uuid',
      },
    },
    folderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Folders',
        key: 'uuid',
      },
    },
    subFolderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'SubFolders',
        key: 'uuid',
      },
    },
    documentPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Document',
    schema: 'projects',
  });

  return Document;
};


