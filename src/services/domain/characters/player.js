import { ItemType, PlayerConfig } from "../../../constants.js";
import { Inventory } from "../inventory.js";
import { Character } from "./character.js";

export class Player extends Character {
  constructor(...args) {
    super(...args);
    this.inventory = new Inventory(PlayerConfig.MAX_ITEMS);
    this.treasures = 0;
  }

  useItem(item) {
    switch (item.type) {
      case ItemType.FOOD: {
        this.hp += Math.max(this.inventory.remove(item).hpBonus, this.maxHP);
      }
    }
  }

  pickItem(item) {
    return this.inventory.add(item);
  }
}
