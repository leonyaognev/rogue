export class LeaderBoard {
  constructor(board = []) {
    this.board = board.sort((a, b) => {
      return b.score - a.score;
    });
  }

  addScore(playerName, score, levelNumber) {
    this.board.push({ score, levelNumber, playerName });
    this.board.sort((a, b) => {
      return b.score - a.score;
    });
  }

  serialize() {
    return { board: [...this.board] };
  }
}
