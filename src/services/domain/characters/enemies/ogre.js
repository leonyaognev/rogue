import { Enemy, EnemyprotectedMethods } from "../enemy.js";

export class Ogre extends Enemy {
  constructor(name, maxHp, agility, strength, cords, hostility, level) {
    super(
      name,
      maxHp * 1,
      agility * 0.25,
      strength * 1,
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

    this[EnemyprotectedMethods.nextStep]();
    this[EnemyprotectedMethods.nextStep]();
  }

  #randomTarget() {
    if (this.path.length < 1) {
      const target = this[EnemyprotectedMethods.getNewTarget]();

      this.path = this.finder.find(this.cords, target);
    }

    this.angry = false;
  }
}
