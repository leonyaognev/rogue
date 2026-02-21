import { ItemType, PlayerConfig } from "../../constants.js";

export class Inventory {
  constructor() {
    this.items = { food: [], potion: [], scroll: [], weapon: [], treasure: [] };
  }

  add(item) {
    if (this.items[item.type].length >= 9) {
      return false;
    }
    this.items[item.type].push(item);
    return true;
  }

  remove(item) {
    const index = this.items[item.type].indexOf(item);
    this.items[item.type].splace(index, 1);
  }

  list(type) {
    return this.items[type];
  }
}
