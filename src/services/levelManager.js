import { GameConfig } from "../constants.js";
import { Level } from "./domain/level.js";

export class LevelManager {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.currentLevel = 1;

    this.level = new Level(this.cols, this.rows, this.currentLevel);
  }

  nextLevel() {
    this.currentLevel++;
    this.level = new Level(this.cols, this.rows, this.currentLevel);
  }

  isLevelMax(max = GameConfig.MAX_LEVEL) {
    return this.currentLevel >= max;
  }
}
