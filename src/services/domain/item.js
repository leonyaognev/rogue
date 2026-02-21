import { ItemType } from "../../constants";

class Item {
  constructor(
    type,
    subtype,
    hpBonus = 0,
    maxHpBonus = 0,
    agilityBonus = 0,
    strengthBonus = 0,
    value = 0,
    duration = 0
  ) {
    this.type = type; // принимает значение из ItemType
    this.subtype = subtype;
    this.hpBonus = hpBonus;
    this.maxHpBonus = maxHpBonus;
    this.agilityBonus = agilityBonus;
    this.strengthBonus = strengthBonus;
    this.value = value;
    this.duration = duration; // время действия для врменных бафов зелий
  }
}

export const items = [
  new Item(ItemType.TREASURE, "gold_pouch", 0, 0, 0, 0, 50),
  new Item(ItemType.TREASURE, "jeweled_goblet", 0, 0, 0, 0, 120),
  new Item(ItemType.TREASURE, "ancient_crown", 0, 0, 0, 0, 300),
  new Item(ItemType.TREASURE, "silver_chest", 0, 0, 0, 0, 200),
  new Item(ItemType.TREASURE, "gemstone_bundle", 0, 0, 0, 0, 80),

  new Item(ItemType.FOOD, "stale_bread", 10),
  new Item(ItemType.FOOD, "roasted_meat", 25),
  new Item(ItemType.FOOD, "red_apple", 15),
  new Item(ItemType.FOOD, "cheese_wheel", 20),
  new Item(ItemType.FOOD, "mysterious_stew", 40),

  new Item(ItemType.POTION, "strength_potion", 0, 0, 0, 5, 0, 20),
  new Item(ItemType.POTION, "agility_potion", 0, 0, 5, 0, 20),
  new Item(ItemType.POTION, "vitality_potion", 0, 20, 0, 0, 1),
  new Item(ItemType.POTION, "berserker_potion", 0, 0, 0, 10, 10),

  new Item(ItemType.SCROLL, "scroll_of_strength", 0, 0, 0, 2),
  new Item(ItemType.SCROLL, "scroll_of_agility", 0, 0, 2, 0),
  new Item(ItemType.SCROLL, "scroll_of_vitality", 0, 10, 0, 0),
  new Item(ItemType.SCROLL, "scroll_of_giant", 0, 0, 0, 4),

  new Item(ItemType.WEAPON, "rusty_sword", 0, 0, 0, 3),
  new Item(ItemType.WEAPON, "battle_axe", 0, 0, 0, 6),
  new Item(ItemType.WEAPON, "assassin_dagger", 0, 0, 2, 4),
  new Item(ItemType.WEAPON, "war_hammer", 0, 5, 0, 8),
];
