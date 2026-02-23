import blessed from "blessed";
import { TileChar, TileType } from "../../../constants.js";
import { showInventoryMenu } from "./inventoryMeny.js";
import { Logger } from "./logger.js";
import { PlayerStats } from "./playerStats.js";
import { colorChar } from "./utils.js";

export class Renderer2D {
  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: "Rogue Demo",
    });

    this.gameBox = blessed.box({
      parent: this.screen,
      top: 0,
      left: 0,
      width: "70%",
      height: "100%",
      border: "line",
      tags: true,
    });

    this.logger = new Logger(this.screen, { width: "30%", height: "50%" });
    this.playerDisplay = new PlayerStats(this.screen, {
      width: "30%",
      height: "50%",
    });

    this.width = this.gameBox.width - 2;
    this.height = this.gameBox.height - 2;
  }

  refresh(level, items, player, enemies) {
    let content = "";

    for (let y = 0; y < level.map.length; y++) {
      let line = "";
      for (let x = 0; x < level.map[0].length; x++) {
        line += this.#getTileChar(x, y, level, items, player, enemies);
      }
      content += `${line}\n`;
    }

    this.gameBox.setContent(content);
    this.logger.displayMessages();
    this.playerDisplay.displayPlayerInformation(player, level);
    this.screen.render();
  }

  showItemsMenu(items, onSelect, bind) {
    showInventoryMenu(this.screen, items, onSelect, bind);
  }

  #getTileChar(x, y, level, items, player, enemies) {
    if (player.cords.x === x && player.cords.y === y) {
      return colorChar(TileChar.PLAYER, "blue");
    }

    const enemy = enemies.find(
      (e) => e.cords.x === x && e.cords.y === y && e.visible
    );
    if (enemy) return colorChar(enemy.name[0], "red");

    const item = items.find((i) => i.cords.x === x && i.cords.y === y);
    if (item) return colorChar(item.type[0], "green");

    if (level.endRoom.center.x === x && level.endRoom.center.y === y) {
      return colorChar(TileChar.END_ROOM, "magenta");
    }

    const ch = level.map[y][x];
    switch (ch) {
      case TileType.FLOOR:
        return colorChar(TileChar.FLOOR, "cyan");
      case TileType.WALL:
        return colorChar(TileChar.WALL, "grey");
      case TileType.CORRIDOR:
        return colorChar(TileChar.CORRIDOR, "cyan");
      case TileType.EMPTY:
      default:
        return colorChar(TileChar.EMPTY, "black");
    }
  }
}
