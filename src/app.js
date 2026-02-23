import { PlayerConfig, TypesLogs } from "./constants.js";
import { SaveManager } from "./services/datalayer/saveManager.js";
import { Player } from "./services/domain/characters/player.js";
import { LevelManager } from "./services/levelManager.js";
import { logger } from "./services/logger.js";
import { Renderer2D } from "./services/presentation/2d/renderer.js";
import { WorldController } from "./services/worldController.js";

export class App {
  constructor() {
    this.renderer = new Renderer2D();
    this.saveManager = new SaveManager(".save.json");

    this.levelManager = new LevelManager(
      this.renderer.width,
      this.renderer.height,
      1
    );

    this.player = new Player(
      "player",
      PlayerConfig.DEFAULT_HP,
      PlayerConfig.DEFAULT_AGILITY,
      PlayerConfig.DEFAULT_STRENGTH,
      this.levelManager.level.startRoom.center,
      this.levelManager.level
    );

    this.worldController = new WorldController(
      this.levelManager.level,
      this.player
    );

    logger.log("App initialized", TypesLogs.INFO);
  }

  save() {
    this.saveManager.saveSession(this.worldController);
  }
}
