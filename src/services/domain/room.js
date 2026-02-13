export class Room {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.monsters = [];
    this.items = [];
    this.connections = []; // коридоры к другим комнатам
  }

  isAccessible(x, y) {
    /* проверка координат */
  }
}
