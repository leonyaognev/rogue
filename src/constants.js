export const TileType = Object.freeze({
  EMPTY: 0,
  FLOOR: 1,
  WALL: 2,
  CORRIDOR: 3,
});

export const TileChar = Object.freeze({
  EMPTY: ' ',
  FLOOR: '.',
  WALL: '#',
  CORRIDOR: '.',
  PLAYER: '@',
  END_ROOM: '0',
});

export const PathCost = Object.freeze({
  EMPTY: 1,
  FLOOR: 1,
  WALL: 10,
  CORRIDOR: 5,
  NEAR_CORRIDOR: 5,
  ROTATE: 1,
});

export const CombatConfig = Object.freeze({
  hit: {
    baseChance: 0.6,
    agilityFactor: 0.05,
    minChance: 0.1,
    maxChance: 0.95,
  },
  damage: {
    variance: 3,
  },
});

export const PlayerConfig = Object.freeze({
  DEFAULT_HP: 100,
  DEFAULT_AGILITY: 20,
  DEFAULT_STRENGTH: 20,
  MAX_ITEMS: 9,
});

export const GameConfig = Object.freeze({
  MAX_LEVEL: 21,
  EXIT_CODE: 0,
});

export const ItemType = Object.freeze({
  FOOD: 'food',
  POTION: 'potion',
  SCROLL: 'scroll',
  WEAPON: 'weapon',
  TREASURE: 'treasure',
});

export const LevelConfig = Object.freeze({
  GRID_DIVISIONS: 3,
  MIN_ROOM_SIZE: 3,
  DEFAULT_WIDTH: 80,
  DEFAULT_HEIGHT: 24,
  ROOM_OFFSET: 2,
});

export const DefaultEnemy = Object.freeze({
  maxHp: 100,
  agility: 10,
  strength: 10,
  hostility: 3,
});

export const TypesLogs = Object.freeze({
  INFO: 3,
  WARN: 2,
  ERROR: 1,
  MESSAGE: 0,
});

export const SaveFiles = Object.freeze({
  SESSION_SAVE: '.sessionSave.json',
  LEADER_BOAR_SAVE: '.leaderBoardSave.json',
});

export const DefaultKeys = Object.freeze({
  up: ['k'],
  down: ['j'],
  left: ['h'],
  right: ['l'],
  weapon: ['w'],
  potion: ['r'],
  food: ['f'],
  scroll: ['s'],
  exit: ['q'],
  leaderBoard: ['b'],
});
