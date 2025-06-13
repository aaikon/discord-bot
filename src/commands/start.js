const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  MessageFlags,
  ComponentType,
} = require("discord.js");
const { Units, PlayerUnits, Players } = require("../db.js");
const { formatUnitString } = require("../utils.js");
const { DialogueBuilder } = require("../builders/DialogueBuilder.js");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("start").setDescription("Start."),
  async execute(interaction) {
    const starters = await Units.findAll({ where: { isStarter: true } });

    const dialogue = new DialogueBuilder()
      .setTitle("The Beginning")
      .addNode({
        id: "intro1",
        speaker: "Narrator",
        text: "Hello summoner. Are you ready to start your journey?",
        options: [
          { label: "Yes", next: "intro2" },
          { label: "No", next: "intro3" },
        ],
      })
      .addNode({
        id: "intro2",
        speaker: "Narrator",
        text: "Very well then. Choose your starter.",
        options: starters.map((starter) => ({
          label: formatUnitString(null, starter.name, null, null, null),
          next: "intro4",
          action: async (interaction) => {
            console.log("Selected starter:", starter.name);
            await Players.create({ playerId: interaction.user.id });
            await PlayerUnits.create({
              playerId: interaction.user.id,
              unitId: starter.id,
            });
          },
        })),
      })
      .addNode({
        id: "intro3",
        speaker: "Narrator",
        text: "Come back when you're ready.",
      })
      .addNode({
        id: "intro4",
        speaker: "Narrator",
        text: "Your journey begins now...",
      });

    await dialogue.start(interaction);
  },
};
