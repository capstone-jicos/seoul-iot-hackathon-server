'use strict';
module.exports = (sequelize, DataTypes) => {
  const sensorValue = sequelize.define('sensorValue', {
    sensorId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    value: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    timestamps: false
  });
  sensorValue.associate = function(models) {
    // associations can be defined here
  };
  return sensorValue;
};