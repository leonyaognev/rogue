import blessed from 'blessed';
import { TypesLogs } from '../../../constants.js';
import { logger as globalLogger } from '../../logger.js';

export class Logger {
  static #colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];

  constructor(screen, options = {}) {
    this.logBox = blessed.log({
      parent: screen,
      right: 0,
      bottom: 0, // Прижимаем вниз
      width: options.width || '30%',
      height: options.height || '50%',
      border: 'line',
      label: ' Console ',
      tags: true,
      scrollable: true,
      keys: true,
      alwaysScroll: true,
      scrollbar: { ch: ' ', inverse: true },
    });
    this.color = 0;
  }

  displayMessages() {
    let mes = globalLogger.getMessage();
    while (mes) {
      switch (mes.type) {
        case TypesLogs.MESSAGE:
          this.logBox.log(`{${Logger.#colors[this.color]}-fg}${mes.message}`);
          this.color = (this.color + 1) % Logger.#colors.length;
          break;
        case TypesLogs.INFO:
          this.logBox.log(`{green-fg}[INFO] ${mes.message}`);
          break;
        case TypesLogs.WARN:
          this.logBox.log(`{yellow-fg}[WARN] ${mes.message}`);
          break;
        case TypesLogs.ERROR:
          this.logBox.log(`{red-fg}[ERROR] ${mes.message}`);
          break;
      }
      mes = globalLogger.getMessage();
    }
  }
}
