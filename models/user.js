'use strict';
const {
  Model,
  STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    uuid: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    firstName: {
      type:DataTypes.STRING,
      allowNull:false
    },
    lastName:{
      type: DataTypes.STRING,
      allowNull:false
    },
    role:{
      type: DataTypes.ENUM('admin', 'student', 'equipment'),
      allowNull: false,
      defaultValue: 'student',
    },

    email: DataTypes.STRING,
    password:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    isActive:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }

  }, {
    sequelize,
    modelName: 'User',
    schema: 'users',
  });
  return User;
};