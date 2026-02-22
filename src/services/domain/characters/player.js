import { ItemType, PlayerConfig, TypesLogs } from "../../../constants.js";
import { logger } from "../../logger.js";
import { Inventory } from "../inventory.js";
import { Character } from "./character.js";

export class Player extends Character {
  constructor(...args) {
    super(...args);
    this.inventory = new Inventory(PlayerConfig.MAX_ITEMS);
    this.treasures = 0;
    logger.log(
      `Player "${this.name}" created. HP: ${this.hp}, Agility: ${this.agility}, Strength: ${this.strength}`,
      TypesLogs.INFO
    );
  }

  useItem(item) {
    switch (item.type) {
      case ItemType.FOOD: {
        this.hp = Math.min(
          this.hp + this.inventory.remove(item).hpBonus,
          this.maxHP
        );
        logger.log(
          `Player ate ${item.subType}. HP restored to ${Math.floor(this.hp)}/${this.maxHP}`,
          TypesLogs.MESSAGE
        );
        break;
      }
      case ItemType.POTION: {
        this.potions.push(this.inventory.remove(item));
        logger.log(`Player drunk potion: ${item.subType}`, TypesLogs.MESSAGE);
        break;
      }
      case ItemType.WEAPON: {
        this.weapon = this.inventory.remove(item);
        logger.log(
          `Player equipped weapon: ${item.subType}`,
          TypesLogs.MESSAGE
        );
        break;
      }
      case ItemType.SCROLL: {
        const curItem = this.inventory.remove(item);
        this.agility += curItem.agilityBonus;
        this.strength += curItem.strengthBonus;
        logger.log(
          `Player read scroll: ${item.subType}. Agility: ${this.agility}, Strength: ${this.strength}`,
          TypesLogs.MESSAGE
        );
        break;
      }
    }
  }

  pickItem(item) {
    const result = this.inventory.add(item);
    if (result) {
      logger.log(`Item picked up: ${item.subType}`, TypesLogs.MESSAGE);
    } else {
      logger.log(
        `Inventory full! Could not pick up: ${item.subType}`,
        TypesLogs.WARN
      );
    }
    return result;
  }
}
