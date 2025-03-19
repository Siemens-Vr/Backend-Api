const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Transport extends Model {
    static associate({ Output }) {
      this.belongsTo(Output, {
        foreignKey: 'outputId',
        as: 'output',
      });
    }
  }

  Transport.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true,
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
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      travelPeriod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      travelers: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      dateOfRequest: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dateReceived: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approver: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      approvalDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      document: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      documentName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PvNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      claimNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accounted: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateAccounted: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      allowance: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      beneficiary: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      schema: 'projects',
      tableName: 'Transport',
      modelName: 'Transport',
      timestamps: true,
    }
  );

  return Transport;
};
