export default class Node {
  constructor(x, y, g, h, f, parent) {
    this.x = x;
    this.y = y;
    this.g = g;
    this.h = h;
    this.f = f;
    this.parent = parent;
  }
}
