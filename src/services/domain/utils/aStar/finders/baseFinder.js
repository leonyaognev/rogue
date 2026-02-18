import { aStar } from "../aStar.js";

export class baseFinder {
  constructor(grid) {
    this.grid = grid;
    this.astar = aStar;
  }

  find(start, end) {}
}
