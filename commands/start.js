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
} = require("../utils.js");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("start").setDescription("Start."),

  async execute(interaction) {
    const dialogue = {
      title: "The Beginning",
      parts: [
        {
          id: "intro1",
          speaker: "Bob",
          text: "Are you okay?",
          options: [
            { label: "Yes", next: "intro2" },
            { label: "No", next: "intro3" },
          ],
        },
        {
          id: "intro2",
          speaker: "Bob",
          text: "Glad to hear it!",
          options: [{ label: "Cool", next: "intro4" }],
        },
        {
          id: "intro3",
          speaker: "Bob",
          text: "That's too bad...",
          options: [{ label: "Cool", next: "intro4" }],
        },
        {
          id: "intro4",
          speaker: "Bob",
          text: "XDDD",
          options: [{ label: "Restart", next: "intro1" }],
        },
      ],
    };

    await renderDialogue(interaction, dialogue, "intro1", {});
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
