'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SubFolder extends Model {
    static associate({ Project, Folder,Document }) {
      // Define association to Project mode
      this.belongsTo(Folder, {
        foreignKey: {
          name: 'folderId',
          allowNull: false
        },
        as: 'parentFolder',
        onDelete: 'CASCADE'
      });
      this.hasMany(Document, {
        foreignKey: 'subFolderId',
        as: 'documents',
        onDelete: 'CASCADE',
      });

    }
  }

  SubFolder.init(
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
        allowNull: false,
      },
      folderName: {
        type: DataTypes.STRING,
        allowNull: false,
       
      },
     
      folderId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            schema: 'projects',
            tableName: 'Folders'
          },
          key: 'uuid'
        }
      },
      subFolderId:{
        type:DataTypes.UUID,
        allowNull:true,
        references: {
          model: {
            schema: 'projects',
            tableName: 'SubFolders'
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
      modelName: 'SubFolder',
      schema: 'projects',
      tableName: 'SubFolders',
      timestamps: true,
    }
  );

  return SubFolder;
};