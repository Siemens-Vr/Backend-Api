const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Report extends Model {
    static associate({ Output }) {
      this.belongsTo(Output, {
        foreignKey: 'outputId',
        as: 'output',
      });
    }

  }

  Report.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
      },
      outputId: {  // Updated reference to Output
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Outputs',  // Ensure correct table name
          key: 'uuid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      document: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      documentName:{
        type: DataTypes.STRING, 
        allowNull: true,
      },

    },
    {
      sequelize,
      schema: 'projects',
      tableName: 'Report',
      modelName: 'Report',
      timestamps: true,
    }
  );

  return Report;
};
