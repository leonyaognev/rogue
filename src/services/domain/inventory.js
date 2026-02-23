import { PlayerConfig, TypesLogs } from "../../constants.js";
import { logger } from "../logger.js";
import { Item } from "./item.js";

export class Inventory {
  constructor(maxItems = PlayerConfig.MAX_ITEMS) {
    this.items = { food: [], potion: [], scroll: [], weapon: [] };
    this.maxItems = maxItems;
    logger.log(`Inventory created. Max items: ${maxItems}`, TypesLogs.INFO);
  }

  serialize() {
    return {
      items: {
        food: this.items.food.map((item) => item.serialize()),
        potion: this.items.potion.map((item) => item.serialize()),
        scroll: this.items.scroll.map((item) => item.serialize()),
        weapon: this.items.weapon.map((item) => item.serialize()),
      },
    };
  }

  static deserialize(data) {
    const inv = new Inventory();

    inv.items.food = (data.items.food || []).map((itemData) =>
      Item.deserialize(itemData)
    );
    inv.items.potion = (data.items.potion || []).map((itemData) =>
      Item.deserialize(itemData)
    );
    inv.items.scroll = (data.items.scroll || []).map((itemData) =>
      Item.deserialize(itemData)
    );
    inv.items.weapon = (data.items.weapon || []).map((itemData) =>
      Item.deserialize(itemData)
    );

    return inv;
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
