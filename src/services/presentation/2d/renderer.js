import blessed from "blessed";
import { TileChar, TileType } from "../../../constants.js";
import { FogOfWar } from "./fogOfWar.js";
import { showInventoryMenu } from "./inventoryMeny.js";
import { Logger } from "./logger.js";
import { PlayerStats } from "./playerStats.js";
import { colorChar, getKey } from "./utils.js";

const TILE_CACHE = Object.freeze({
  PLAYER: colorChar(TileChar.PLAYER, "blue"),
  END_ROOM: colorChar(TileChar.END_ROOM, "magenta"),
  FLOOR: colorChar(TileChar.FLOOR, "cyan"),
  WALL: colorChar(TileChar.WALL, "grey"),
  CORRIDOR: colorChar(TileChar.CORRIDOR, "cyan"),
  EMPTY: colorChar(TileChar.EMPTY, "black"),
  UNKNOWN: " ",
});

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

    this.width = this.gameBox.width - 2;
    this.height = this.gameBox.height - 2;

    this.playerVisetedRooms = new Set();

    this.enemyColorCache = new Map();
    this.itemColorCache = new Map();
  }

  clear() {
    this.playerVisetedRooms.clear();
  }

  refresh(level, items, player, enemies) {
    const enemyMap = new Map();
    for (const enemy of enemies) {
      if (enemy.visible)
        enemyMap.set(getKey(enemy.cords.x, enemy.cords.y), enemy);
    }

    const itemMap = new Map();
    for (const item of items) {
      itemMap.set(getKey(item.cords.x, item.cords.y), item);
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
      return TILE_CACHE.PLAYER;
    }

    const key = getKey(x, y);

    if (!this.fog.cellsMap.get(key)) return TILE_CACHE.UNKNOWN;

    const enemy = enemyMap.get(key);
    if (enemy) {
      let coloredEnemy = this.enemyColorCache.get(enemy.name[0]);
      if (!coloredEnemy) {
        coloredEnemy = colorChar(enemy.name[0], "red");
        this.enemyColorCache.set(enemy.name[0], coloredEnemy);
      }
      return coloredEnemy;
    }

    const item = itemMap.get(key);
    if (item) {
      let coloredItem = this.itemColorCache.get(item.type[0]);
      if (!coloredItem) {
        coloredItem = colorChar(item.type[0], "green");
        this.itemColorCache.set(item.type[0], coloredItem);
      }
      return coloredItem;
    }

    if (level.endRoom.center.x === x && level.endRoom.center.y === y) {
      return TILE_CACHE.END_ROOM;
    }

    const ch = level.map[y][x];
    switch (ch) {
      case TileType.FLOOR:
        return TILE_CACHE.FLOOR;
      case TileType.WALL:
        return TILE_CACHE.WALL;
      case TileType.CORRIDOR:
        return TILE_CACHE.CORRIDOR;
      default:
        return TILE_CACHE.EMPTY;
    }
  }

  showItemsMenu(items, onSelect, bind) {
    showInventoryMenu(this.screen, items, onSelect, bind);
  }
}
