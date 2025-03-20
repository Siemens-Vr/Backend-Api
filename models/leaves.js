'use strict';
const { Sequelize, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Leave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with Facilitators model
      this.belongsTo(models.User, {
        foreignKey: 'userUUID', 
        targetKey: 'uuid', 
        as:'userleaves'
      });

         // One-to-one relationship with LeaveRequest
         Leave.hasOne(models.LeaveRequest, {
          foreignKey: 'leaveUUID',
          as: 'leaveRequest'
          
        });
    }
  }
  Leave.init({

     uuid: {
       defaultValue: DataTypes.UUIDV4,
       primaryKey: true,
       type: DataTypes.UUID,
     },
     
    userUUID:{
      type:Sequelize.UUID,
      allowNull:false,
      defaultValue:Sequelize.literal('uuid_generate_v4()'),
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false
    },

    days:{ 
      type: DataTypes.DATE,
      allowNull:true
    },
   
  }, {
    sequelize,
    modelName: 'Leaves',
    schema: 'students',
  });
  return Leave;
};
