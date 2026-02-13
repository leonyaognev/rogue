export class SaveManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  saveSession(player, level) {
    /* JSON.stringify и fs.writeFile */
  }

  loadSession() {
    /* прочитать JSON и восстановить Player + Level */
  }

  saveLeaderboard(stats) {
    /* статистика всех игр */
  }

  loadLeaderboard() {
    /* JSON.parse */
  }
}
