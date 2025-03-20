// const { Sequelize, Model } = require('sequelize');

// module.exports = (sequelize, DataTypes) => {
//   class Todo extends Model {
//     static associate(models) {
//       // Association with User (foreign key: userUUID)
//       this.belongsTo(models.User, {
//         foreignKey: 'userUUID',
//         targetKey: 'uuid',
//         as: 'user',
//       });
//     }
//   }

//   Todo.init(
//     {

//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       userUUID: { 
//         type: DataTypes.UUID,
//         allowNull: false,
//         references: {
//           model: 'Users', 
//           key: 'uuid',
//         },
//       },

//       description: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },

//       createdDate: {
//         type: DataTypes.DATEONLY,
//         allowNull: false,
//         defaultValue: DataTypes.NOW,
//       },
//       dueDate: {
//         type: DataTypes.DATEONLY,
//         allowNull: false,
//       },
//       isCompleted: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//       },
//     },
//     {
//       sequelize,
//       modelName: 'Todo',
//       schema: 'students',
//       timestamps: true, // This adds createdAt and updatedAt fields automatically
//     }
//   );

//   return Todo;
// };




// models/Todo.js
const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Todo extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userUUID',
        targetKey: 'uuid',
        as: 'userleaves',
      });
    }
  }

  Todo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userUUID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Todo',
      schema: 'students', // Ensure it is on the correct schema
      timestamps: true,
    }
  );

  return Todo;
};

