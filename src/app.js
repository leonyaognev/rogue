import { SaveManager } from "./services/datalayer/save_manager.js";
import { Renderer2D } from "./services/presentation/2d/renderer.js";

export class App {
  constructor() {
    this.renderer = new Renderer2D();
    this.saveManager = new SaveManager();
  }
}
