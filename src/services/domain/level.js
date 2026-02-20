import { Snake } from "./characters/enemies/snake.js";
import { Zombie } from "./characters/enemies/zombie.js";
import { LevelConfig, TileType } from "./constants.js";
import { Corridor } from "./corridor.js";
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
    height = LevelConfig.DEFAULT_HEIGHT
  ) {
    this.rooms = [];
    this.corridors = [];
    this.enemies = [];
    this.items = [];
    this.width = width;
    this.height = height;

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
    this.enemies.push(
      new Snake(
        "Snake",
        100,
        20,
        20,
        {
          x: randomBetween(
            this.rooms[5].x,
            this.rooms[5].x + this.rooms[5].width - 1
          ),
          y: randomBetween(
            this.rooms[5].y,
            this.rooms[5].y + this.rooms[5].height - 1
          ),
        },
        5,
        this
      )
    );
  }

  populateItems() {
    /* добавить предметы */
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

    for (const leave of leaves) {
      const x = randomBetween(
        leave.x + 2,
        leave.x + leave.width - minRoomSize - 2
      );
      const y = randomBetween(
        leave.y + 2,
        leave.y + leave.height - minRoomSize - 2
      );

      const maxWidth = leave.x + leave.width - x - 2;
      const maxHeight = leave.y + leave.height - y - 2;

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
}
