'use strict';
module.exports = (sequelize, DataTypes) => {
  const seat = sequelize.define('seat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    busId: DataTypes.INTEGER,
    seatNum: DataTypes.STRING,
    seated: DataTypes.BOOLEAN,
    buckled: DataTypes.BOOLEAN,
    override: DataTypes.BOOLEAN
  }, {
      freezeTableName: true,
      timestamps: false
  });
  seat.associate = function(models) {
    // associations can be defined here
  };
  return seat;
};