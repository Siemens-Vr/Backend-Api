const { Sequelize, Model } = require('sequelize');

// models/RefreshToken.js
module.exports = (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define('RefreshToken', {
    uuid: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue:Sequelize.literal('uuid_generate_v4()'),
        },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      schema: 'users', 
    });
  
    RefreshToken.associate = (models) => {
      RefreshToken.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return RefreshToken;
  };
  