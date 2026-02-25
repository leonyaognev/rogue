import fs from 'node:fs/promises';

import { TypesLogs } from '../../constants.js';
import { LeaderBoard } from '../leaderBoard.js';
import { logger } from '../logger.js';

export class SaveManager {
  constructor(sassionSavePath, leaderBoardSavePath) {
    this.sassionSavePath = sassionSavePath;
    this.leaderBoardSavePath = leaderBoardSavePath;

    logger.log('SaveManager initialized', TypesLogs.INFO);
  }

  async saveSession(worldController, renderer) {
    logger.log('Saving session...', TypesLogs.INFO);

    const json = JSON.stringify({
      worldController: worldController.serialize(),
      renderer: renderer.serialize(),
    });

    await fs.writeFile(this.sassionSavePath, json);

    logger.log('Session saved!', TypesLogs.INFO);
  }

  async loadSession() {
    logger.log('Loading session...', TypesLogs.INFO);

    try {
      const content = await fs.readFile(this.sassionSavePath, 'utf-8');
      const data = JSON.parse(content);

      return data;
    } catch (err) {
      logger.log(`Failed to load session: ${err.message}`, TypesLogs.ERROR);
      return null;
    }
  }

  async saveLeaderBoard(board) {
    logger.log('Saving leader board...', TypesLogs.INFO);

    const json = JSON.stringify({
      leaderBoard: board.serialize(),
    });

    await fs.writeFile(this.leaderBoardSavePath, json);

    logger.log('leader board saved', TypesLogs.INFO);
  }

  async loadLeaderBoard() {
    logger.log('Loading leader board...', TypesLogs.INFO);

    try {
      const content = await fs.readFile(this.leaderBoardSavePath, 'utf-8');
      const data = JSON.parse(content);

      return data;
    } catch (err) {
      logger.log(`Failed to load session: ${err.message}`, TypesLogs.ERROR);
      return null;
    }
  }
}
