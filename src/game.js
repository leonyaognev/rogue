import { GameConfig, ItemType, PlayerConfig } from "./constants.js";
import { Player } from "./services/domain/characters/player.js";
import { GameLoop } from "./services/gameLoop.js";
import { LevelManager } from "./services/levelManager.js";
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

    this.gameLoop = new GameLoop(() => {
      this.#update();
      this.#refresh();
    }, GameConfig.TICK_RATE);

    this.gameInput.bind();
  }

  run() {
    this.gameLoop.start();
  }

  #update() {
    if (this.worldController.isEndLevel()) {
      this.worldController.level = this.levelManager.nextLevel();
      if (this.levelManager.isLevelMax()) {
        this.gameLoop.stop();
        this.app.renderer.screen.destroy();
        console.log("You fucking won");
        process.exit(GameConfig.EXIT_CODE);
      }
      this.player.move(this.levelManager.level.startRoom.center);
    }

    if (this.player.isDead()) {
      this.app.renderer.screen.destroy();
      console.log("fuck up");
      process.exit(GameConfig.EXIT_CODE);
    }
  }

  #actionOnInput(action) {
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
        this.gameInput.unbind();
        this.app.renderer.showItemsMenu(
          this.player.inventory.list(ItemType.FOOD),
          (item) => {
            this.player.useItem(item);
          },
          () => {
            this.gameInput.bind();
          }
        );
        break;
      case "scroll":
        this.gameInput.unbind();
        this.app.renderer.showItemsMenu(
          this.player.inventory.list(ItemType.SCROLL),
          (item) => {
            this.player.useItem(item);
          },
          () => {
            this.gameInput.bind();
          }
        );
        break;
    }
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
