import { TileType, TypesLogs } from "../../../constants.js";
import { logger } from "../../logger.js";
import { createItemWithMultiplier, treasure } from "../item.js";
import { enemyPathFinder } from "../utils/aStar/finders/enemyPathFinder.js";
import { Character } from "./character.js";

export const EnemyprotectedMethods = Object.freeze({
  playerTarget: Symbol("protected"),
  playerIsNotNear: Symbol("protected"),
  nextStep: Symbol("protected"),
  isInstance: Symbol("protected"),
  getNewTarget: Symbol("protected"),
});

export class Enemy extends Character {
  constructor(name, maxHp, agility, strength, cords, hostility, level) {
    const levelFactor = level.number;
    super(
      name,
      maxHp * levelFactor,
      agility * levelFactor,
      strength * levelFactor,
      cords
    );
    this.hostility = hostility * levelFactor;
    this.level = level;
    this.path = [];
    this.angry = false;

    this.finder = new enemyPathFinder(this.level.map);
    logger.log(
      `Enemy "${name}" spawned. HP: ${Math.floor(maxHp)}, Agility: ${Math.floor(agility)}, Strength: ${Math.floor(strength)}`,
      TypesLogs.INFO
    );
  }

  movePattern(player) {}

  serialize() {
    return {
      _type: this.constructor.name,
      name: this.name,
      maxhp: this.maxhp,
      agility: this.agility,
      strength: this.strength,
      cords: this.cords,
      hostility: this.hostility,
      angry: this.angry,
    };
  }

  static deserialize(data, level) {
    const Cls = enemyClasses[data.__type] || Enemy;
    const enemy = new Cls();
    Object.assign(enemy, data);
    enemy.level = level;
    return enemy;
  }

  isDead() {
    if (super.isDead()) {
      const tmpItem = createItemWithMultiplier(
        treasure[Math.floor(Math.random() * (treasure.length - 1))],
        this.level.number
      );
      logger.log(
        `Item from ${this.name} cost: ${tmpItem.cost} `,
        TypesLogs.INFO
      );
      tmpItem.cords = this.cords;
      this.level.items.push(tmpItem);
      return true;
    }

    return false;
  }

  [EnemyprotectedMethods.getNewTarget]() {
    const targets = [];

    let room = this.getCurrentRoom(this.level);
    if (!room) {
      room = { x: this.cords.x, y: this.cords.y, width: 10, height: 10 };
    }

    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        if (this[EnemyprotectedMethods.isInstance](x, y))
          targets.push({ x, y });
      }
    }

    return targets[Math.floor(Math.random() * targets.length)];
  }

  [EnemyprotectedMethods.isInstance](x, y) {
    return (
      x >= 0 &&
      y >= 0 &&
      y < this.level.map.length &&
      x < this.level.map[0].length &&
      this.level.map[y][x] === TileType.FLOOR
    );
  }

  [EnemyprotectedMethods.playerTarget](player) {
    this.path = this.finder.find(this.cords, player.cords).splice(1);
    this.angry = true;
  }

  [EnemyprotectedMethods.playerIsNotNear](player) {
    const dx = Math.abs(this.cords.x - player.cords.x);
    const dy = Math.abs(this.cords.y - player.cords.y);
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance > this.hostility;
  }

  [EnemyprotectedMethods.nextStep](player) {
    if (this.path && this.path.length > 0) {
      const nextStep = this.path.shift();
      for (const enemy of this.level.enemies.filter((cur) => cur !== this)) {
        if (enemy.cords.x === nextStep.x && enemy.cords.y === nextStep.y) {
          return;
        }
      }
      if (nextStep.x === player.cords.x && nextStep.y === player.cords.y)
        this.attack(player);
      else this.move(nextStep);
    }
  }
}
