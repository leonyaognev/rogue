import fs from "node:fs/promises";

import { TypesLogs } from "../../constants.js";
import { logger } from "../logger.js";

export class SaveManager {
  constructor(filePath) {
    this.filePath = filePath;
    logger.log("SaveManager initialized", TypesLogs.INFO);
  }

  async saveSession(worldController, renderer) {
    logger.log("Saving session...", TypesLogs.INFO);

    const json = JSON.stringify({
      worldController: worldController.serialize(),
      renderer: renderer.serialize(),
    });

    await fs.writeFile(this.filePath, json);

    logger.log("Session saved!", TypesLogs.INFO);
  }

  async loadSession() {
    logger.log("Loading session...", TypesLogs.INFO);

    try {
      const content = await fs.readFile(this.filePath, "utf-8");
      const data = JSON.parse(content);

      return data;
    } catch (err) {
      logger.log(`Failed to load session: ${err.message}`, TypesLogs.ERROR);
      return null;
    }
  }

  saveLeaderBoard(stats) {
    stats;
    logger.log("Saving leader board...", TypesLogs.INFO);
  }

  loadLeaderBoard() {
    logger.log("Loading leader board...", TypesLogs.INFO);
  }
}
