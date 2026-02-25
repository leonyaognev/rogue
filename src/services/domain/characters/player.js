import { ItemType, PlayerConfig, TypesLogs } from '../../../constants.js';
import logger from '../../logger.js';
import Inventory from '../inventory.js';
import Character from './character.js';
import Statistics from './Statistics.js';

export default class Player extends Character {
  constructor(...args) {
    super(...args);
    this.inventory = new Inventory(PlayerConfig.MAX_ITEMS);
    this.treasures = 0;

    this.statistics = new Statistics(this.name);

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
      statistics: this.statistics.serialize(),
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
    player.statistics = Statistics.deserialize(data.statistics);
    logger.log(`loaded statistics: ${JSON.stringify(player.statistics)}`, TypesLogs.INFO);
    return player;
  }

  useItem(item) {
    switch (item.type) {
      case ItemType.FOOD: {
        this.hp = Math.min(
          this.hp + this.inventory.remove(item).hpBonus,
          this.maxHP,
        );
        this.statistics.eatenFood++;
        logger.log(
          `Player ate ${item.subType}. HP restored to ${Math.floor(this.hp)}/${this.maxHP}`,
          TypesLogs.MESSAGE,
        );
        break;
      }
      case ItemType.POTION: {
        this.potions.push(this.inventory.remove(item));
        this.statistics.drunkPotions++;
        logger.log(`Player drunk potion: ${item.subType}`, TypesLogs.MESSAGE);
        break;
      }
      case ItemType.WEAPON: {
        if (item === this.weapon) {
          if (this.inventory.add(this.weapon)) {
            this.weapon = null;
            logger.log(
              `Player unequipped weapon: ${item.subType}`,
              TypesLogs.MESSAGE,
            );
          } else {
            logger.log(
              `Player can not unequipped weapon: ${item.subType}, inventory full!`,
              TypesLogs.MESSAGE,
            );
          }
        } else {
          let result = null;
          if (this.weapon) {
            result = this.weapon;
          }
          const weapon = this.inventory.remove(item);
          this.weapon = weapon;

          logger.log(
            `Player equipped weapon: ${item.subType}`,
            TypesLogs.MESSAGE,
          );
          return result;
        }
        break;
      }
      case ItemType.SCROLL: {
        const curItem = this.inventory.remove(item);
        this.agility += curItem.agilityBonus;
        this.strength += curItem.strengthBonus;
        this.maxHP += curItem.maxHpBonus;
        this.statistics.readScrolls++;
        logger.log(
          `Player read scroll: ${item.subType}. Agility: ${this.agility}, Strength: ${this.strength}`,
          TypesLogs.MESSAGE,
        );
        break;
      }
      default:
        logger.log('unknown item type', TypesLogs.ERROR);
    }

    return null;
  }

  pickItem(item) {
    if (item.type === ItemType.TREASURE) {
      this.treasures += item.cost;
      this.statistics.treasures += item.cost;
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

  move(coords) {
    this.statistics.passedCells++;
    return super.move(coords);
  }

  checkHit(target, agilityBuf) {
    if (super.checkHit(target, agilityBuf)) {
      this.statistics.hits++;
      return true;
    }
    this.statistics.missed++;
    return false;
  }

  levelRaised(level) {
    this.statistics.level = level;
  }

  killedEnemy() {
    this.statistics.defeatedEnemies++;
  }
}
