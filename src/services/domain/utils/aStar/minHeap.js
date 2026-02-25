export class MinHeap {
  #items;

  #itemsMap;

  constructor() {
    this.#items = [];
    this.#itemsMap = new Map();
  }

  push(node) {
    this.#items.push(node);
    this.#itemsMap.set(node, this.#items.length - 1);
    this.#bubbleUp(this.#items.length - 1);
  }

  pop() {
    const top = this.#items[0];
    const end = this.#items.pop();

    this.#itemsMap.delete(top);

    if (this.#items.length > 0) {
      this.#items[0] = end;
      this.#itemsMap.set(end, 0);
      this.#bubbleDown(0);
    }
    return top;
  }

  update(node) {
    const index = this.#itemsMap.get(node);
    if (index === undefined) return;

    this.#bubbleUp(index);
    this.#bubbleDown(index);
  }

  get length() {
    return this.#items.length;
  }

  #swap(i, j) {
    [this.#items[i], this.#items[j]] = [this.#items[j], this.#items[i]];

    this.#itemsMap.set(this.#items[i], i);
    this.#itemsMap.set(this.#items[j], j);
  }

  #compare(i, j) {
    return this.#items[i].f < this.#items[j].f;
  }

  #bubbleUp(index) {
    let idx = index;

    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (!this.#compare(idx, parentIdx)) break;
      this.#swap(idx, parentIdx);
      idx = parentIdx;
    }
  }

  #bubbleDown(index) {
    let idx = index;

    while (true) {
      const leftIdx = idx * 2 + 1;
      const rightIdx = idx * 2 + 2;

      let swapIdx = null;

      if (leftIdx < this.#items.length && this.#compare(leftIdx, idx)) {
        swapIdx = leftIdx;
      }
      if (
        rightIdx < this.#items.length
        && this.#compare(rightIdx, swapIdx === null ? idx : swapIdx)
      ) {
        swapIdx = rightIdx;
      }
      if (swapIdx === null) break;

      this.#swap(idx, swapIdx);

      idx = swapIdx;
    }
  }
}
