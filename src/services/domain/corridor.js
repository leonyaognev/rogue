export default class Corridor {
  constructor(path) {
    this.path = path;
  }

  serialize() {
    return {
      path: structuredClone(this.path),
    };
  }

  static deserialize(data) {
    return new Corridor(data.path);
  }
}
