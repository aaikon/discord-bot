const {
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  MessageFlags,
  ButtonStyle,
} = require("discord.js");
const { where } = require("sequelize");
const { PlayerUnits, Units } = require("../db");
const { formatUnit } = require("../../utils");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("units")
    .setDescription("View your units.")
    .addStringOption((option) =>
      option
        .setName("sort")
        .setDescription("How you want to sort your units.")
        .setRequired(false)
        .addChoices(
          { name: "Name (A-Z)", value: "name_asc" },
          { name: "Level (High → Low)", value: "level_desc" },
          { name: "Rarity (High → Low)", value: "rarity_desc" }
        )
    ),

  async execute(interaction) {
    const sort = interaction.options.getString("sort");

    let order = [];
    switch (sort) {
      case "name_asc":
        order = [["name", "ASC"]];
        break;
      case "level_desc":
        order = [["level", "DESC"]];
        break;
      case "rarity_desc":
        order = [["rarity", "DESC"]];
        break;
    }

    const units = await PlayerUnits.findAll({
      where: { playerId: interaction.user.id },
      include: {
        model: Units,
        as: "unit",
      },
    });

    if (units.length === 0) {
      return interaction.reply({
        content: "You have no units.",
        flags: MessageFlags.Ephemeral,
        order,
      });
    }

    let message = `**Units** (${units.length} / 999)\n\n`;

    message += units
      .map((unit) => {
        const element = unit.unit.element;
        const name = unit.unit.name;
        const level = unit.unitLevel;
        const maxLevel = unit.unit.maxLevel;
        const rarity = unit.unit.rarity;
        return formatUnit(element, name, level, maxLevel, rarity);
      })
      .join("\n");

    await interaction.reply({
      content: message,
      flags: MessageFlags.Ephemeral,
    });
  },
};
