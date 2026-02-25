import { App } from './app.js';
import { Game } from './game.js';
import { showStartMenu } from './services/presentation/startMenu.js';

async function main() {
  const app = new App();

  const choice = await showStartMenu(app.screen);

  if (choice === 'load') {
    await app.loadFromLastSave();
  } else {
    app.startNewGame();
  }

  const game = new Game(app);
  game.run();
}

main();
