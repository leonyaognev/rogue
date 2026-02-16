import { PathCost, TileType } from "../constants.js";

class MinHeap {
  #items;
  constructor() {
    this.#items = [];
  }

  push(value) {
    this.#items.push(value);
    this.#bubbleUp();
  }

  pop() {
    const top = this.#items[0];
    const end = this.#items.pop();
    if (this.#items.length > 0) {
      this.#items[0] = end;
      this.#bubbleDown();
    }
    return top;
  }

  get length() {
    return this.#items.length;
  }

  #bubbleUp() {
    let idx = this.#items.length - 1;
    const node = this.#items[idx];

    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.#items[parentIdx];
      if (node.f >= parent.f) break;
      this.#items[idx] = parent;
      this.#items[parentIdx] = node;
      idx = parentIdx;
    }
  }

  #bubbleDown() {
    let idx = 0;
    const node = this.#items[idx];

    while (true) {
      const leftIdx = idx * 2 + 1;
      const rightIdx = idx * 2 + 2;

      let swapIdx = null;

      if (leftIdx < this.#items.length && this.#items[leftIdx].f < node.f) {
        swapIdx = leftIdx;
      }
      if (
        rightIdx < this.#items.length &&
        this.#items[rightIdx].f <
          (swapIdx === null ? node.f : this.#items[swapIdx].f)
      ) {
        swapIdx = rightIdx;
      }
      if (swapIdx === null) break;

      this.#items[idx] = this.#items[swapIdx];
      this.#items[swapIdx] = node;
      idx = swapIdx;
    }
  }
}

class Node {
  constructor(x, y, g, h, f, parent) {
    this.x = x;
    this.y = y;
    this.g = g;
    this.h = h;
    this.f = f;
    this.parent = parent;
  }
}

export function aStar(grid, start, end) {
  const openSet = new MinHeap();
  const openMap = new Map();
  const closedSet = new Set();

  const rows = grid.length;
  const cols = grid[0].length;

  function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  openSet.push(
    new Node(
      start.x,
      start.y,
      0,
      heuristic(start, end),
      heuristic(start, end),
      null
    )
  );

  while (openSet.length > 0) {
    const current = openSet.pop();

    if (current.x === end.x && current.y === end.y) {
      const path = [];
      let node = current;

      while (node) {
        path.push({ x: node.x, y: node.y });
        node = node.parent;
      }
      return path.reverse();
    }

    closedSet.add(`${current.x},${current.y}`);

    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];

    for (const neighbor of neighbors) {
      const nx = neighbor.x;
      const ny = neighbor.y;

      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;

      const key = `${nx},${ny}`;
      if (closedSet.has(key)) continue;

      let cost = 1;
      switch (grid[ny][nx]) {
        case TileType.EMPTY:
          cost = PathCost.EMPTY;
          break;
        case TileType.FLOOR:
          cost = PathCost.FLOOR;
          break;
        case TileType.WALL:
          cost = PathCost.WALL;
          break;
        case TileType.CORRIDOR:
          cost = PathCost.CORRIDOR;
          break;
      }

      const gScore = current.g + cost;
      const hScore = heuristic(neighbor, end);
      const fScore = gScore + hScore;

      const exists = openMap.get(key);

      if (!exists) {
        const neighborNode = new Node(nx, ny, gScore, hScore, fScore, current);
        openSet.push(neighborNode);
        openMap.set(key, neighborNode);
      } else if (gScore < exists.g) {
        exists.g = gScore;
        exists.h = hScore;
        exists.f = fScore;
        exists.parent = current;
      }
    }
  }

  return null;
}
