import { ItemType, PlayerConfig, TypesLogs } from '../../../constants.js';
import logger from '../../logger.js';
import Inventory from '../inventory.js';
import Character from './character.js';

export default class Player extends Character {
  constructor(...args) {
    super(...args);
    this.inventory = new Inventory(PlayerConfig.MAX_ITEMS);
    this.treasures = 0;
    logger.log(
      `Player "${this.name}" created. HP: ${this.hp}, Agility: ${this.agility}, Strength: ${this.strength}`,
      TypesLogs.INFO,
    );
  }

  serialize() {
    return {
      name: this.name,
      hp: this.hp,
      maxHP: this.maxHP,
      agility: this.agility,
      strength: this.strength,
      coords: this.coords,
      weapon: this.weapon,
      inventory: this.inventory.serialize(),
      treasures: this.treasures,
    };
  }

  static deserialize(data) {
    const player = new Player();
    Object.assign(player, data);
    logger.log(`player loaded data: ${JSON.stringify(data)} `, TypesLogs.WARN);
    logger.log(
      `player hp after load: ${player.hp}/${player.maxHP}`,
      TypesLogs.WARN,
    );
    if (data.inventory) {
      player.inventory = Inventory.deserialize(data.inventory);
    }
    return player;
  }

  useItem(item) {
    switch (item.type) {
      case ItemType.FOOD: {
        this.hp = Math.min(
          this.hp + this.inventory.remove(item).hpBonus,
          this.maxHP,
        );
        logger.log(
          `Player ate ${item.subType}. HP restored to ${Math.floor(this.hp)}/${this.maxHP}`,
          TypesLogs.MESSAGE,
        );
        break;
      }
      case ItemType.POTION: {
        this.potions.push(this.inventory.remove(item));
        logger.log(`Player drunk potion: ${item.subType}`, TypesLogs.MESSAGE);
        break;
      }
      case ItemType.WEAPON: {
        if (item === this.weapon) {
          this.inventory.remove(item);
          this.weapon = null;
        } else {
          this.weapon = item;
        }
        logger.log(
          `Player equipped weapon: ${item.subType}`,
          TypesLogs.MESSAGE,
        );
        break;
      }
      case ItemType.SCROLL: {
        const curItem = this.inventory.remove(item);
        this.agility += curItem.agilityBonus;
        this.strength += curItem.strengthBonus;
        logger.log(
          `Player read scroll: ${item.subType}. Agility: ${this.agility}, Strength: ${this.strength}`,
          TypesLogs.MESSAGE,
        );
        break;
      }
      default:
        logger.log('unknown tile type', TypesLogs.ERROR);
    }
  }

  pickItem(item) {
    if (item.type === ItemType.TREASURE) {
      this.treasures += item.cost;
      logger.log(`item cost: ${item.cost}`, TypesLogs.MESSAGE);
      return true;
    }

    const result = this.inventory.add(item);
    if (result) {
      logger.log(`Item picked up: ${item.subType}`, TypesLogs.MESSAGE);
    } else {
      logger.log(
        `Inventory full! Could not pick up: ${item.subType}`,
        TypesLogs.WARN,
      );
    }
    return result;
  }
}
