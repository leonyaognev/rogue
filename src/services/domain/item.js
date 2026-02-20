import { ItemType } from "../../constants";

export class Item {
  constructor(
    type,
    subtype,
    hpBonus = 0,
    maxHpBonus = 0,
    agilityBonus = 0,
    strengthBonus = 0,
    value = 0
  ) {
    this.type = type; // принимает значение из ItemType
    this.subtype = subtype;
    this.hpBonus = hpBonus;
    this.maxHpBonus = maxHpBonus;
    this.agilityBonus = agilityBonus;
    this.strengthBonus = strengthBonus;
    this.value = value;
  }
}
