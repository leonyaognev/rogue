import { DefaultKeys, GameConfig, TypesLogs } from "../../constants.js";
import { logger } from "../logger.js";

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

      logger.log(`Input received: ${action}`, TypesLogs.INFO);

      if (action === "exit") {
        this.screen.destroy();
        logger.log("Exit requested by user", TypesLogs.INFO);
        process.exit(GameConfig.EXIT_CODE);
      }

      this.onAction(action);
    };
  }

  bind() {
    this.screen.key(Object.keys(this.#keyMap), this.#hendler);
    logger.log("Input bindings activated", TypesLogs.INFO);
  }

  unbind() {
    this.screen.unkey(Object.keys(this.#keyMap), this.#hendler);
    logger.log("Input bindings deactivated", TypesLogs.INFO);
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
  return DefaultKeys;
}
