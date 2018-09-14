'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    Index: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    ID: DataTypes.STRING,
    PW: DataTypes.STRING,
    Name: DataTypes.STRING,
    Role: DataTypes.STRING
  }, {
      timestamps: false,
      freezeTableName: true
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};