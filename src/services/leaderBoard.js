export default class LeaderBoard {
  constructor(board = []) {
    this.board = board.sort((a, b) => b.score - a.score);
  }

  addScore(statistics) {
    this.board.push(statistics);
    this.board.sort((a, b) => b.treasures - a.treasures);
  }

  serialize() {
    return { board: [...this.board] };
  }
}
