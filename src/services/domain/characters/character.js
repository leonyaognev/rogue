import { CombatConfig } from "../../../constants.js";

export class Character {
  #isSleep;

  constructor(name, maxHP, agility, strength, cords) {
    this.name = name;
    this.maxHP = maxHP;
    this.hp = maxHP;
    this.agility = agility;
    this.strength = strength;
    this.weapon = null;
    this.cords = cords;

    this.#isSleep = 0;
    this.visible = 1;
  }

  move(cords) {
    const old_cords = { ...this.cords };

    if (!this.#isSleep) {
      this.cords.x = cords.x;
      this.cords.y = cords.y;
    } else {
      this.#isSleep--;
      return false;
    }

    return !(old_cords.x === this.cords.x && old_cords.y === this.cords.y);
  }

  attack(target) {
    if (!this.#checkHit(target)) {
      return false;
    }

    const damage = this.#calculateDamage();

    target.takeDamage(damage);
    return true;
  }

  takeDamage(amount) {
    this.hp -= amount;
  }

  sleep(time) {
    if (time > 0) {
      this.isSleep = time;
    }
  }

  #checkHit(target) {
    const chance =
      CombatConfig.hit.baseChance +
      (this.agility - target.agility) * CombatConfig.hit.agilityFactor;

    const clamped = Math.max(
      CombatConfig.hit.minChance,
      Math.min(CombatConfig.hit.maxChance, chance)
    );

    return Math.random() < clamped;
  }

  #calculateDamage() {
    const weaponBonus = this.weapon?.strengthBonus ?? 0;

    const base = this.strength + weaponBonus;
    const variance = Math.floor(Math.random() * CombatConfig.damage.variance);

    return base + variance;
  }
}
