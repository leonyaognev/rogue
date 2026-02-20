import { Enemy, EnemyprotectedMethods } from "../enemy.js";

export class Snake extends Enemy {
  constructor(name, maxHp, agility, strength, cords, hostility, level) {
    super(name, maxHp, agility, strength, cords, hostility, level);
    this.sleepChance = 0.3;
    this.diagonalDirectionVertical = 1;
    this.diagonalDirectionHorizantal = 1;
    this.turnCounter = 0;
  }

  movePattern(player) {
    this.turnCounter++;

    if (this[EnemyprotectedMethods.playerIsNotNear](player)) {
      this.#randomDiagonalMove();
      this.angry = false;
    } else {
      this[EnemyprotectedMethods.playerTarget](player);
      this.angry = true;
    }

    this[EnemyprotectedMethods.nextStep]();
  }

  #randomDiagonalMove() {
    if (this.path && this.path.length > 0) return;

    const maxX = this.mapWidth - 1;
    const maxY = this.mapHeight - 1;

    const x = this.cords.x;
    const y = this.cords.y;
    let dx = this.diagonalDirectionHorizantal;
    let dy = this.diagonalDirectionVertical;

    const Path = [];

    let nextX = x + dx;
    let nextY = y + dy;

    if (
      nextX < 0 ||
      nextX > maxX ||
      !this[EnemyprotectedMethods.isInstance](nextX, y)
    ) {
      dx *= -1;
      nextX = x + dx;
    }
    if (
      nextY < 0 ||
      nextY > maxY ||
      !this[EnemyprotectedMethods.isInstance](x, nextY)
    ) {
      dy *= -1;
      nextY = y + dy;
    }

    Path.push({ x: nextX, y: nextY });

    this.diagonalDirectionHorizantal = dx;
    this.diagonalDirectionVertical = dy;
    this.path = Path;
  }

  attack(target) {
    const result = super.attack(target);

    if (!result && Math.random() < this.sleepChance) {
      target.sleep(1);
    }

    return result;
  }
}
