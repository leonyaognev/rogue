import { ItemType, LevelConfig, TileType } from "../../constants.js";
import { createRandomEnemy, enemyClasses } from "./characters/enemyFactory.js";
import { Corridor } from "./corridor.js";
import { createItemWithMultiplier, BaseItems } from "./item.js";
import { Room } from "./room.js";
import { CorridorPathfinder } from "./utils/aStar/finders/CorridorPathfinder.js";
import { endPathFinder } from "./utils/aStar/finders/endPathFinder.js";
import { randomBetween } from "./utils/randomBetween.js";

class Node {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

function makeLeaves(width, height) {
  const pw = width / LevelConfig.GRID_DIVISIONS;
  const ph = height / LevelConfig.GRID_DIVISIONS;

  const leaves = [];

  for (let i = 0; i < LevelConfig.GRID_DIVISIONS; i++) {
    for (let j = 0; j < LevelConfig.GRID_DIVISIONS; j++) {
      leaves.push(new Node(pw * i, ph * j, pw, ph));
    }
  }

  return leaves;
}

export class Level {
  constructor(
    width = LevelConfig.DEFAULT_WIDTH,
    height = LevelConfig.DEFAULT_HEIGHT,
    number = 1
  ) {
    this.rooms = [];
    this.corridors = [];
    this.enemies = [];
    this.items = [];
    this.width = width;
    this.height = height;
    this.number = number;

    this.map = new Array(this.height)
      .fill(TileType.EMPTY)
      .map(() => new Array(this.width).fill(TileType.EMPTY));

    this.generate();

    this.startRoom = this.rooms[randomBetween(0, this.rooms.length - 1)];
    this.endRoom = this.#searchEndRoom();

    this.populateEnemies();
    this.populateItems();
  }

  generate() {
    this.#generateRooms(this.width, this.height);
    this.#connectRooms();
  }

  populateEnemies() {
    const cords = [];
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[0].length; x++) {
        if (this.#isInstanceForEnemy(x, y)) cords.push({ x, y });
      }
    }

    const enemiesCount = 7 + Math.floor(this.number * 0.2);
    const enemies = enemyClasses.slice(
      0,
      Math.min(Math.floor(this.number / 4) + 1, enemyClasses.length)
    );

    for (let i = 0; i < enemiesCount; i++) {
      const levelFactor = 1 + this.number * 0.2;
      const enemy = createRandomEnemy(enemies, {
        maxHp: Math.floor(randomBetween(30, 60) * levelFactor),
        agility: Math.floor(randomBetween(1, 6) * levelFactor),
        strength: Math.floor(randomBetween(1, 6) * levelFactor),
        cords: cords.splice(Math.floor(Math.random() * cords.length), 1)[0],
        hostility: Math.floor(randomBetween(3, 7) * levelFactor),
        level: this,
      });

      this.enemies.push(enemy);
    }
  }

  populateItems() {
    const cords = [];
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[0].length; x++) {
        if (this.#isInstanceForItem(x, y)) cords.push({ x, y });
      }
    }

    const itemsCount = 10 - Math.floor(this.number * 0.2);

    for (let i = 0; i < itemsCount; i++) {
      const levelFactor = 1 + this.number * 0.19;
      const baseItem = BaseItems[Math.floor(Math.random() * BaseItems.length)];
      const item = createItemWithMultiplier(baseItem, levelFactor);

      this.items.push({
        item: item,
        cords: cords.splice(Math.floor(Math.random() * cords.length), 1)[0],
      });
    }
  }

  getEnemyAt(x, y) {
    return this.enemies.find(
      (enemy) => enemy.cords.x === x && enemy.cords.y === y
    );
  }

  removeEnemy(enemy) {
    const index = this.enemies.indexOf(enemy);
    if (index !== -1) {
      this.enemies.splice(index, 1);
    }
  }

  #searchEndRoom() {
    const ways = [];

    for (const room of this.rooms) {
      if (room === this.startRoom) continue;

      const finder = new endPathFinder(this.map);

      const path = finder.find(this.startRoom.center, room.center).length;
      ways.push({ path: path, room: room });
    }

    return ways.reduce((acc, cur) => {
      if (cur.path > acc.path) acc = cur;
      return acc;
    }, ways[0]).room;
  }

  #generateRooms(width, height) {
    const leaves = makeLeaves(width, height);

    const minRoomSize = LevelConfig.MIN_ROOM_SIZE;
    const roomOffset = LevelConfig.ROOM_OFFSET;

    for (const leave of leaves) {
      const x = randomBetween(
        leave.x + roomOffset,
        leave.x + leave.width - minRoomSize - roomOffset
      );
      const y = randomBetween(
        leave.y + roomOffset,
        leave.y + leave.height - minRoomSize - roomOffset
      );

      const maxWidth = leave.x + leave.width - x - roomOffset;
      const maxHeight = leave.y + leave.height - y - roomOffset;

      const rw = randomBetween(minRoomSize, Math.max(minRoomSize, maxWidth));
      const rh = randomBetween(minRoomSize, Math.max(minRoomSize, maxHeight));

      const room = new Room(x, y, rw, rh);
      for (let i = x - 1; i < x + rw + 1; i++) {
        for (let j = y - 1; j < y + rh + 1; j++) {
          this.map[j][i] = TileType.WALL;
        }
      }
      for (let i = x; i < x + rw; i++) {
        for (let j = y; j < y + rh; j++) {
          this.map[j][i] = TileType.FLOOR;
        }
      }

      this.rooms.push(room);
    }
  }

  #buildPath(start, end) {
    const finder = new CorridorPathfinder(this.map);

    let path = finder.find(start.center, end.center);
    for (const cord of path) {
      if (this.map[cord.y][cord.x] !== TileType.FLOOR) {
        this.map[cord.y][cord.x] = TileType.CORRIDOR;
      } else {
        path = path.filter((el) => el !== cord);
      }
    }

    return path;
  }

  #connectRooms() {
    const connected = new Set();
    const remaining = new Set(this.rooms);
    connected.add(this.rooms[0]);
    remaining.delete(this.rooms[0]);

    while (remaining.size > 0) {
      let bestPair = null;
      let bestDistance = Infinity;

      for (const a of connected) {
        for (const b of remaining) {
          const d = a.distance(b);
          if (d < bestDistance) {
            bestDistance = d;
            bestPair = [a, b];
          }
        }
      }

      const [start, end] = bestPair;
      const path = this.#buildPath(start, end);

      this.corridors.push(new Corridor(start, end, path));
      connected.add(end);
      remaining.delete(end);
    }
  }

  #isInstanceForEnemy(x, y) {
    if (this.items.length !== 0) {
      for (const item of this.items) {
        if (item.cords.x === x && item.cords.y === y) {
          return false;
        }
      }
    }
    return !(this.map[y][x] !== TileType.FLOOR);
  }

  #isInstanceForItem(x, y) {
    if (this.items.length !== 0) {
      for (const enemy of this.enemies) {
        if (enemy.cords.x === x && enemy.cords.y === y) {
          return false;
        }
      }
    }
    return !(this.map[y][x] !== TileType.FLOOR);
  }
}
