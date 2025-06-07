const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const Units = sequelize.define("units", {
  id: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  description: Sequelize.TEXT,
  element: Sequelize.STRING,
});

const PlayerUnits = sequelize.define("playerUnits", {
  unitId: {
    type: Sequelize.STRING,
    allowNull: false,
    references: {
      model: Units,
      key: "id",
    },
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = {
  sequelize,
  Units,
  PlayerUnits,
};
