const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  MessageFlags,
  ComponentType,
} = require("discord.js");
const { Units, PlayerUnits, Players } = require("../db.js");
const {
  elementToEmoji,
  formatUnitString,
  renderDialogue,
} = require("../../utils.js");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("start").setDescription("Start."),
  async execute(interaction) {
    const starters = await Units.findAll({ where: { isStarter: true } });

    const dialogue = {
      title: "The Beginning",
      parts: [
        {
          id: "intro1",
          speaker: "Narrator",
          text: "Hello summoner. Are you ready to start your journey?",
          options: [
            { label: "Yes", next: "intro2" },
            { label: "No", next: "intro3" },
          ],
        },
        {
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
        },
        {
          id: "intro3",
          speaker: "Narrator",
          text: "Come back when you're ready.",
        },
        {
          id: "intro4",
          speaker: "Narrator",
          text: "Your journey begins now...",
        },
      ],
    };

    await renderDialogue(interaction, dialogue, "intro1");
    /*
    const starters = await Units.findAll({ where: { isStarter: true } });

    if (!starters.length) {
      return interaction.reply({
        content: "Error: No starters found in the database",
        flags: MessageFlags.Ephemeral,
      });
    }

    const select = new StringSelectMenuBuilder()
      .setCustomId("starter")
      .setPlaceholder("Choose")
      .addOptions(
        starters.map((unit) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(unit.name)
            .setDescription(unit.description)
            .setValue(unit.id.toString())
            .setEmoji(elementToEmoji(unit.element))
        )
      );

    const row = new ActionRowBuilder().addComponents(select);

    const response = await interaction.reply({
      content: "Choose your starter!",
      flags: MessageFlags.Ephemeral,
      components: [row],
      withResponse: true,
    });

    const collector = response.resource.message.createMessageComponentCollector(
      { componentType: ComponentType.StringSelect, time: 3_600_000 }
    );

    collector.on("collect", async (i) => {
      const selection = i.values[0];
      const selectedUnit = starters.find(
        (unit) => unit.id.toString() === selection
      );

      const disabledMenu = new StringSelectMenuBuilder()
        .setCustomId("starter")
        .setPlaceholder(selectedUnit.name)
        .setDisabled(true)
        .addOptions(select.options);

      const disabledRow = new ActionRowBuilder().addComponents(disabledMenu);

      await i.update({
        content: `You have chosen **${selectedUnit.name}** as your starter!`,
        flags: MessageFlags.Ephemeral,
        components: [disabledRow],
      });

      await interaction.channel.send({
        content: `${i.user} has started their journey!`,
      });

      await Players.create({ playerId: i.user.id });
      await PlayerUnits.create({ unitId: selection, playerId: i.user.id });

      collector.stop();
    });
    */
  },
};
