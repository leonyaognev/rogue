import { CombatConfig, TypesLogs } from '../../../constants.js';
import logger from '../../logger.js';

export default class Character {
  #isSleep;

  constructor(name, maxHP, agility, strength, cords) {
    this.name = name;
    this.maxHP = maxHP;
    this.hp = maxHP;
    this.agility = agility;
    this.strength = strength;
    this.weapon = null;
    this.cords = cords;

    this.potions = [];

    this.#isSleep = 0;
    this.visible = 1;
  }

  move(cords) {
    this.#potionsTick();
    const oldCords = { ...this.cords }; // TODO maybe means coords

    if (!this.#isSleep) {
      this.cords.x = cords.x;
      this.cords.y = cords.y;
    } else {
      this.#isSleep -= 1;
      return false;
    }

    return !(oldCords.x === this.cords.x && oldCords.y === this.cords.y);
  }

  attack(target) {
    this.#potionsTick();
    const bufs = this.potionsBufs();
    logger.log(
      `bufs: ${JSON.stringify(bufs)}, agility: ${bufs.agility}, strength: ${bufs.strength}`,
      TypesLogs.INFO,
    );
    if (!this.#checkHit(target, bufs.agility)) {
      logger.log(`${this.name} missed ${target.name}`, TypesLogs.MESSAGE);
      return false;
    }

    const damage = this.#calculateDamage(bufs.strength);

    target.takeDamage(damage);
    logger.log(
      `${this.name} hits ${target.name} for ${damage} damage`,
      TypesLogs.INFO,
    );
    return true;
  }

  takeDamage(amount) {
    this.hp -= amount;
    logger.log(
      `${this.name} takes HP ${Math.floor(amount)} damage. HP: ${Math.floor(this.hp)}/${Math.floor(this.maxHP)}`,
      TypesLogs.MESSAGE,
    );
  }

  takeDamageAtMaxHP(amount) {
    this.maxHP -= amount;
    logger.log(
      `${this.name} takes maxHP ${Math.floor(amount)} damage. HP: ${Math.floor(this.hp)}/${Math.floor(this.maxHP)}`,
      TypesLogs.MESSAGE,
    );
  }

  sleep(time) {
    if (time > 0) {
      this.isSleep = time;
    }
  }

  isDead() {
    if (this.hp <= 0) {
      logger.log(`${this.name} has dead`, TypesLogs.MESSAGE);
      return true;
    }
    return false;
  }

  potionsBufs() {
    let strength = 0;
    let agility = 0;

    for (const potion of this.potions) {
      strength += potion.strengthBonus;
      agility += potion.agilityBonus;
    }

    return { strength, agility };
  }

  getCurrentRoom(level) {
    return level.rooms.find(
      (room) => this.cords.x >= room.x
        && this.cords.x < room.x + room.width
        && this.cords.y >= room.y
        && this.cords.y < room.y + room.height,
    );
  }

  #potionsTick() {
    for (let i = 0; i < this.potions.length; i += 1) {
      const potion = this.potions[0];
      potion.duration -= 1;
      if (potion.duration <= 0) {
        logger.log(
          `the potion ${this.potions.splice(i, 1)[0].subType} is finished`,
          TypesLogs.MESSAGE,
        );
      }
    }
  }

  #checkHit(target, agilityBuf) {
    const chance = CombatConfig.hit.baseChance
      + (this.agility + agilityBuf - target.agility)
        * CombatConfig.hit.agilityFactor;

    const clamped = Math.max(
      CombatConfig.hit.minChance,
      Math.min(CombatConfig.hit.maxChance, chance),
    );

    return Math.random() < clamped;
  }

  #calculateDamage(strengthBuf) {
    const weaponBonus = this.weapon?.strengthBonus ?? 0;

    const base = this.strength + weaponBonus + strengthBuf;
    const variance = Math.floor(Math.random() * CombatConfig.damage.variance);

    return base + variance;
  }
}
