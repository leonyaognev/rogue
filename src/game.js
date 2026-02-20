import { Zombie } from "./services/domain/characters/enemies/zombie.js";
import { Player } from "./services/domain/characters/player.js";
import { GameConfig, PlayerConfig, TileType } from "./constants.js";
import { Level } from "./services/domain/level.js";
import { randomBetween } from "./services/domain/utils/randomBetween.js";
import { InputInit } from "./services/presentation/input.js";

export class Game {
  constructor(app) {
    this.app = app;

    this.rows = process.stdout.rows;
    this.columns = process.stdout.columns;

    this.currentLevel = 1;
    this.level = new Level(this.columns, this.rows, this.currentLevel);

    this.player = new Player(
      "player",
      PlayerConfig.DEFAULT_HP,
      PlayerConfig.DEFAULT_AGILITY,
      PlayerConfig.DEFAULT_STRENGTH,
      this.level.startRoom.center,
      this.level
    );

    this.input = InputInit(this.app.renderer.screen);
  }

  run() {
    setInterval(() => {
      this.#update();
      this.#refresh();
    }, GameConfig.TICK_RATE);
  }

  #update() {
    this.#playerMove();

    if (this.#isEndLevel()) {
      this.currentLevel++;
      this.level = new Level(this.columns, this.rows, this.currentLevel);
      this.player.move(this.level.startRoom.center);
    }

    if (this.player.hp <= 0) {
      this.app.renderer.screen.destroy();
      console.log("fuck up");
      process.exit(GameConfig.EXIT_CODE);
    }
  }

  #enemiesMove() {
    for (const enemy of this.level.enemies) {
      enemy.movePattern(this.player);
    }
  }

  #playerMove() {
    const newX = this.player.cords.x + this.input.right - this.input.left;
    const newY = this.player.cords.y + this.input.down - this.input.up;

    const targetTile = this.level.map[newY][newX];
    const enemyAtTarget = this.level.enemies.find(
      (enemy) => enemy.cords.x === newX && enemy.cords.y === newY
    );

    if (targetTile === TileType.FLOOR || targetTile === TileType.CORRIDOR) {
      if (enemyAtTarget) {
        this.player.attack(enemyAtTarget);
        if (enemyAtTarget.hp <= 0) {
          const index = this.level.enemies.indexOf(enemyAtTarget);
          if (index !== -1) this.level.enemies.splice(index, 1);
        }
      } else {
        this.player.move({ x: newX, y: newY });
      }
    }

    if (
      this.input.right ||
      this.input.left ||
      this.input.down ||
      this.input.up
    ) {
      this.#enemiesMove(this.player);
    }

    this.input.up =
      this.input.down =
      this.input.left =
      this.input.right =
        false;
  }

  #refresh() {
    this.app.renderer.refresh(
      this.level,
      this.level.entities,
      this.player,
      this.level.enemies
    );
  }

  #isEndLevel() {
    return (
      this.player.cords.x === this.level.endRoom.center.x &&
      this.player.cords.y === this.level.endRoom.center.y
    );
  }
}
