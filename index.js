const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const loadCommands = require("./handlers/commandHandler");
const loadEvents = require("./handlers/eventHandler");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.cooldowns = new Collection();

loadCommands(client);
loadEvents(client);

client.login(token);
