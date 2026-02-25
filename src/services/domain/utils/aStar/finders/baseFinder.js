import aStar from '../aStar.js';

export default class baseFinder {
  constructor(grid) {
    this.grid = grid;
    this.FinderClass = aStar;
  }

  /**
   * это метод обозночающий архитекутуру для потомков,
   * "виртуальный метод" он не должен нести в себе логики
   */
  find(start, end) {}
}
