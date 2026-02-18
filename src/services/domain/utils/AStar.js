import { PathCost, TileType } from "../constants.js";

class MinHeap {
  #items;
  #itemsMap;

  constructor() {
    this.#items = [];
    this.#itemsMap = new Map();
  }

  push(node) {
    this.#items.push(node);
    this.#itemsMap.set(node, this.#items.length - 1);
    this.#bubbleUp(this.#items.length - 1);
  }

  pop() {
    const top = this.#items[0];
    const end = this.#items.pop();

    this.#itemsMap.delete(top);

    if (this.#items.length > 0) {
      this.#items[0] = end;
      this.#itemsMap.set(end, 0);
      this.#bubbleDown(0);
    }
    return top;
  }

  update(node) {
    const index = this.#itemsMap.get(node);
    if (index === undefined) return;

    this.#bubbleUp(index);
    this.#bubbleDown(index);
  }

  get length() {
    return this.#items.length;
  }

  #swap(i, j) {
    [this.#items[i], this.#items[j]] = [this.#items[j], this.#items[i]];

    this.#itemsMap.set(this.#items[i], i);
    this.#itemsMap.set(this.#items[j], j);
  }

  #compare(i, j) {
    return this.#items[i].f < this.#items[j].f;
  }

  #bubbleUp(index) {
    let idx = index;

    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (!this.#compare(idx, parentIdx)) break;
      this.#swap(idx, parentIdx);
      idx = parentIdx;
    }
  }

  #bubbleDown(index) {
    let idx = index;

    while (true) {
      const leftIdx = idx * 2 + 1;
      const rightIdx = idx * 2 + 2;

      let swapIdx = null;

      if (leftIdx < this.#items.length && this.#compare(leftIdx, idx)) {
        swapIdx = leftIdx;
      }
      if (
        rightIdx < this.#items.length &&
        this.#compare(rightIdx, swapIdx === null ? idx : swapIdx)
      ) {
        swapIdx = rightIdx;
      }
      if (swapIdx === null) break;

      this.#swap(idx, swapIdx);

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
    this.directionUp;
    this.parent = parent;
  }
}

function aStar(grid, start, end, calculateCost, impassableTile) {
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

      if (impassableTile(nx, ny)) continue;

      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;

      const key = `${nx},${ny}`;
      if (closedSet.has(key)) continue;

      const gScore = current.g + calculateCost(nx, ny, current);
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
        exists.path = current;
      }
    }
  }

  return null;
}

export function aStarForCorridors(grid, start, end) {
  const isInside = (x, y, grid) => {
    return x >= 0 && y >= 0 && y < grid.length && x < grid[0].length;
  };

  const NearCorridor = (x, y, grid) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;

        if (!isInside(nx, ny, grid)) continue;
        if (grid[ny][nx] === TileType.CORRIDOR) {
          return PathCost.NEAR_CORRIDOR;
        }
      }
    }
    return PathCost.EMPTY;
  };

  const path = aStar(
    grid,
    start,
    end,
    (nx, ny, current) => {
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

      cost += NearCorridor(nx, ny, grid);

      if (current.parent) {
        const dx1 = current.x - current.parent.x;
        const dy1 = current.y - current.parent.y;

        const dx2 = nx - current.x;
        const dy2 = ny - current.y;

        if (dx1 !== dx2 || dy1 !== dy2) {
          cost += PathCost.ROTATE;
        }
      }
      return cost;
    },
    (nx, ny) => {}
  );

  return path;
}

export function aStarForEnd(grid, start, end) {
  const path = aStar(
    grid,
    start,
    end,

    (nx, ny, current) => {
      return 1;
    },

    (nx, ny) => {
      return grid[ny][nx] === TileType.WALL || grid[ny][nx] === TileType.EMPTY;
    }
  );

  return path;
}
