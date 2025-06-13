const {
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  MessageFlags,
  ComponentType,
} = require("discord.js");

class DialogueBuilder {
  constructor() {
    this.title = "";
    this.nodes = [];
  }

  setTitle(title) {
    this.title = title;
    return this;
  }

  addNode(node) {
    this.nodes.push(node);
    return this;
  }

  async start(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await this.#render(interaction, this.nodes[0].id, {
      initialMessageSent: true,
    });
  }

  async #render(interaction, currentId, context) {
    const node = this.nodes.find((node) => node.id === currentId);
    if (!node) return;

    const embed = new EmbedBuilder().setTitle(this.title);

    node.speaker
      ? embed.addFields({ name: node.speaker, value: node.text })
      : embed.setDescription(node.text);

    if (node.thumbnail) embed.setThumbnail(node.thumbnail);

    let row = null;
    if (Array.isArray(node.options) && node.options.length > 0) {
      const menu = new StringSelectMenuBuilder()
        .setCustomId("dialogue")
        .setPlaceholder("[select]")
        .addOptions(
          node.options.map((option, index) => ({
            label: option.label,
            value: index.toString(),
          }))
        );

      row = new ActionRowBuilder().addComponents(menu);
    }

    const sent = await interaction.followUp({
      embeds: [embed],
      components: row ? [row] : [],
      flags: MessageFlags.Ephemeral,
    });

    if (row) {
      const collector = sent.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 3_600_000,
      });

      collector.on("collect", async (i) => {
        const selectedIndex = parseInt(i.values[0]);
        const selectedOption = node.options[selectedIndex];

        const disabledMenu = new StringSelectMenuBuilder()
          .setCustomId("dialogue")
          .setDisabled(true)
          .setPlaceholder(selectedOption.label)
          .addOptions(
            node.options.map((opt, index) => ({
              label: opt.label,
              value: index.toString(),
            }))
          );

        const disabledRow = new ActionRowBuilder().addComponents(disabledMenu);

        await i.update({ components: [disabledRow] });

        if (selectedOption?.action) await selectedOption.action(i);
        if (selectedOption?.next)
          await this.#render(i, selectedOption.next, context);
      });
    }
  }
}

module.exports = { DialogueBuilder };
