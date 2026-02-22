class LogBuf {
  #queue;

  constructor() {
    this.#queue = [];
  }

  log(message, type) {
    this.#queue.push({ message, type });
  }

  getMessage() {
    return this.#queue.shift();
  }
}

export const logger = new LogBuf();
