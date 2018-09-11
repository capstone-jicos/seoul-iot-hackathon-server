export default (sequelize, DataType) => {
  const facets = sequelize.define('facets', {
    id: {
        type: DataType.INTEGER,
        primaryKey: true
    },
    value: DataType.STRING
  }, {
      timestamps: false
  });
  facets.associate = function(models) {
    // associations can be defined here
  };
  return facets;
};