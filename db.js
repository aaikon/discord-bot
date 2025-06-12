const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const Units = sequelize.define("units", {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  description: Sequelize.TEXT,
  element: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  rarity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isStarter: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  maxLevel: {
    type: Sequelize.INTEGER,
    defaultValue: 30,
  },
});

const PlayerUnits = sequelize.define(
  "playerUnits",
  {
    unitId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: Units,
        key: "id",
      },
    },
    playerId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    unitLevel: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  },
  { noPrimaryKey: true }
);

const Players = sequelize.define("players", {
  playerId: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true,
  },
  gold: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});

const Quests = sequelize.define("quests", {
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  minLevel: Sequelize.INTEGER,
  maxUnits: Sequelize.INTEGER,
  isActive: Sequelize.BOOLEAN,
});

Units.hasMany(PlayerUnits, { foreignKey: "unitId" });
PlayerUnits.belongsTo(Units, { foreignKey: "unitId" });

module.exports = {
  sequelize,
  Units,
  PlayerUnits,
  Players,
  Quests,
};
