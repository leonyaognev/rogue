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
        this.hp = Math.min(
          this.hp + this.inventory.remove(item).hpBonus,
          this.maxHP
        );
        break;
      }
      case ItemType.WEAPON: {
        this.weapon = this.inventory.remove(item);
        break;
      }
      case ItemType.SCROLL: {
        const curItem = this.inventory.remove(item);
        this.agility += curItem.agilityBonus;
        this.strength += curItem.strengthBonus;
        break;
      }
    }
  }

  pickItem(item) {
    return this.inventory.add(item);
  }
}
