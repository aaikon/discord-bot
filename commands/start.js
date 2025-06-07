const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  MessageFlags,
  ComponentType,
} = require("discord.js");

const { Units, PlayerUnits } = require("../db.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Used to get your starter"),

  async execute(interaction) {
    const starters = await Units.findAll({
      where: {
        id: ["001", "002", "003"],
      },
    });

    const select = new StringSelectMenuBuilder()
      .setCustomId("starter")
      .setPlaceholder("Choose your starter!")
      .addOptions(
        starters.map((unit) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(unit.name)
            .setDescription(unit.description)
            .setValue(unit.id)
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
      const selectedUnit = starters.find((unit) => unit.id === selection);

      const disabledMenu = new StringSelectMenuBuilder()
        .setCustomId("starter")
        .setPlaceholder(selectedUnit.name)
        .setDisabled(true)
        .addOptions(select.options);

      const disabledRow = new ActionRowBuilder().addComponents(disabledMenu);

      await i.update({
        content: `You chose **${selectedUnit.name}** as your starter!`,
        flags: MessageFlags.Ephemeral,
        components: [disabledRow],
      });

      await interaction.channel.send({
        content: `**${i.member.displayName}** has started their journey!`,
      });

      await PlayerUnits.create({ unitId: selection, userId: i.user.id });

      collector.stop();
    });
  },
};
