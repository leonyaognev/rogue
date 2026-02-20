import { Enemy, EnemyprotectedMethods } from "../enemy.js";

export class Vampire extends Enemy {
  #countHits;

  constructor(name, maxHp, agility, strength, cords, hostility, level) {
    super(
      name,
      maxHp * 0.9,
      agility * 0.9,
      strength * 0.6,
      cords,
      hostility * 0.9,
      level
    );

    this.#countHits = 0;
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

  takeDamage(amount) {
    if (this.#countHits) return super.takeDamage(amount);
  }

  attack(target) {
    target.maxHp--;

    return super.attack(target);
  }
}
