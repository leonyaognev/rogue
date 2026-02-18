import { PathCost, TileType } from "../../../constants.js";
import { baseFinder } from "./baseFinder.js";

export class CorridorPathfinder extends baseFinder {
  find(start, end) {
    const pathFinder = new this.astar(
      this.grid,
      start,
      end,
      this.#cost.bind(this),
      () => false
    );

    return pathFinder.findPath();
  }

  #cost(current, x, y) {
    let cost = 1;
    switch (this.grid[y][x]) {
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

    cost += this.#NearCorridor(x, y, this.grid);

    if (current.parent) {
      const dx1 = current.x - current.parent.x;
      const dy1 = current.y - current.parent.y;

      const dx2 = x - current.x;
      const dy2 = y - current.y;

      if (dx1 !== dx2 || dy1 !== dy2) {
        cost += PathCost.ROTATE;
      }
    }
    return cost;
  }

  #isInside(x, y) {
    return x >= 0 && y >= 0 && y < this.grid.length && x < this.grid[0].length;
  }

  #NearCorridor(x, y) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;

        if (!this.#isInside(nx, ny, this.grid)) continue;
        if (this.grid[ny][nx] === TileType.CORRIDOR) {
          return PathCost.NEAR_CORRIDOR;
        }
      }
    }
    return PathCost.EMPTY;
  }
}
