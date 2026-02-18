const CombatConfig = {
  hit: {
    baseChance: 0.6,
    agilityFactor: 0.05,
    minChance: 0.1,
    maxChance: 0.95,
  },
  damage: {
    variance: 3,
  },
};

export class Character {
  constructor(name, maxHP, agility, strength, weapon = null, cords) {
    this.name = name;
    this.maxHP = maxHP;
    this.hp = maxHP;
    this.agility = agility;
    this.strength = strength;
    this.weapon = weapon;
    this.cords = cords;
  }

  move(cords) {
    this.cords.x = cords.x;
    this.cords.y = cords.y;
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

  attack(target) {
    if (!this.#checkHit(target)) {
      return 0;
    }

    const damage = this.#calculateDamage();
    const died = target.takeDamage(damage);

    return died ? 1 : 0;
  }

  takeDamage(amount) {
    this.hp -= amount;

    return this.hp <= 0;
  }
}
