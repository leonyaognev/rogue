import { GameConfig } from "../constants.js";

export class GameLoop {
  constructor(onTick, tickRate = GameConfig.TICK_RATE) {
    this.tickRate = tickRate;
    this.onTick = onTick;
  }

  start() {
    this.interval = setInterval(this.onTick, this.tickRate);
  }

  end() {
    clearInterval(this.interval);
  }
}
