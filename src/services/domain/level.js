import { Room } from "./room.js";

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Node {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.left = null;
    this.right = null;
  }

  split(min = 0) {
    if (this.left || this.right || this.width <= min || this.height <= min)
      return false;

    const p1 = Math.random();
    const splitVertical = p1 >= 0.5;

    if (splitVertical) {
      const split = randomBetween(
        this.width / 2 - (this.width / 2) * 0.8,
        this.width / 2 + (this.width / 2) * 0.8
      );
      this.left = new Node(this.x, this.y, split, this.height);
      this.right = new Node(
        this.x + split,
        this.y,
        this.width - split,
        this.height
      );
    } else {
      const split = randomBetween(
        this.height / 2 - (this.height / 2) * 0.8,
        this.height / 2 + (this.height / 2) * 0.8
      );
      this.left = new Node(this.x, this.y, this.width, split);
      this.right = new Node(
        this.x,
        this.y + split,
        this.width,
        this.height - split
      );
    }
    return true;
  }
}

function makeLeaves(width, height) {
  const root = new Node(0, 0, width, height);
  const leaves = [root];

  while (leaves.length < 9) {
    const idx = Math.floor(Math.random() * leaves.length);

    if (leaves[idx].split()) {
      leaves.splice(idx, 1, leaves[idx].left, leaves[idx].right);
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

  generate() {
    const width = process.stdout.columns;
    const height = process.stdout.rows;

    const leaves = makeLeaves(width, height);
    const min = 0;

    const centers = [];

    for (const leave of leaves) {
      const room = new Room(
        leave.x - 1,
        leave.y - 1,
        leave.width - 1,
        leave.height - 1
      );

      this.rooms.push(room);

      centers.push({
        x: Math.floor(room.x + room.width / 2),
        y: Math.floor(room.y + room.height / 2),
      });
    }
  }

  populateEnemies() {
    /* добавить монстров */
  }

  populateItems() {
    /* добавить предметы */
  }
}
