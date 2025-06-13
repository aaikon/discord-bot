class NodeBuilder {
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

  build() {
    return this.node;
  }
}

module.exports = {
  NodeBuilder,
};
