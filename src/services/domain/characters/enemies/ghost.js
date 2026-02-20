import { Enemy, EnemyprotectedMethods } from "../enemy.js";

export class Ghost extends Enemy {
  constructor(name, maxHp, agility, strength, cords, hostility, level) {
    super(
      name,
      maxHp * 0.35,
      agility * 0.85,
      strength * 0.3,
      cords,
      hostility * 0.3,
      level
    );
  }

  movePattern(player) {
    if (this.angry) {
      this.visible = 1;
    } else {
      this.visible = Math.floor(Math.random() * 2);
    }

    if (this[EnemyprotectedMethods.playerIsNotNear](player)) {
      this.#randomTarget();
    } else {
      this[EnemyprotectedMethods.playerTarget](player);
    }

    this[EnemyprotectedMethods.nextStep]();
  }

  #randomTarget() {
    if (this.path.length < 1) {
      const target = this[EnemyprotectedMethods.getNewTarget]();
      this.path.push(target);
    }

    this.angry = false;
  }
}
