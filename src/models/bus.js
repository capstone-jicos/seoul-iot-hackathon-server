'use strict';
module.exports = (sequelize, DataTypes) => {
  const bus = sequelize.define('bus', {
    index: {
      type: DataTypes.INTEGER,
      primaryKey:true
    },
    uniqueBusNum: DataTypes.STRING,
    busNum: DataTypes.STRING
  }, {
      timestamps: false,
      freezeTableName: true
  });
  bus.associate = function(models) {
    // associations can be defined here
  };
  return bus;
};