import { ItemType, PlayerConfig } from "../../constants.js";

export class Inventory {
  constructor(maxItems = PlayerConfig.MAX_ITEMS) {
    this.items = { food: [], potion: [], scroll: [], weapon: [], treasure: [] };
    this.maxItems = maxItems;
  }

  add(item) {
    if (this.items[item.type].length >= this.maxItems) {
      return false;
    }
    this.items[item.type].push(item);
    return true;
  }

  remove(item) {
    const index = this.items[item.type].indexOf(item);
    return this.items[item.type].splice(index, 1)[0];
  }

  list(type) {
    return this.items[type];
  }
}
