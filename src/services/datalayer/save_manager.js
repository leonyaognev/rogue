import { TypesLogs } from "../../constants.js";
import { logger } from "../logger.js";

export class SaveManager {
  constructor(filePath) {
    this.filePath = filePath;
    logger.log("SaveManager initialized", TypesLogs.INFO);
  }

  saveSession(player, level) {
    logger.log("Saving session...", TypesLogs.INFO);
    /* JSON.stringify и fs.writeFile */
  }

  loadSession() {
    logger.log("Loading session...", TypesLogs.INFO);
    /* прочитать JSON и восстановить Player + Level */
  }

  saveLeaderboard(stats) {
    logger.log("Saving leaderboard...", TypesLogs.INFO);
    /* статистика всех игр */
  }

  loadLeaderboard() {
    logger.log("Loading leaderboard...", TypesLogs.INFO);
    /* JSON.parse */
  }
}
