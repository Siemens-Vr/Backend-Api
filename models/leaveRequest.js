const { Sequelize, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LeaveRequest extends Model {
    

    static associate(models) {

 
      this.belongsTo(models.Leaves, {
         foreignKey: 'leaveUUID',
         targetKey:'uuid',
         as:'Leaves'
         });

 
      this.belongsTo(models.User, {
        foreignKey: 'userUUID', 
        targetKey: 'uuid', 
        as:'userleaves'
      });

    }
  }

  LeaveRequest.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      leaveUUID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
     
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          isAfterStartDate(value) {
            if (this.startDate && value <= this.startDate) {
              throw new Error('End date must be after start date.');
            }
          },
        },
      },
      Reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Status: {
        type: DataTypes.ENUM('Approved', 'Pending', 'Denied'),
        defaultValue: 'Pending',
      },
    },
    {
      sequelize,
      modelName: 'LeaveRequest',
      schema: 'students',
      timestamps: true,
    }
  );

  return LeaveRequest;
};
