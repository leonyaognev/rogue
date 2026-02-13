import { Inventory } from "../inventory.js";
import { Character } from "./character.js";

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

  pickItem(item) {
    return this.inventory.add(item);
  }
}
