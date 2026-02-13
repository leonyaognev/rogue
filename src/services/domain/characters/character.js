export class Character {
  constructor(name, maxHP, hp, agility, strength, weapon = null) {
    this.name = name;
    this.maxHP = maxHP;
    this.hp = hp;
    this.agility = agility;
    this.strength = strength;
    this.weapon = weapon;
  }

  move(x, y) {
    /* изменить координаты */
  }

  attack(target) {
    /* пошаговый бой */
  }

  takeDamage(amount) {
    /* вычесть hp, проверить смерть */
  }

  pickItem(item) {
    /* добавить в рюкзак */
  }
}
