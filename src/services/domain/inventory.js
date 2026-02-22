import { ItemType, PlayerConfig, TypesLogs } from "../../constants.js";
import { logger } from "../logger.js";

export class Inventory {
  constructor(maxItems = PlayerConfig.MAX_ITEMS) {
    this.items = { food: [], potion: [], scroll: [], weapon: [], treasure: [] };
    this.maxItems = maxItems;
    logger.log(`Inventory created. Max items: ${maxItems}`, TypesLogs.INFO);
  }

  add(item) {
    if (this.items[item.type].length >= this.maxItems) {
      logger.log(`Inventory full! Cannot add: ${item.subType}`, TypesLogs.WARN);
      return false;
    }
    this.items[item.type].push(item);
    logger.log(`Added to inventory: ${item.subType}`, TypesLogs.MESSAGE);
    return true;
  }

  remove(item) {
    const index = this.items[item.type].indexOf(item);
    logger.log(`Removed from inventory: ${item.subType}`, TypesLogs.MESSAGE);
    return this.items[item.type].splice(index, 1)[0];
  }

  list(type) {
    return this.items[type];
  }
}
