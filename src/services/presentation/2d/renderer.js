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
      fullUnicode: true,
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

    // Определяем размер видимой области за вычетом рамок
    this.width = this.gameBox.width - 2;
    this.height = this.gameBox.height - 2;
  }

  refresh(level, items, player, enemies) {
    const enemyMap = new Map();
    for (const e of enemies) {
      if (e.visible) enemyMap.set(`${e.cords.x},${e.cords.y}`, e);
    }

    const itemMap = new Map();
    for (const i of items) {
      itemMap.set(`${i.cords.x},${i.cords.y}`, i);
    }

    let startX = Math.max(0, player.cords.x - Math.floor(this.width / 2));
    let startY = Math.max(0, player.cords.y - Math.floor(this.height / 2));

    const endX = Math.min(level.map[0].length, startX + this.width);
    const endY = Math.min(level.map.length, startY + this.height);

    startX = Math.max(0, endX - this.width);
    startY = Math.max(0, endY - this.height);

    const buffer = [];
    for (let y = startY; y < endY; y++) {
      let line = "";
      for (let x = startX; x < endX; x++) {
        line += this.#getTileChar(x, y, level, itemMap, player, enemyMap);
      }
      buffer.push(line);
    }

    this.gameBox.setContent(buffer.join("\n"));
    this.logger.displayMessages();
    this.playerDisplay.displayPlayerInformation(player, level);
    this.screen.render();
  }

  #getTileChar(x, y, level, itemMap, player, enemyMap) {
    if (player.cords.x === x && player.cords.y === y) {
      return colorChar(TileChar.PLAYER, "blue");
    }

    const key = `${x},${y}`;

    const enemy = enemyMap.get(key);
    if (enemy) return colorChar(enemy.name[0], "red");

    const item = itemMap.get(key);
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
      default:
        return colorChar(TileChar.EMPTY, "black");
    }
  }

  showItemsMenu(items, onSelect, bind) {
    showInventoryMenu(this.screen, items, onSelect, bind);
  }
}
