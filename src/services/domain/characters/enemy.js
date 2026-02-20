import { TileType } from "../../../constants.js";
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
    super(name, maxHp, agility, strength, cords);
    this.hostility = hostility;
    this.level = level;
    this.path = [];
    this.angry = false;

    this.finder = new enemyPathFinder(this.level.map);
  }

  movePattern(player) {}

  getCurrentRoom() {
    return this.level.rooms.find(
      (room) =>
        this.cords.x >= room.x &&
        this.cords.x < room.x + room.width &&
        this.cords.y >= room.y &&
        this.cords.y < room.y + room.height
    );
  }

  [EnemyprotectedMethods.getNewTarget]() {
    const targets = [];

    const room = this.getCurrentRoom();

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
    if (this.path.length < 1 || this.angry === false) {
      this.path = this.finder.find(this.cords, player.cords).splice(1);
    }
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
      if (nextStep.x === player.cords.x && nextStep.y === player.cords.y)
        this.attack(player);
      else this.move(nextStep);
    }
  }
}
