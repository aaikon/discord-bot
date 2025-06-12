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

// Interactions
const renderDialogue = async (
  interaction,
  dialogue,
  currentId,
  actions,
  context = {}
) => {
  const part = dialogue.parts.find((part) => part.id === currentId);
  if (!part) return;

  // Handle action parts
  if (part.action) {
    const actionHandler = actions?.[part.action];
    if (typeof actionHandler === "function") {
      return await actionHandler(interaction);
    }
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(dialogue.title)
    .addFields({ name: part.speaker, value: part.text });

  let row = null;
  if (Array.isArray(part.options) && part.options.length > 0) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId("dialogue")
      .setPlaceholder("[select]")
      .addOptions(
        part.options.map((opt) => ({
          label: opt.label,
          value: opt.next,
        }))
      );

    row = new ActionRowBuilder().addComponents(menu);
  }

  const sendMethod = context.initialMessageSent ? "followUp" : "reply";
  context.initialMessageSent = true;

  const sent = await interaction[sendMethod]({
    embeds: [embed],
    components: row ? [row] : [],
    flags: MessageFlags.Ephemeral,
  });

  if (row) {
    const collector = sent.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 3_600_000,
    });

    collector.on("collect", async (i) => {
      await i.update({ components: [] });
      const nextId = i.values[0];
      await renderDialogue(i, dialogue, nextId, actions, context);
    });
  }
};

module.exports = {
  formatUnitString,
  elementToEmoji,
  getPlayerUnits,
  renderDialogue,
};
