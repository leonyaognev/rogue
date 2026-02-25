import { Enemy, EnemyprotectedMethods } from '../enemy.js';

export default class Ogre extends Enemy {
  constructor(name, maxHp, agility, strength, coords, hostility, level) {
    super(
      name,
      maxHp * 1,
      agility * 0.25,
      strength * 1,
      coords,
      hostility * 0.6,
      level,
    );
  }

  movePattern(player) {
    if (this[EnemyprotectedMethods.playerIsNotNear](player)) {
      this.#randomTarget();
    } else {
      this[EnemyprotectedMethods.playerTarget](player);
    }

    this[EnemyprotectedMethods.nextStep](player);
    this[EnemyprotectedMethods.nextStep](player);
  }

  #randomTarget() {
    if (this.path.length < 1) {
      const target = this[EnemyprotectedMethods.getNewTarget]();

      this.path = this.finder.find(this.coords, target);
    }

    this.angry = false;
  }
}
