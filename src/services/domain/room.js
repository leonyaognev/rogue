export class Room {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.connextedRooms = [];
    this.center = {
      x: Math.floor(x + width / 2),
      y: Math.floor(y + height / 2),
    };
  }

  distance(other) {
    const dx = this.center.x - other.center.x;
    const dy = this.center.y - other.center.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  isAccessible(x, y) {
    /* проверка координат */
  }
}
