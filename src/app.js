import { PlayerConfig, SaveFiles, TypesLogs } from './constants.js';
import { SaveManager } from './services/datalayer/saveManager.js';
import { Player } from './services/domain/characters/player.js';
import { LeaderBoard } from './services/leaderBoard.js';
import { LevelManager } from './services/levelManager.js';
import { logger } from './services/logger.js';
import { Renderer2D } from './services/presentation/2d/renderer.js';
import { initScreen } from './services/presentation/initScreen.js';
import { WorldController } from './services/worldController.js';

export class App {
  constructor(screen) {
    this.saveManager = new SaveManager(
      SaveFiles.SESSION_SAVE,
      SaveFiles.LEADER_BOAR_SAVE,
    );

    this.saveManager.loadLeaderBoard().then((data) => {
      this.leaderBoard = new LeaderBoard(data?.leaderBoard?.board ?? []);
      logger.log(
        `leaderBoard: ${JSON.stringify(this.leaderBoard)}`,
        TypesLogs.INFO,
      );
    });

    this.screen = initScreen();
    logger.log('App initialized', TypesLogs.INFO);
  }

  save() {
    this.saveManager.saveSession(this.worldController, this.renderer);
  }

  async saveLeaderBoard() {
    this.leaderBoard.addScore(
      this.player.name,
      this.player.treasures,
      this.levelManager.currentLevel,
    );
    await this.saveManager.saveLeaderBoard(this.leaderBoard);
  }

  startNewGame() {
    this.renderer = new Renderer2D(this.screen);

    this.levelManager = new LevelManager(
      this.renderer.width * 2,
      this.renderer.height * 2,
      1,
    );

    this.player = new Player(
      'player',
      PlayerConfig.DEFAULT_HP,
      PlayerConfig.DEFAULT_AGILITY,
      PlayerConfig.DEFAULT_STRENGTH,
      this.levelManager.level.startRoom.center,
      this.levelManager.level,
    );

    this.worldController = new WorldController(
      this.levelManager.level,
      this.player,
    );
  }

  async loadFromLastSave() {
    const sessionData = await this.saveManager.loadSession();
    if (!sessionData) return;

    this.worldController = WorldController.deserialize(
      sessionData.worldController,
    );

    this.player = this.worldController.player;
    this.renderer = Renderer2D.deserialize(sessionData.renderer, this.screen);
    this.levelManager = new LevelManager(
      this.renderer.width * 2,
      this.renderer.height * 2,
      this.worldController.level.current,
      this.worldController.level,
    );
  }
}
