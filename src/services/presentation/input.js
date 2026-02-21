import { GameConfig } from "../../constants.js";

export class GameInput {
  #hendler;
  #keyMap;

  constructor(screen, onAction, keys = defaultKeys()) {
    this.screen = screen;
    this.onAction = onAction;

    this.#keyMap = this.#createKeyMap(keys);

    this.#hendler = (ch) => {
      const action = this.#keyMap[ch];
      if (!action) return;

      if (action === "exit") {
        this.screen.destroy();
        process.exit(GameConfig.EXIT_CODE);
      }

      this.onAction(action);
    };
  }

  bind() {
    this.screen.key(Object.keys(this.#keyMap), this.#hendler);
  }

  unbind() {
    this.screen.unkey(Object.keys(this.#keyMap), this.#hendler);
  }

  #createKeyMap(config) {
    const map = {};

    for (const [action, key] of Object.entries(config)) {
      map[key[0]] = action;
      map[key[0].toUpperCase()] = action;
    }

    return map;
  }
}

function defaultKeys() {
  return {
    up: ["k"],
    down: ["j"],
    left: ["h"],
    right: ["l"],
    weapons: ["w"],
    elixirs: ["e"],
    food: ["f"],
    scroll: ["s"],
    exit: ["q"],
  };
}
