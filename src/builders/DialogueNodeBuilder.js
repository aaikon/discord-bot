class DialogueNodeBuilder {
  constructor() {
    this.node = {};
  }

  setId(id) {
    this.node.id = id;
    return this;
  }

  setSpeaker(speaker) {
    this.node.speaker = speaker;
    return this;
  }

  setText(text) {
    this.node.text = text;
    return this;
  }

  setImage(imagePath) {
    this.node.image = imagePath;
    return this;
  }

  setOptions(options) {
    this.node.options = options;
    return this;
  }

  setAutoNext(nextId, delayMs = 3000) {
    this.node.autoNext = { next: nextId, delay: delayMs };
    return this;
  }

  build() {
    return this.node;
  }
}

module.exports = {
  DialogueNodeBuilder,
};
