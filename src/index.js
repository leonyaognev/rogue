import { App } from "./app.js";
import { Game } from "./game.js";

const app = new App();
const game = new Game(app);

game.run();
