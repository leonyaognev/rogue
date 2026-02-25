import { TypesLogs } from '../constants.js';

const currentLevel = TypesLogs.MESSAGE;

class LogBuf {
  #queue;

  constructor() {
    this.#queue = [];
  }

  log(message, type) {
    if (type <= currentLevel) {
      this.#queue.push({ message, type });
    }
  }

  getMessage() {
    return this.#queue.shift();
  }
}

export default new LogBuf();
