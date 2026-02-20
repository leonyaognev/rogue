import { Enemy, EnemyprotectedMethods } from "../enemy.js";

export class Zombie extends Enemy {
  movePattern(player) {
    if (this[EnemyprotectedMethods.playerIsNotNear](player)) {
      this.#randomTarget();
    } else {
      this[EnemyprotectedMethods.playerTarget](player);
    }

    this[EnemyprotectedMethods.nextStep]();

    return;
  }

  #randomTarget() {
    if (this.path.length < 1) {
      const targets = [];

      const room = this.getCurrentRoom();

      for (let y = room.y; y < room.y + room.height; y++) {
        for (let x = room.x; x < room.x + room.width; x++) {
          if (this[EnemyprotectedMethods.isInstance](x, y))
            targets.push({ x, y });
        }
      }

      const target = targets[Math.floor(Math.random() * targets.length)];

      this.path = this.finder.find(this.cords, { x: target.x, y: target.y });
    }

    this.angry = false;
  }
}
