const { SlashCommandBuilder } = require("discord.js");

const choices = [
  { name: "Assarin Ullakko", value: "1920" },
  { name: "Macciavelli", value: "1970" },
  { name: "Galilei", value: "1995" },
  { name: "Monttu ja Mercatori", value: "1940" },
  { name: "Kisälli", value: "1900" },
  { name: "Linus", value: "2000" },
  { name: "Delica", value: "1985" },
  { name: "Deli Pharma", value: "198501" },
  { name: "Dental", value: "1980" },
  { name: "Sigyn", value: "1965" },
  { name: "Unican Kulma", value: "1990" },
  { name: "Puutorin Nurkka", value: "1930" },
  { name: "Fabrik Cafe", value: "198502" },
  { name: "Piccu Maccia", value: "197001" },
];

module.exports = {
  category: "utility",
  data: new SlashCommandBuilder()
    .setName("menu")
    .setDescription("Unica restaurant menus.")
    .addStringOption((option) =>
      option
        .setName("restaurant")
        .setDescription("The name of the restaurant")
        .setRequired(true)
        .addChoices(...choices)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const restaurantId = interaction.options.getString("restaurant");
      const restaurantName = choices.find(
        (choice) => choice.value === restaurantId
      ).name;
      const dateString = new Date().toISOString();

      const response = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://www.unica.fi/menuapi/day-menus?costCenter=${restaurantId}&date=${dateString}&language=fi`
        )}`
      );

      const data = await response.json();
      const parsed = JSON.parse(data.contents);

      const menuPackages = parsed.menuPackages;

      if (!menuPackages || menuPackages.length === 0) {
        return await interaction.editReply("No menu available for today.");
      }

      let message = `**${restaurantName} ${new Date(
        parsed.date
      ).toLocaleDateString("fi-FI", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}**\n\n`;

      for (const pkg of menuPackages) {
        message += `**${pkg.name}**\n`;

        for (const meal of pkg.meals) {
          message += `${meal.name.trim()}\n`;
        }

        message += "\n";
      }

      await interaction.editReply(message);
    } catch (error) {
      await interaction.editReply("");
    }
  },
};
