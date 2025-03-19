'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Folder extends Model {
    static associate({ Output,SubFolder, Document}) {
      this.belongsTo(Output, {
        foreignKey: {
          name: 'outputId',
          allowNull: false
        },
        as: 'outputs',
        onDelete: 'CASCADE', 
      });
      this.hasMany(SubFolder, {
        foreignKey: 'folderId',
        as: 'subFolders',
        onDelete: 'CASCADE',
      });
      this.hasMany(Document, {
        foreignKey: 'folderId',
        as: 'documents',
        onDelete: 'CASCADE',
      });
    }
  }

  Folder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      folderName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: 'unique_folder_name_per_project',
          msg: 'Folder name must be unique within the project',
        },
      },
      outputId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            schema: 'projects',
            tableName: 'Projects'
          },
          key: 'uuid'
        }
      },

      
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Folder',
      schema: 'projects',
      tableName: 'Folders',
      timestamps: true,
    }
  );

  return Folder;
};