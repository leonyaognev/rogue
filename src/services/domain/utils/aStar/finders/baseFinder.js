import aStar from '../aStar.js';

export default class baseFinder {
  constructor(grid) {
    this.grid = grid;
    this.FinderClass = aStar;
  }

  find(start, end) {} // FIXME maybe clean empty method
}
