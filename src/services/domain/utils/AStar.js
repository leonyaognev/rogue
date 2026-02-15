class Node {
  constructor(x, y, g, h, f, parent) {
    this.x = x;
    this.y = y;
    this.g = g;
    this.h = h;
    this.f = f;
    this.parent = parent;
  }
}

export function aStar(grid, start, end) {
  const openSet = [];
  const closedSet = new Set();

  const rows = grid.length;
  const cols = grid[0].length;

  function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  openSet.push(
    new Node(
      start.x,
      start.y,
      0,
      heuristic(start, end),
      heuristic(start, end),
      null
    )
  );

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();

    if (current.x === end.x && current.y === end.y) {
      const path = [];
      let node = current;

      while (node) {
        path.push({ x: node.x, y: node.y });
        node = node.parent;
      }
      return path.reverse();
    }

    closedSet.add(`${current.x}, ${current.y}`);

    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.x < 0 ||
        neighbor.y < 0 ||
        neighbor.x >= cols ||
        neighbor.y >= rows
      )
        continue;

      if (grid[neighbor.y][neighbor.x] === 3) continue;

      if (closedSet.has(`${neighbor.x}, ${neighbor.y}`)) continue;

      const gScore = current.g + grid[neighbor.y][neighbor.x] === 2 ? 1 : 10;
      const hScore = heuristic(neighbor, end);
      const fScore = gScore + hScore;

      const exists = openSet.find(
        (n) => n.x === neighbor.x && n.y === neighbor.y
      );

      if (!exists) {
        openSet.push(
          new Node(neighbor.x, neighbor.y, gScore, hScore, fScore, current)
        );
      } else if (gScore < exists.g) {
        exists.g = gScore;
        exists.h = hScore;
        exists.f = fScore;
        exists.parent = current;
      }
    }
  }

  return null;
}
