import { PlayerConfig } from "../../constants.js";

export class Inventory {
  constructor() {
    this.items = { food: [], potion: [], scroll: [], weapon: [], treasure: [] };
  }

  add(item) {
    /* добавить с проверкой на колличество (до ${PlayerConfig.MAX_ITEMS} предметов)*/
  }

  remove(item) {
    /* удалить */
  }

  list(type) {
    /* вернуть список */
  }
}
