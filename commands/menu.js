const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "utility",
  data: new SlashCommandBuilder()
    .setName("menu")
    .setDescription("Open the main menu."),
  async execute(interaction) {
    await interaction.reply("Menu");
  },
};
