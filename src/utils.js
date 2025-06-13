const {
  createMessageComponentCollector,
  ComponentType,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  MessageFlags,
  deferUpdate,
} = require("discord.js");
const { PlayerUnits, Units } = require("./db");

const formatUnitString = (element, name, level, maxLevel, rarity) => {
  const elementEmoji = element ? elementToEmoji(element) : "";
  const levelString = level
    ? `(Lv. ${level} ${maxLevel ? "/ ".concat(maxLevel) : ""})`
    : "";
  const rarityEmoji = rarity ? rarityToEmoji(rarity) : "";

  return `${elementEmoji} ${name} ${levelString} ${rarityEmoji}`;
};

const elementToEmoji = (element) => {
  const elementEmojis = {
    fire: "🔥",
    water: "💧",
    nature: "🌿",
    electric: "⚡",
    dark: "🌑",
    light: "⚪",
  };
  return elementEmojis[element];
};

const rarityToEmoji = (rarity) => {
  return "⭐".repeat(rarity);
};

// Database
const getPlayerUnits = async (playerId) => {
  const units = await PlayerUnits.findAll({
    where: { playerId: interaction.user.id },
    include: {
      model: Units,
      as: "unit",
    },
  });

  return units.map((unit) => ({
    id: unit.unitId.toString(),
    name: unit.unit.name,
    description: unit.unit.description,
    element: unit.unit.element,
    level: unit.unitLevel,
    maxLevel: unit.unit.maxLevel,
    rarity: unit.unit.rarity,
  }));
};

module.exports = {
  formatUnitString,
  elementToEmoji,
  getPlayerUnits,
};
