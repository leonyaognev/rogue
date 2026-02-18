import { aStar } from "../aStar.js";

export class baseFinder {
  constructor(grid) {
    this.grid = grid;
    this.FinderClass = aStar;
  }

  find(start, end) {}
}
