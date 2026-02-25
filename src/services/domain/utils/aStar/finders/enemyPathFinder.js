import { TileType } from '../../../../../constants.js';
import baseFinder from './baseFinder.js';

export default class enemyPathFinder extends baseFinder {
  find(start, end) {
    const pathFinder = new this.FinderClass(
      this.grid,
      start,
      end,
      () => 1,
      (x, y) => this.grid[y][x] === TileType.WALL || this.grid[y][x] === TileType.EMPTY,
    );

    return pathFinder.findPath();
  }
}
