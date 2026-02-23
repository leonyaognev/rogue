export class Corridor {
  constructor(path) {
    this.path = path;
  }

  serialize() {
    return {
      path: structuredClone(this.path),
    };
  }
}
