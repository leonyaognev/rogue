import { Enemy, EnemyprotectedMethods } from '../enemy.js';

export default class Vampire extends Enemy {
  #alreadyHit;

  constructor(name, maxHp, agility, strength, coords, hostility, level) {
    super(
      name,
      maxHp * 0.8,
      agility * 0.8,
      strength * 0.5,
      coords,
      hostility * 0.8,
      level,
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

      this.path = this.finder.find(this.coords, target);
    }

    this.angry = false;
  }

  takeDamage(amount) {
    if (this.#alreadyHit) super.takeDamage(amount);
    this.#alreadyHit = true;
  }

  attack(target) {
    if (super.attack(target)) {
      target.takeDamageAtMaxHP(1);
    }
  }
}
