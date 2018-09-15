'use strict';
module.exports = (sequelize, DataTypes) => {
  const sensors = sequelize.define('sensorValue', {
      sensorId: {
          type:DataTypes.STRING,
          primaryKey:true
      },
      value: DataTypes.INTEGER
  },{
      timestamps: false,
      freezeTableName: true
  });
  sensors.associate = function(models) {
    // associations can be defined here
  };
  return sensors;
};