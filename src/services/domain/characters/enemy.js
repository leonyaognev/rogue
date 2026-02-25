import { TileType, TypesLogs } from '../../../constants.js';
import logger from '../../logger.js';
import { createItemWithMultiplier, treasure } from '../item.js';
import EnemyPathFinder from '../utils/aStar/finders/enemyPathFinder.js';
import Character from './character.js';

// попопытка повторить protected из нормальных языков, для более комфортной реализации наследников
export const EnemyprotectedMethods = Object.freeze({
  playerTarget: Symbol('protected'),
  playerIsNotNear: Symbol('protected'),
  nextStep: Symbol('protected'),
  isInstance: Symbol('protected'),
  getNewTarget: Symbol('protected'),
});

export class Enemy extends Character {
  constructor(name, maxHp, agility, strength, coords, hostility, level) {
    const levelFactor = level.number;
    super(
      name,
      maxHp * levelFactor,
      agility * levelFactor,
      strength * levelFactor,
      coords,
    );
    this.hostility = hostility * levelFactor;
    this.level = level;
    this.path = [];
    this.angry = false;

    this.finder = new EnemyPathFinder(this.level.map);
    logger.log(
      `Enemy "${name}" spawned. HP: ${Math.floor(maxHp)}, Agility: ${Math.floor(agility)}, Strength: ${Math.floor(strength)}`,
      TypesLogs.INFO,
    );
  }

  /**
   * это метод обозночающий архитекутуру для потомков,
   * "виртуальный метод" он не должен нести в себе логики
   */
  movePattern(player) {}

  serialize() {
    return {
      type: this.constructor.name,
      name: this.name,
      hp: this.hp,
      maxHP: this.maxHP,
      agility: this.agility,
      strength: this.strength,
      coords: this.coords,
      hostility: this.hostility,
      angry: this.angry,
    };
  }

  isDead() {
    if (super.isDead()) {
      const tmpItem = createItemWithMultiplier(
        treasure[Math.floor(Math.random() * (treasure.length - 1))],
        this.level.number,
      );
      logger.log(
        `Item from ${this.name} cost: ${tmpItem.cost} `,
        TypesLogs.INFO,
      );
      tmpItem.coords = this.coords;
      this.level.items.push(tmpItem);
      return true;
    }

    return false;
  }

  [EnemyprotectedMethods.getNewTarget]() {
    const targets = [];

    let room = this.getCurrentRoom(this.level);
    if (!room) {
      room = {
        x: this.coords.x, y: this.coords.y, width: 10, height: 10,
      };
    }

    for (let { y } = room; y < room.y + room.height; y++) {
      for (let { x } = room; x < room.x + room.width; x++) {
        if (this[EnemyprotectedMethods.isInstance](x, y)) targets.push({ x, y });
      }
    }

    return targets[Math.floor(Math.random() * targets.length)];
  }

  [EnemyprotectedMethods.isInstance](x, y) {
    return (
      x >= 0
      && y >= 0
      && y < this.level.map.length
      && x < this.level.map[0].length
      && this.level.map[y][x] === TileType.FLOOR
    );
  }

  [EnemyprotectedMethods.playerTarget](player) {
    this.path = this.finder.find(this.coords, player.coords).splice(1);
    this.angry = true;
  }

  [EnemyprotectedMethods.playerIsNotNear](player) {
    const dx = Math.abs(this.coords.x - player.coords.x);
    const dy = Math.abs(this.coords.y - player.coords.y);
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance > this.hostility;
  }

  [EnemyprotectedMethods.nextStep](player) {
    if (this.path && this.path.length > 0) {
      const nextStep = this.path.shift();
      for (const enemy of this.level.enemies.filter((cur) => cur !== this)) {
        if (enemy.coords.x === nextStep.x && enemy.coords.y === nextStep.y) {
          return;
        }
      }
      if (nextStep.x === player.coords.x && nextStep.y === player.coords.y) this.attack(player);
      else this.move(nextStep);
    }
  }
}
