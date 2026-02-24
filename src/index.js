import { App } from "./app.js";
import { Game } from "./game.js";

async function main() {
  const app = new App();
  // await app.load();

  const game = new Game(app);
  game.run();
}

main();
