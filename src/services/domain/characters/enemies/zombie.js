import { Enemy, EnemyprotectedMethods } from "../enemy.js";

export class Zombie extends Enemy {
  constructor(name, maxHp, agility, strength, cords, hostility, level) {
    super(
      name,
      maxHp * 0.85,
      agility * 0.3,
      strength * 0.6,
      cords,
      hostility * 0.6,
      level
    );
  }

  movePattern(player) {
    if (this[EnemyprotectedMethods.playerIsNotNear](player)) {
      this.#randomTarget();
    } else {
      this[EnemyprotectedMethods.playerTarget](player);
    }

    this[EnemyprotectedMethods.nextStep](player);
  }

  #randomTarget() {
    if (this.path.length < 1) {
      const target = this[EnemyprotectedMethods.getNewTarget]();

      this.path = this.finder.find(this.cords, target);
    }

    this.angry = false;
  }
}
