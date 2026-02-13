import { Player } from "./services/domain/characters/player.js";
import { Level } from "./services/domain/level.js";

export class Game {
  constructor(app) {
    this.app = app;

    this.level = new Level();
    this.player = new Player();

    this.isRunning = true;
  }

  run() {
    this.app.renderer.refresh(
      this.level,
      this.level.entities,
      this.player,
      this.level.enemies
    );
  }
}
