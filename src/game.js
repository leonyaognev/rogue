import { Zombie } from "./services/domain/characters/enemies/zombie.js";
import { Player } from "./services/domain/characters/player.js";
import { TileType } from "./services/domain/constants.js";
import { Level } from "./services/domain/level.js";
import { randomBetween } from "./services/domain/utils/randomBetween.js";
import { InputInit } from "./services/presentation/input.js";

export class Game {
  constructor(app) {
    this.app = app;

    this.rows = process.stdout.rows;
    this.columns = process.stdout.columns;

    this.level = new Level(this.columns, this.rows);
    this.currentLevel = 1;

    this.player = new Player(
      "player",
      100,
      20,
      20,
      this.#startPossitionPlayerCords()
    );

    this.input = InputInit(this.app.renderer.screen);

    this.isRunning = true;
  }

  run() {
    setInterval(() => {
      this.#update();
      this.#refresh();
    }, 17);
  }

  #update() {
    this.#playerMove();

    if (this.#isEndLevel()) {
      this.level = new Level(this.columns, this.rows);
      this.player.move(this.#startPossitionPlayerCords());
      this.currentLevel++;
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

    if (
      this.input.right ||
      this.input.left ||
      this.input.down ||
      this.input.up
    ) {
      this.#enemiesMove(this.player);
    }

    if (
      this.level.map[newY][newX] === TileType.FLOOR ||
      this.level.map[newY][newX] === TileType.CORRIDOR
    ) {
      this.player.cords.x = newX;
      this.player.cords.y = newY;
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

  #startPossitionPlayerCords() {
    return {
      x: randomBetween(
        this.level.startRoom.x,
        this.level.startRoom.x + this.level.startRoom.width - 1
      ),
      y: randomBetween(
        this.level.startRoom.y,
        this.level.startRoom.y + this.level.startRoom.height - 1
      ),
    };
  }

  #isEndLevel() {
    return (
      this.player.cords.x === this.level.endRoom.center.x &&
      this.player.cords.y === this.level.endRoom.center.y
    );
  }
}
