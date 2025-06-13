const { SlashCommandBuilder } = require("discord.js");
const { Units, PlayerUnits, Players } = require("../db.js");
const { formatUnitString } = require("../utils.js");
const { DialogueBuilder } = require("../builders/DialogueBuilder.js");
const { NodeBuilder } = require("../builders/NodeBuilder.js");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("start").setDescription("Start."),
  async execute(interaction) {
    const starters = await Units.findAll({ where: { isStarter: true } });

    const dialogue = new DialogueBuilder()
      .setTitle("The Beginning")
      .addNode(
        new NodeBuilder()
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
        new NodeBuilder()
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
        new NodeBuilder()
          .setId("intro3")
          .setSpeaker("Narrator")
          .setText("Come back when you're ready.")
          .setImage("./assets/test-icon.png")
          .build()
      )
      .addNode(
        new NodeBuilder()
          .setId("intro4")
          .setSpeaker("Narrator")
          .setText("Your journey begins now...")
          .setImage("./assets/test-icon.png")
          .build()
      );

    await dialogue.start(interaction);
  },
};
