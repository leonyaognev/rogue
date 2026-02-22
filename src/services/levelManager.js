import { GameConfig } from "../constants.js";
import { Level } from "./domain/level.js";

export class LevelManager {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.currentLevel = 1;

    this.level = new Level(this.width, this.height, this.currentLevel);
  }

  nextLevel() {
    this.currentLevel++;
    this.level = new Level(this.height, this.width, this.currentLevel);
    return this.level;
  }

  isLevelMax(max = GameConfig.MAX_LEVEL) {
    return this.currentLevel >= max;
  }
}
