const { SlashCommandBuilder } = require("discord.js");
const { Units, PlayerUnits, Players } = require("../db.js");
const { formatUnitString } = require("../utils.js");
const { DialogueBuilder } = require("../builders/DialogueBuilder.js");
const { DialogueNodeBuilder } = require("../builders/DialogueNodeBuilder.js");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("start").setDescription("Start."),
  async execute(interaction) {
    const starters = await Units.findAll({ where: { isStarter: true } });

    const dialogue = new DialogueBuilder()
      .setTitle("The Beginning")
      .addNode(
        new DialogueNodeBuilder()
          .setId("intro1")
          .setSpeaker("Narrator")
          .setText("Hello summoner. Are you ready to start your journey?")
          .setImage("./assets/test-icon.png")
          .setOptions([
            { label: "Yes", next: "intro2" },
            { label: "No", next: "intro3" },
          ])
          .build()
      )
      .addNode(
        new DialogueNodeBuilder()
          .setId("intro2")
          .setSpeaker("Narrator")
          .setText("Very well then. Choose your starter.")
          .setImage("./assets/test-icon.png")
          .setOptions(
            starters.map((starter) => ({
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
            }))
          )
          .build()
      )
      .addNode(
        new DialogueNodeBuilder()
          .setId("intro3")
          .setSpeaker("Narrator")
          .setText("Come back when you're ready.")
          .setImage("./assets/test-icon.png")
          .setAutoNext("intro5", 5000)
          .build()
      )
      .addNode(
        new DialogueNodeBuilder()
          .setId("intro4")
          .setSpeaker("Narrator")
          .setText("Your journey begins now...")
          .setImage("./assets/test-icon.png")
          .build()
      )
      .addNode(
        new DialogueNodeBuilder()
          .setId("intro5")
          .setSpeaker("Narrator")
          .setText("Unless you've changed your mind?")
          .setImage("./assets/test-icon.png")
          .setOptions([
            { label: "Yes", next: "intro2" },
            { label: "No", next: null },
          ])
          .build()
      );

    await dialogue.start(interaction);
  },
};
