import { TileType } from "../../constants.js";
import { enemyPathFinder } from "../../utils/aStar/finders/enemyPathFinder.js";
import { Enemy } from "../enemy.js";

export class Zombie extends Enemy {
  movePattern(player) {
    if (this.#playerIsNear(player)) {
      this.#randomTarget();
    } else {
      this.#playerTarget(player);
    }

    this.#nextStep();

    return;
  }

  #playerIsNear(player) {
    const dx = Math.abs(this.cords.x - player.cords.x);
    const dy = Math.abs(this.cords.y - player.cords.y);
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance > this.hostility;
  }

  #playerTarget(player) {
    if (this.path.length < 1 || this.angry === false) {
      const finder = new enemyPathFinder(this.level.map);
      this.path = finder.find(this.cords, player.cords).splice(1, 1);
    }
    this.angry = true;
  }

  #randomTarget() {
    if (this.path.length < 1) {
      const targets = [];

      const room = this.#getCurrentRoom();

      for (let y = room.y; y < room.y + room.height; y++) {
        for (let x = room.x; x < room.x + room.width; x++) {
          if (this.#isInstance(x, y)) targets.push({ x, y });
        }
      }

      const target = targets[Math.floor(Math.random() * targets.length)];

      const finder = new enemyPathFinder(this.level.map);
      this.path = finder.find(this.cords, { x: target.x, y: target.y });
    }

    this.angry = false;
  }

  #nextStep() {
    if (this.path && this.path.length > 0) {
      const nextStep = this.path.shift();

      this.cords.x = nextStep.x;
      this.cords.y = nextStep.y;
    }
  }

  #getCurrentRoom() {
    return this.level.rooms.find(
      (room) =>
        this.cords.x >= room.x &&
        this.cords.x < room.x + room.width &&
        this.cords.y >= room.y &&
        this.cords.y < room.y + room.height
    );
  }

  #isInstance(x, y) {
    return (
      x >= 0 &&
      y >= 0 &&
      y < this.level.map.length &&
      x < this.level.map[0].length &&
      this.level.map[y][x] === TileType.FLOOR
    );
  }
}
