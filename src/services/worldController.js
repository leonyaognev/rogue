import { TileType } from "../constants.js";

export class WorldController {
  constructor(level, player) {
    this.level = level;
    this.player = player;
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

    if (targetTile === TileType.FLOOR || targetTile === TileType.CORRIDOR) {
      if (enemyAtTarget) {
        this.player.attack(enemyAtTarget);
        if (enemyAtTarget.isDead()) {
          this.level.removeEnemy(enemyAtTarget);
        }
      } else {
        this.player.move({ x: newX, y: newY });
      }
    }
  }

  moveEnemies() {
    for (const enemy of this.level.enemies) {
      enemy.movePattern(this.player);
    }
  }
}
