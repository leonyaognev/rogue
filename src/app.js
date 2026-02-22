import { TypesLogs } from "./constants.js";
import { SaveManager } from "./services/datalayer/save_manager.js";
import { logger } from "./services/logger.js";
import { Renderer2D } from "./services/presentation/2d/renderer.js";

export class App {
  constructor() {
    this.renderer = new Renderer2D();
    this.saveManager = new SaveManager();
    logger.log("App initialized", TypesLogs.INFO);
  }
}
