const { SlashCommandBuilder } = require("discord.js");

const flips = [
  "(╯°□°)╯︵ ┻━┻",
  "ヽ(ຈل͜ຈ)ﾉ︵ ┻━┻",
  "┳━┳ ヽ(ಠل͜ಠ)ﾉ",
  "┬─┬ノ( º _ ºノ)",
  "(╯°Д°)╯︵/(.□ . )",
  "(╯°□°)╯︵ ʞooqǝɔɐℲ",
  "(ノಠ益ಠ)ノ彡┻━┻",
  "(┛◉Д◉)┛彡┻━┻",
  "(┛ಠ_ಠ)┛彡┻━┻",
  "┻━┻︵ (°□°)/ ︵ ┻━┻",
  "(˚Õ˚)ر ~~~~╚╩╩╝",
  "┏━┓┏━┓┏━┓ ︵ /(^.^/)",
  "(☞ﾟヮﾟ)☞ ┻━┻",
  "┻━┻ ︵╰(°□°╰)",
];

module.exports = {
  data: new SlashCommandBuilder().setName("flip").setDescription("Flips!"),
  async execute(interaction) {
    await interaction.reply(flips[Math.floor(Math.random() * flips.length)]);
  },
};
