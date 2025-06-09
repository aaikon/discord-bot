const formatUnit = (element, name, level, maxLevel, rarity) => {
  return `${elementToEmoji(
    element
  )} ***${name}*** (Lv. ${level} / ${maxLevel}) ${rarityToEmoji(rarity)}`;
};

const elementToEmoji = (element) => {
  const elementEmojis = {
    fire: "🔥",
    water: "💧",
    nature: "🌿",
    electric: "⚡",
    dark: "🌑",
    light: "⚪",
  };
  return elementEmojis[element];
};

const rarityToEmoji = (rarity) => {
  return "⭐".repeat(rarity);
};

module.exports = {
  formatUnit,
  elementToEmoji,
};
