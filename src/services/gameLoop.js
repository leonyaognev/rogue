import { GameConfig, TypesLogs } from "../constants.js";
import { logger } from "./logger.js";

export class GameLoop {
  constructor(onTick, tickRate = GameConfig.TICK_RATE) {
    this.tickRate = tickRate;
    this.onTick = onTick;
    logger.log(
      `GameLoop created with tick rate: ${tickRate}ms`,
      TypesLogs.INFO
    );
  }

  start() {
    logger.log("GameLoop started", TypesLogs.INFO);
    this.interval = setInterval(this.onTick, this.tickRate);
  }

  end() {
    logger.log("GameLoop stopped", TypesLogs.INFO);
    clearInterval(this.interval);
  }
}
