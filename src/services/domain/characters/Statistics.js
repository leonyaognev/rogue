export default class Statistics {
  constructor(playerName) {
    this.playerName = playerName;
    this.level = 0;
    this.treasures = 0;
    this.defeatedEnemies = 0;
    this.eatenFood = 0;
    this.drunkPotions = 0;
    this.readScrolls = 0;
    this.hits = 0;
    this.missed = 0;
    this.passedCells = 0;
  }

  serialize() {
    return {
      playerName: this.playerName,
      level: this.level,
      treasures: this.treasures,
      defeatedEnemies: this.defeatedEnemies,
      eatenFood: this.eatenFood,
      drunkPotions: this.drunkPotions,
      readScrolls: this.readScrolls,
      hits: this.hits,
      missed: this.missed,
      passedCells: this.passedCells,
    };
  }

  static deserialize(data) {
    const stat = new Statistics();
    Object.assign(stat, data);
    return stat;
  }
}
