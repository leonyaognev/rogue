import { GameConfig, ItemType, TypesLogs } from "./constants.js";
import { logger } from "./services/logger.js";
import { GameInput } from "./services/presentation/input.js";

export class Game {
  constructor(app) {
    this.app = app;

    this.gameInput = new GameInput(
      this.app.renderer.screen,
      this.#actionOnInput.bind(this)
    );

    this.gameInput.bind();
    logger.log(
      `Game initialized. Level: ${this.app.levelManager.currentLevel}`,
      TypesLogs.INFO
    );
  }

  run() {
    logger.log("Game started", TypesLogs.INFO);
    this.#update();
    this.#refresh();
  }

  #update() {
    if (this.app.worldController.isEndLevel()) {
      this.app.worldController.level = this.app.levelManager.nextLevel();
      logger.log(
        `Level completed! Advancing to level ${this.app.levelManager.currentLevel}`,
        TypesLogs.INFO
      );
      if (this.app.levelManager.isLevelMax()) {
        this.app.renderer.screen.destroy();
        logger.log("You have won the game!", TypesLogs.INFO);
        process.exit(GameConfig.EXIT_CODE);
      }
      this.app.renderer.clear();
      this.app.player.move(this.app.levelManager.level.startRoom.center);
      this.app.save();
    }

    if (this.app.player.isDead()) {
      this.app.renderer.screen.destroy();
      logger.log("Game over - Player died", TypesLogs.ERROR);
      process.exit(GameConfig.EXIT_CODE);
    }
  }

  #actionOnInput(action) {
    const showList = (itemType) => {
      this.gameInput.unbind();
      this.app.renderer.showItemsMenu(
        this.app.player.inventory.list(itemType),
        (item) => {
          this.app.player.useItem(item);
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
        this.app.worldController.movePlayer(0, -1);
        this.app.worldController.moveEnemies();
        break;
      case "down":
        this.app.worldController.movePlayer(0, 1);
        this.app.worldController.moveEnemies();
        break;
      case "left":
        this.app.worldController.movePlayer(-1, 0);
        this.app.worldController.moveEnemies();
        break;
      case "right":
        this.app.worldController.movePlayer(1, 0);
        this.app.worldController.moveEnemies();
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
      this.app.levelManager.level,
      this.app.levelManager.level.items,
      this.app.player,
      this.app.levelManager.level.enemies
    );
  }
}
