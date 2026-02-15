export const TileType = Object.freeze({
  EMPTY: 0,
  FLOOR: 1,
  WALL: 2,
  CORRIDOR: 3,
});

export const PathCost = Object.freeze({
  EMPTY: 1,
  FLOOR: 1,
  WALL: 10,
  CORRIDOR: 10,
});

export const LevelConfig = Object.freeze({
  GRID_DIVISIONS: 3,
  MIN_ROOM_SIZE: 3,
  DEFAULT_WIDTH: 80,
  DEFAULT_HEIGHT: 24,
});
