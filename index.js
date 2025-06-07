const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const loadCommands = require("./handlers/commandHandler");
const { sequelize, Units, PlayerUnits } = require("./db.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.cooldowns = new Collection();

loadCommands(client);

client.once(Events.ClientReady, async (readyClient) => {
  await sequelize.sync({ force: true });

  const count = await Units.count();

  if (count === 0) {
    await Units.bulkCreate([
      {
        id: "001",
        name: "Green Slime",
        description: "A Nature-element slime",
        element: "Nature",
      },
      {
        id: "002",
        name: "Red Slime",
        description: "A Fire-element slime",
        element: "Fire",
      },
      {
        id: "003",
        name: "Blue Slime",
        description: "A Water-element slime",
        element: "Water",
      },
    ]);
    console.log("Seeded Units table with starter units.");
  }

  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  const cooldowns = client.cooldowns;

  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const cooldownAmount = (command.cooldown ?? 3) * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);
      return interaction.reply({
        content: `Please wait, you are on cooldown for \`${command.data.name}\`. Try again <t:${expiredTimestamp}:R>.`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const errorMsg = {
      content: "There was an error while executing this command!",
      flags: MessageFlags.Ephemeral,
    };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMsg);
    } else {
      await interaction.reply(errorMsg);
    }
  }
});

client.login(token);
