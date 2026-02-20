import { MinHeap } from "./minHeap.js";

class Node {
  constructor(x, y, g, h, f, parent) {
    this.x = x;
    this.y = y;
    this.g = g;
    this.h = h;
    this.f = f;
    this.directionUp;
    this.parent = parent;
  }
}

export class aStar {
  constructor(grid, start, end, costFn = () => 1, isBlockedFn = () => false) {
    this.openSet = new MinHeap();
    this.openMap = new Map();
    this.closedSet = new Set();

    this.grid = grid;
    this.rows = grid.length;
    this.cols = grid[0].length;

    this.start = start;
    this.end = end;

    this.costFn = costFn;
    this.isBlockedFn = isBlockedFn;
  }

  findPath() {
    const startCost = this.#manhattan(this.start, this.end);
    this.openSet.push(
      new Node(this.start.x, this.start.y, 0, startCost, startCost, null)
    );

    while (this.openSet.length > 0) {
      const current = this.openSet.pop();

      if (this.#isEnd(current)) {
        return this.#reconstructPath(current);
      }

      this.closedSet.add(this.#key(current.x, current.y));

      for (const neighbor of this.#neighbors(current)) {
        this.#proccessNeighbor(current, neighbor.x, neighbor.y);
      }
    }

    return null;
  }

  #proccessNeighbor(current, x, y) {
    if (this.isBlockedFn(x, y)) return;

    if (this.#isInstance(x, y)) return;

    const key = this.#key(x, y);
    if (this.closedSet.has(key)) return;

    const gScore = current.g + this.costFn(current, x, y);
    const hScore = this.#manhattan({ x: x, y: y }, this.end);
    const fScore = gScore + hScore;

    const exists = this.openMap.get(key);

    if (!exists) {
      const neighborNode = new Node(x, y, gScore, hScore, fScore, current);
      this.openSet.push(neighborNode);
      this.openMap.set(key, neighborNode);
    } else if (gScore < exists.g) {
      exists.g = gScore;
      exists.h = hScore;
      exists.f = fScore;
      exists.parant = current;
      this.openSet.update(exists);
    }
  }

  #neighbors(current) {
    return [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];
  }

  #reconstructPath(node) {
    const path = [];
    while (node) {
      path.push({ x: node.x, y: node.y });
      node = node.parent;
    }
    return path.reverse();
  }

  #manhattan(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  #isEnd(current) {
    return current.x === this.end.x && current.y === this.end.y;
  }

  #isInstance(x, y) {
    return x < 0 || y < 0 || x >= this.cols || y >= this.rows;
  }

  #key(x, y) {
    return `${x},${y}`;
  }
}
