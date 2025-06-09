const {
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  MessageFlags,
  ButtonStyle,
} = require("discord.js");
const { Players } = require("../db");
const { where } = require("sequelize");

module.exports = {
  cooldown: 60,
  data: new SlashCommandBuilder()
    .setName("pvp")
    .setDescription("Start a battle with another player.")
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("The user you want to battle.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.user;
    const opponent = interaction.options.getUser("opponent");

    const started = await Players.findOne({
      where: { playerId: user.id },
    });

    if (!started) {
      return interaction.reply({
        content:
          "You havent started your journey yet. Run /start to get started.",
        flags: MessageFlags.Ephemeral,
      });
    }

    /*
    const opponentStarted = await Players.findOne({
      where: { playerId: opponent.id },
    });

    if (!opponentStarted) {
      return interaction.reply({
        content: `${opponent} hasn't started their journey.`,
        flags: MessageFlags.Ephemeral,
      });
    }
    */

    const acceptButton = new ButtonBuilder()
      .setCustomId(`accept-pvp-${user.id}-${opponent.id}`)
      .setLabel("Accept")
      .setStyle(ButtonStyle.Success);

    const rejectButton = new ButtonBuilder()
      .setCustomId(`reject-pvp-${user.id}-${opponent.id}`)
      .setLabel("Reject")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(
      acceptButton,
      rejectButton
    );

    await interaction.reply({
      content: `${opponent}, you've been challenged to a battle by ${user}!`,
      components: [row],
    });
  },
};
