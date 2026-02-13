export class Enemy extends Character {
  constructor(type, hp, agility, strength, hostility) {
    super(type, hp, hp, agility, strength);
    this.hostility = hostility;
  }

  movePattern(level) {
    /* логика движения монстра */
  }

  decideAction(player) {
    /* преследование/телепорт/атака */
  }
}
