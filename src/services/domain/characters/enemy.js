import { Character } from "./character.js";

export class Enemy extends Character {
  constructor(name, maxHp, agility, strength, cords, hostility, level) {
    super(name, maxHp, agility, strength, cords);
    this.hostility = hostility;
    this.level = level;
    this.path = [];
  }

  movePattern(player) {}
}
