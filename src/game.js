import { GameConfig, ItemType, TypesLogs } from './constants.js';
import logger from './services/logger.js';
import GameInput from './services/presentation/input.js';

export default class Game {
  constructor(app) {
    this.app = app;

    this.gameInput = new GameInput(
      this.app.renderer.screen,
      this.#actionOnInput.bind(this),
    );

    this.gameInput.bind();
    logger.log(
      `Game initialized. Level: ${this.app.levelManager.currentLevel}`,
      TypesLogs.INFO,
    );
  }

  run() {
    logger.log('Game started', TypesLogs.INFO);
    this.#update();
    this.#refresh();
  }

  #update() {
    if (this.app.worldController.isEndLevel()) {
      this.app.worldController.level = this.app.levelManager.nextLevel();
      this.app.player.levelRaised(this.app.levelManager.currentLevel);
      logger.log(
        `Level completed! Advancing to level ${this.app.levelManager.currentLevel}`,
        TypesLogs.MESSAGE,
      );
      if (this.app.levelManager.isLevelMax()) {
        logger.log('You have won the game!', TypesLogs.INFO);
        this.#showLeaderBoard().then(() => {
          this.app.renderer.screen.destroy();
          this.app.saveLeaderBoard().then(() => {
            process.exit(GameConfig.EXIT_CODE);
          });
        });
      }
      this.app.renderer.clear();
      this.app.player.move(this.app.levelManager.level.startRoom.center);
      this.app.save();
    }

    if (this.app.player.isDead()) {
      logger.log('Game over - Player died', TypesLogs.ERROR);
      this.#showLeaderBoard().then(() => {
        this.app.renderer.screen.destroy();
        this.app.saveLeaderBoard().then(() => {
          process.exit(GameConfig.EXIT_CODE);
        });
      });
    }
  }

  #showLeaderBoard() {
    return new Promise((resolve) => {
      this.gameInput.unbind();
      this.app.renderer.showLeaderBoard(this.app.leaderBoard.board, () => {
        this.gameInput.bind();
        this.#update();
        this.#refresh();
        resolve('ok');
      });
    });
  }

  #bind() {
    this.gameInput.bind();
    this.#update();
    this.#refresh();
  }

  #showWeaponMenu() {
    this.gameInput.unbind();

    this.app.renderer.showWeaponMenu(
      this.app.player.inventory.list(ItemType.WEAPON),
      (item) => {
        const thrownItem = this.app.player.useItem(item);
        if (thrownItem) {
          thrownItem.coords = { ...this.app.player.coords };
          this.app.levelManager.level.items.push(thrownItem);
        }
        logger.log(`Player used item: ${item.subType}`, TypesLogs.INFO);
      },
      this.#bind.bind(this),
      this.app.player.weapon,
    );
  }

  #showInventoryMenu(itemType) {
    this.gameInput.unbind();
    this.app.renderer.showItemsMenu(
      itemType,
      this.app.player.inventory.list(itemType),
      (item) => {
        this.app.player.useItem(item);
        logger.log(`Player used item: ${item.subType}`, TypesLogs.INFO);
      },
      this.#bind.bind(this),
      this.app.player,
    );
  }

  #actionOnInput(action) {
    const moves = {
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0],
    };

    const menu = {
      food: ItemType.FOOD,
      scroll: ItemType.SCROLL,
      potion: ItemType.POTION,
    };

    if (moves[action]) {
      const [dx, dy] = moves[action];
      this.app.worldController.movePlayer(dx, dy);
      this.app.worldController.moveEnemies();
    } else if (menu[action]) {
      this.#showInventoryMenu(menu[action]);
    } else {
      switch (action) {
        case 'weapon':
          this.#showWeaponMenu();
          break;
        case 'leaderBoard':
          this.#showLeaderBoard();
          break;
        default:
          logger.log('unknown action', TypesLogs.WARN);
      }
    }

    this.#update();
    this.#refresh();
  }

  #refresh() {
    this.app.renderer.refresh(
      this.app.levelManager.level,
      this.app.levelManager.level.items,
      this.app.player,
      this.app.levelManager.level.enemies,
    );
  }
}
