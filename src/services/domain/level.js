export class Level {
  constructor(index) {
    this.index = index;
    this.rooms = [];
    this.corridors = [];
    this.startRoom = null;
    this.exitRoom = null;
  }

  generate() {
    /* сгенерировать комнаты и коридоры */
  }

  populateMonsters() {
    /* добавить монстров */
  }

  populateItems() {
    /* добавить предметы */
  }
}
