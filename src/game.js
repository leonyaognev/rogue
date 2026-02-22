import { GameConfig, ItemType, PlayerConfig, TypesLogs } from "./constants.js";
import { Player } from "./services/domain/characters/player.js";
import { LevelManager } from "./services/levelManager.js";
import { logger } from "./services/logger.js";
import { GameInput } from "./services/presentation/input.js";
import { WorldController } from "./services/worldController.js";

export class Game {
  constructor(app) {
    this.app = app;

    this.levelManager = new LevelManager(
      this.app.renderer.width,
      this.app.renderer.height
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

    this.gameInput = new GameInput(
      this.app.renderer.screen,
      this.#actionOnInput.bind(this)
    );

    this.gameInput.bind();
    logger.log(
      `Game initialized. Level: ${this.levelManager.currentLevel}`,
      TypesLogs.INFO
    );
  }

  run() {
    logger.log("Game started", TypesLogs.INFO);
    this.#update();
    this.#refresh();
  }

  #update() {
    if (this.worldController.isEndLevel()) {
      this.worldController.level = this.levelManager.nextLevel();
      logger.log(
        `Level completed! Advancing to level ${this.levelManager.currentLevel}`,
        TypesLogs.INFO
      );
      if (this.levelManager.isLevelMax()) {
        this.gameLoop.stop();
        this.app.renderer.screen.destroy();
        logger.log("You have won the game!", TypesLogs.INFO);
        process.exit(GameConfig.EXIT_CODE);
      }
      this.player.move(this.levelManager.level.startRoom.center);
    }

    if (this.player.isDead()) {
      this.app.renderer.screen.destroy();
      logger.log("Game over - Player died", TypesLogs.ERROR);
      process.exit(GameConfig.EXIT_CODE);
    }
  }

  #actionOnInput(action) {
    const showList = (itemType) => {
      this.gameInput.unbind();
      this.app.renderer.showItemsMenu(
        this.player.inventory.list(itemType),
        (item) => {
          this.player.useItem(item);
          logger.log(`Player used food: ${item.subType}`, TypesLogs.INFO);
        },
        () => {
          this.gameInput.bind();
          this.#update();
          this.#refresh();
        }
      );
    };

    switch (action) {
      case "up":
        this.worldController.movePlayer(0, -1);
        this.worldController.moveEnemies();
        break;
      case "down":
        this.worldController.movePlayer(0, 1);
        this.worldController.moveEnemies();
        break;
      case "left":
        this.worldController.movePlayer(-1, 0);
        this.worldController.moveEnemies();
        break;
      case "right":
        this.worldController.movePlayer(1, 0);
        this.worldController.moveEnemies();
        break;
      case "food":
        showList(ItemType.FOOD);
        break;
      case "scroll":
        showList(ItemType.SCROLL);
        break;
      case "weapon":
        showList(ItemType.WEAPON);
        break;
      case "potion":
        showList(ItemType.POTION);
        break;
    }
    this.#update();
    this.#refresh();
  }

  #refresh() {
    this.app.renderer.refresh(
      this.levelManager.level,
      this.levelManager.level.items,
      this.player,
      this.levelManager.level.enemies
    );
  }
}
