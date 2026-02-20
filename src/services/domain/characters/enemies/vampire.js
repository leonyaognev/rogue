import { Enemy, EnemyprotectedMethods } from "../enemy.js";

export class Vampire extends Enemy {
  #alreadyHit;

  constructor(name, maxHp, agility, strength, cords, hostility, level) {
    super(
      name,
      maxHp * 0.8,
      agility * 0.8,
      strength * 0.5,
      cords,
      hostility * 0.8,
      level
    );

    this.#alreadyHit = 0;
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
    this.#alreadyHit = true;
    if (this.#alreadyHit) return super.takeDamage(amount);
  }

  attack(target) {
    if (super.attack(target)) {
      target.maxHP--;
    }
  }
}
