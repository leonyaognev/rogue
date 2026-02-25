import { LevelConfig, TileType, TypesLogs } from '../../constants.js';
import logger from '../logger.js';
import {
  createRandomEnemy,
  enemyClasses,
  enemyDeserialize,
} from './characters/enemyFactory.js';
import Corridor from './corridor.js';
import { BaseItems, createItemWithMultiplier, Item } from './item.js';
import Room from './room.js';
import CorridorPathfinder from './utils/aStar/finders/CorridorPathfinder.js';
import EndPathFinder from './utils/aStar/finders/endPathFinder.js';
import randomBetween from './utils/randomBetween.js';

function makeLeaves(width, height) {
  const pw = width / LevelConfig.GRID_DIVISIONS;
  const ph = height / LevelConfig.GRID_DIVISIONS;

  const leaves = [];

  for (let i = 0; i < LevelConfig.GRID_DIVISIONS; i += 1) {
    for (let j = 0; j < LevelConfig.GRID_DIVISIONS; j += 1) {
      leaves.push({
        x: pw * i, y: ph * j, width: pw, height: ph,
      });
    }
  }

  return leaves;
}

export default class Level {
  constructor(
    width = LevelConfig.DEFAULT_WIDTH,
    height = LevelConfig.DEFAULT_HEIGHT,
    number = 1,
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

    logger.log(
      `Level ${number} generated: ${this.rooms.length} rooms, ${this.enemies.length} enemies, ${this.items.length} items`,
      TypesLogs.INFO,
    );
  }

  serialize() {
    return {
      rooms: this.rooms.map((room) => room.serialize()),
      corridors: this.corridors.map((corridor) => corridor.serialize()),
      enemies: this.enemies.map((enemy) => enemy.serialize()),
      items: this.items.map((item) => item.serialize()),
      width: this.width,
      height: this.height,
      number: this.number,
      startRoomIndex: this.rooms.indexOf(this.startRoom),
      endRoomIndex: this.rooms.indexOf(this.endRoom),
    };
  }

  static deserialize(data) {
    const level = new Level(data.width, data.height, data.number);
    level.map = new Array(level.height)
      .fill(TileType.EMPTY)
      .map(() => new Array(level.width).fill(TileType.EMPTY));

    level.rooms = (data.rooms || []).map((dataRoom) => {
      for (let j = dataRoom.y - 1; j <= dataRoom.y + dataRoom.height; j += 1) {
        for (let i = dataRoom.x - 1; i <= dataRoom.x + dataRoom.width; i += 1) {
          const isLeftWall = i === dataRoom.x - 1;
          const isRightWall = i === dataRoom.x + dataRoom.width;
          const isTopWall = j === dataRoom.y - 1;
          const isBottomWall = j === dataRoom.y + dataRoom.height;

          const isWall = isLeftWall || isRightWall || isTopWall || isBottomWall;

          level.map[j][i] = isWall ? TileType.WALL : TileType.FLOOR;
        }
      }

      return Room.deserialize(dataRoom);
    });
    level.corridors = (data.corridors || []).map((dataCorridor) => {
      for (const cord of dataCorridor.path) {
        if (level.map[cord.y][cord.x] !== TileType.FLOOR) {
          level.map[cord.y][cord.x] = TileType.CORRIDOR;
        }
      }

      return Corridor.deserialize(dataCorridor);
    });
    level.enemies = (data.enemies || []).map((dataEnemy) => enemyDeserialize(dataEnemy, level));
    level.items = (data.items || []).map((dataItems) => Item.deserialize(dataItems));

    level.startRoom = level.rooms[data.startRoomIndex];
    level.endRoom = level.rooms[data.endRoomIndex];
    return level;
  }

  generate() {
    this.#generateRooms(this.width, this.height);
    this.#connectRooms();
  }

  populateEnemies() {
    const coords = [];
    for (let y = 0; y < this.map.length; y += 1) {
      for (let x = 0; x < this.map[0].length; x += 1) {
        if (this.#isInstanceForEnemy(x, y)) coords.push({ x, y });
      }
    }

    const enemiesCount = 7 + Math.floor(this.number * 0.2);
    const enemies = enemyClasses.slice(
      0,
      Math.min(Math.floor(this.number / 4) + 1, enemyClasses.length),
    );

    for (let i = 0; i < enemiesCount; i += 1) {
      const enemy = createRandomEnemy(enemies, {
        maxHp: Math.floor(randomBetween(30, 60)),
        agility: Math.floor(randomBetween(1, 6)),
        strength: Math.floor(randomBetween(1, 6)),
        coords: coords.splice(Math.floor(Math.random() * coords.length), 1)[0],
        hostility: Math.floor(randomBetween(3, 7)),
        level: this,
      });

      this.enemies.push(enemy);
    }
    logger.log(`Spawned ${this.enemies.length} enemies`, TypesLogs.INFO);
  }

  populateItems() {
    const coords = [];
    for (let y = 0; y < this.map.length; y += 1) {
      for (let x = 0; x < this.map[0].length; x += 1) {
        if (this.#isInstanceForItem(x, y)) coords.push({ x, y });
      }
    }

    const itemsCount = 10 - Math.floor(this.number * 0.2);

    for (let i = 0; i < itemsCount; i += 1) {
      const baseItem = BaseItems[Math.floor(Math.random() * BaseItems.length)];
      const item = createItemWithMultiplier(baseItem, this.number);

      [item.coords] = coords.splice(Math.floor(Math.random() * coords.length), 1);

      this.items.push(item);
    }
    logger.log(`Placed ${this.items.length} items`, TypesLogs.INFO);
  }

  getItemAt(x, y) {
    return this.items.find((item) => item.coords.x === x && item.coords.y === y);
  }

  removeItem(item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  getEnemyAt(x, y) {
    return this.enemies.find(
      (enemy) => enemy.coords.x === x && enemy.coords.y === y,
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

      const finder = new EndPathFinder(this.map);

      const path = finder.find(this.startRoom.center, room.center).length;
      ways.push({ path, room });
    }

    return ways.reduce((acc, cur) => {
      if (cur.path > acc.path) return cur;
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
        leave.x + leave.width - minRoomSize - roomOffset,
      );
      const y = randomBetween(
        leave.y + roomOffset,
        leave.y + leave.height - minRoomSize - roomOffset,
      );

      const maxWidth = leave.x + leave.width - x - roomOffset;
      const maxHeight = leave.y + leave.height - y - roomOffset;

      const rw = randomBetween(minRoomSize, Math.max(minRoomSize, maxWidth));
      const rh = randomBetween(minRoomSize, Math.max(minRoomSize, maxHeight));

      const room = new Room(x, y, rw, rh);
      for (let j = y - 1; j <= y + rh; j += 1) {
        for (let i = x - 1; i <= x + rw; i += 1) {
          this.map[j][i] = i === x - 1 || i === x + rw || j === y - 1 || j === y + rh
            ? TileType.WALL
            : TileType.FLOOR;
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

      this.corridors.push(new Corridor(path));
      connected.add(end);
      remaining.delete(end);
    }
  }

  #isInstanceForEnemy(x, y) {
    if (this.items.length !== 0) {
      for (const item of this.items) {
        if (item.coords.x === x && item.coords.y === y) {
          return false;
        }
      }
    }
    return !(this.map[y][x] !== TileType.FLOOR);
  }

  #isInstanceForItem(x, y) {
    if (this.items.length !== 0) {
      for (const enemy of this.enemies) {
        if (enemy.coords.x === x && enemy.coords.y === y) {
          return false;
        }
      }
    }
    return !(this.map[y][x] !== TileType.FLOOR);
  }
}
