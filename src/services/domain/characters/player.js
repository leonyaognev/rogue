import { Inventory } from "../inventory.js";

export class Player extends Character {
  constructor(...args) {
    super(...args);
    this.inventory = new Inventory();
    this.level = 1;
    this.treasures = 0;
  }

  useItem(itemType, index) {
    /* использование еды/свитка/эликсира/оружия */
  }

  levelUp() {
    /* если нужно поднять уровень */
  }

  pickItem(item) {
    return this.inventory.add(item);
  }
}
