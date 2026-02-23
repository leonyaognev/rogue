import blessed from "blessed";
import { TileChar, TileType, TypesLogs } from "../../../constants.js";
import { logger } from "../../logger.js";
import { showInventoryMenu } from "./inventoryMeny.js";
import { Logger } from "./logger.js";
import { PlayerStats } from "./playerStats.js";
import { colorChar } from "./utils.js";

class FogOfWar {
  constructor() {
    this.cellsMap = new Map();
  }

  rayCasting(player, map) {
    for (let angle = 0; angle < 360; angle++) {
      const dx = Math.cos((angle * Math.PI) / 180);
      const dy = Math.sin((angle * Math.PI) / 180);

      let x = player.cords.x;
      let y = player.cords.y;

      while (true) {
        const tileX = Math.round(x);
        const tileY = Math.round(y);

        if (
          tileY < 0 ||
          tileY >= map.length ||
          tileX < 0 ||
          tileX >= map[0].length
        ) {
          break;
        }

        this.cellsMap.set(`${tileX},${tileY}`, true);

        if (
          map[tileY][tileX] === TileType.WALL ||
          map[tileY][tileX] === TileType.EMPTY
        )
          break;

        x += dx * 0.2;
        y += dy * 0.2;

        if (this.#distance(player.cords.x, player.cords.y, x, y) > 300) break;
      }
    }
  }

  #distance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  setWallsAsVisible(room) {
    for (let j = room.y - 1; j <= room.y + room.height; j++) {
      for (let i = room.x - 1; i <= room.x + room.width; i++) {
        if (
          i === room.x - 1 ||
          i === room.x + room.width ||
          j === room.y - 1 ||
          j === room.y + room.height
        ) {
          this.cellsMap.set(`${i},${j}`, true);
        }
      }
    }
  }

  setRoomAsVisible(room) {
    for (let j = room.y; j <= room.y + room.height - 1; j++) {
      for (let i = room.x; i <= room.x + room.width - 1; i++) {
        this.cellsMap.set(`${i},${j}`, true);
      }
    }
  }

  setRoomAsInvisible(room) {
    for (let j = room.y; j <= room.y + room.height - 1; j++) {
      for (let i = room.x; i <= room.x + room.width - 1; i++) {
        this.cellsMap.set(`${i},${j}`, false);
      }
    }
  }
}

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

    this.fog = new FogOfWar();

    this.logger = new Logger(this.screen, { width: "30%", height: "50%" });
    this.playerDisplay = new PlayerStats(this.screen, {
      width: "30%",
      height: "50%",
    });

    // Определяем размер видимой области за вычетом рамок
    this.width = this.gameBox.width - 2;
    this.height = this.gameBox.height - 2;

    this.playerVisetedRooms = new Set();
  }

  clear() {
    this.playerVisetedRooms.clear();
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

    this.fog.cellsMap.clear();
    this.fog.rayCasting(player, level.map);

    const room = player.getCurrentRoom(level);
    if (room) {
      this.playerVisetedRooms.add(room);
      this.fog.setRoomAsVisible(room);
    }
    this.playerVisetedRooms.forEach((room) => {
      this.fog.setWallsAsVisible(room);
    });

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

    if (!this.fog.cellsMap.get(key)) return " ";

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
