import { GameConfig, TypesLogs } from "../constants.js";
import { Level } from "./domain/level.js";
import { logger } from "./logger.js";

export class LevelManager {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.currentLevel = 1;

    this.level = new Level(this.width, this.height, this.currentLevel);
    logger.log(
      `LevelManager created. Level size: ${width}x${height}`,
      TypesLogs.INFO
    );
  }

  nextLevel() {
    this.currentLevel++;
    this.level = new Level(this.width, this.height, this.currentLevel);
    logger.log(`Generating level ${this.currentLevel}`, TypesLogs.INFO);
    return this.level;
  }

  isLevelMax(max = GameConfig.MAX_LEVEL) {
    return this.currentLevel >= max;
  }
}
