import { TileType, TypesLogs } from "../constants.js";
import { logger } from "./logger.js";

export class WorldController {
  constructor(level, player) {
    this.level = level;
    this.player = player;
    logger.log("WorldController initialized", TypesLogs.INFO);
  }

  isPlayerDead() {
    return this.player.isDead();
  }

  isEndLevel() {
    return (
      this.player.cords.x === this.level.endRoom.center.x &&
      this.player.cords.y === this.level.endRoom.center.y
    );
  }

  movePlayer(moveX, moveY) {
    const newX = this.player.cords.x + moveX;
    const newY = this.player.cords.y + moveY;

    const targetTile = this.level.map[newY][newX];
    const enemyAtTarget = this.level.getEnemyAt(newX, newY);
    const itemAtTarget = this.level.getItemAt(newX, newY);

    if (targetTile === TileType.FLOOR || targetTile === TileType.CORRIDOR) {
      if (enemyAtTarget) {
        this.player.attack(enemyAtTarget);
        logger.log(`Player attacks ${enemyAtTarget.name}`, TypesLogs.INFO);
        if (enemyAtTarget.isDead()) {
          this.level.removeEnemy(enemyAtTarget);
          logger.log(`${enemyAtTarget.name} defeated!`, TypesLogs.INFO);
        }
      } else {
        this.player.move({ x: newX, y: newY });
        if (itemAtTarget) {
          if (this.player.pickItem(itemAtTarget.item)) {
            logger.log(
              `Player picked up: ${itemAtTarget.item.subType}`,
              TypesLogs.INFO
            );
            this.level.removeItem(itemAtTarget);
          } else {
            logger.log(
              `Player don\`t picked up: ${itemAtTarget.item.subType}, inventory full!`,
              TypesLogs.MESSAGE
            );
          }
        }
      }
    }
  }

  moveEnemies() {
    for (const enemy of this.level.enemies) {
      enemy.movePattern(this.player);
    }
  }
}
