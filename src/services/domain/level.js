import { Corridor } from "./corridor.js";
import { Room } from "./room.js";

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Node {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

function makeLeaves(width, height) {
  const pw = width / 3;
  const ph = height / 3;

  const leaves = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      leaves.push(new Node(pw * i, ph * j, pw, ph));
    }
  }

  return leaves;
}

export class Level {
  constructor(index = 0) {
    this.index = index;
    this.rooms = [];
    this.corridors = [];
    this.enemies = [];
    this.items = [];

    this.width = process.stdout.columns || 80;
    this.height = process.stdout.rows || 24;

    this.map = new Array(this.height)
      .fill(0)
      .map(() => new Array(this.width).fill(0));

    this.generate();
    this.populateEnemies();
    this.populateItems();
  }

  #generateRooms(width, height) {
    const leaves = makeLeaves(width, height);

    const minRoomSize = 3;

    for (const leave of leaves) {
      const x = randomBetween(
        leave.x + 1,
        leave.x + leave.width - minRoomSize - 1
      );
      const y = randomBetween(
        leave.y + 1,
        leave.y + leave.height - minRoomSize - 1
      );

      const maxWidth = leave.x + leave.width - x - 1;
      const maxHeight = leave.y + leave.height - y - 1;

      const rw = randomBetween(minRoomSize, Math.max(minRoomSize, maxWidth));
      const rh = randomBetween(minRoomSize, Math.max(minRoomSize, maxHeight));

      const room = new Room(x, y, rw, rh);
      console.log(room);
      for (let i = x - 1; i < x + rw + 1; i++) {
        for (let j = y - 1; j < y + rh + 1; j++) {
          this.map[j][i] = 2;
        }
      }
      for (let i = x; i < x + rw; i++) {
        for (let j = y; j < y + rh; j++) {
          this.map[j][i] = 1;
        }
      }

      this.rooms.push(room);
    }
  }

  #buildPath(start, end) {
    const isFree = (x, y) => {
      if (this.map[y][x] === 0) {
        this.map[y][x] = 3;
        return true;
      }
      return false;
    };

    const doors = [];

    const isDoor = (x, y) => {
      if (this.map[y][x] === 2) {
        this.map[y][x] = 3;
        doors.push({ center: { x: x, y: y } });
        return true;
      }
      return false;
    };

    const path = [];

    let midX = Math.floor((start.center.x + end.center.x) / 2);
    let midY = Math.floor((start.center.y + end.center.y) / 2);

    let xStep = start.center.x < end.center.x ? 1 : -1;
    for (let x = start.center.x; x !== midX; x += xStep) {
      isDoor(x, start.center.y);
    }

    let yStep = start.center.y < end.center.y ? 1 : -1;
    for (let y = start.center.y; y !== midY; y += yStep) {
      isDoor(midX, y);
    }

    let xStep2 = start.center.x < end.center.x ? 1 : -1;
    for (let x = midX; x !== end.center.x; x += xStep2) {
      isDoor(x, midY);
    }

    let yStep2 = start.center.y < end.center.y ? 1 : -1;
    for (let y = midY; y !== end.center.y; y += yStep2) {
      isDoor(end.center.x, y);
    }

    start = doors[0];
    end = doors[1];

    midX = Math.floor((start.center.x + end.center.x) / 2);
    midY = Math.floor((start.center.y + end.center.y) / 2);

    xStep = start.center.x < end.center.x ? 1 : -1;
    for (let x = start.center.x; x !== midX; x += xStep) {
      if (isFree(x, start.center.y)) {
        path.push({ x, y: start.center.y });
      }
    }

    yStep = start.center.y < end.center.y ? 1 : -1;
    for (let y = start.center.y; y !== midY; y += yStep) {
      if (isFree(midX, y)) {
        path.push({ x: midX, y });
      }
    }

    xStep2 = start.center.x < end.center.x ? 1 : -1;
    for (let x = midX; x !== end.center.x; x += xStep2) {
      if (isFree(x, midY)) {
        path.push({ x, y: midY });
      }
    }

    yStep2 = start.center.y < end.center.y ? 1 : -1;
    for (let y = midY; y !== end.center.y; y += yStep2) {
      if (isFree(end.center.x, y)) {
        path.push({ x: end.center.x, y });
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

  generate() {
    this.#generateRooms(this.width, this.height);
    this.#connectRooms();
  }

  display() {
    for (const row of this.map) {
      console.log(row.join(""));
    }
  }

  populateEnemies() {
    /* добавить монстров */
  }

  populateItems() {
    /* добавить предметы */
  }
}
