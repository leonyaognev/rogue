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
  #centers;

  constructor(index = 0) {
    this.index = index;
    this.rooms = [];
    this.corridors = [];
    this.enemies = [];
    this.items = [];

    this.#centers = [];

    this.generate();
    this.populateEnemies();
    this.populateItems();
  }

  #distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  #nearestCenters(centers, index) {
    const origin = centers[index];

    return centers
      .filter((c) => c !== origin)
      .slice()
      .sort((a, b) => this.#distance(origin, a) - this.#distance(origin, b));
  }

  #generateRooms(width, height) {
    const leaves = makeLeaves(width, height);

    const minRoomSize = 3;

    for (const leave of leaves) {
      const x = randomBetween(leave.x, leave.x + leave.width - minRoomSize - 4);
      const y = randomBetween(
        leave.y,
        leave.y + leave.height - minRoomSize - 4
      );

      const maxWidth = leave.x + leave.width - x;
      const maxHeight = leave.y + leave.height - y;

      const rw = randomBetween(minRoomSize, Math.max(minRoomSize, maxWidth));
      const rh = randomBetween(minRoomSize, Math.max(minRoomSize, maxHeight));

      const room = new Room(x, y, rw, rh);
      this.rooms.push(room);

      this.#centers.push({
        x: Math.floor(room.x + room.width / 2),
        y: Math.floor(room.y + room.height / 2),
      });
    }
  }

  #connectRooms() {
    for (let i = 0; i < this.#centers.length - 1; i++) {
      const start = this.#centers[i];
      const nearest = this.#nearestCenters(this.#centers, i)[0];

      const path = [];

      const xStep = start.x < nearest.x ? 1 : -1;
      for (let x = start.x; x !== nearest.x; x += xStep) {
        path.push({ x, y: start.y });
      }

      const yStep = start.y < nearest.y ? 1 : -1;
      for (let y = start.y; y !== nearest.y; y += yStep) {
        path.push({ x: nearest.x, y });
      }

      console.log(path);

      this.corridors.push(new Corridor(this.rooms[i], this.rooms[i + 1], path));
    }
  }

  generate() {
    const width = process.stdout.columns;
    const height = process.stdout.rows;
    this.#generateRooms(width, height);
    this.#connectRooms();
  }

  populateEnemies() {
    /* добавить монстров */
  }

  populateItems() {
    /* добавить предметы */
  }
}
