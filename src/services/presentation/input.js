import blessed from "blessed";
import { GameConfig } from "../../constants.js";

class GameInput {
  constructor() {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.weapons = false;
    this.elxirs = false;
    this.food = false;
    this.scroll = false;
  }
}

export function InputInit(
  screen,
  lowerKeys = ["k", "j", "h", "l", "w", "e", "f", "s", "q"]
) {
  const input = new GameInput();
  const upperKeys = lowerKeys.map((key) => key.toUpperCase());

  const func = (ch) => {
    switch (ch) {
      case lowerKeys[0]:
      case upperKeys[0]:
        input.up = true;
        break;
      case lowerKeys[1]:
      case upperKeys[1]:
        input.down = true;
        break;
      case lowerKeys[2]:
      case upperKeys[2]:
        input.left = true;
        break;
      case lowerKeys[3]:
      case upperKeys[3]:
        input.right = true;
        break;
      case lowerKeys[4]:
      case upperKeys[4]:
        input.weapons = true;
        break;
      case lowerKeys[5]:
      case upperKeys[5]:
        input.elxirs = true;
        break;
      case lowerKeys[6]:
      case upperKeys[6]:
        input.food = true;
        break;
      case lowerKeys[7]:
      case upperKeys[7]:
        input.scroll = true;
        break;
      case lowerKeys[8]:
      case upperKeys[8]:
        screen.destroy();
        process.exit(GameConfig.EXIT_CODE);
    }
  };

  screen.key(lowerKeys, func);
  screen.key(upperKeys, func);
  return input;
}
