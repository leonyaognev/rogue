import { TileType, TypesLogs } from '../../../constants.js';
import logger from '../../logger.js';
import { getKey } from './utils.js';

// FIXME no used imports logger & TypesLogs

export default class FogOfWar {
  constructor() {
    this.cellsMap = new Map();
    this.playerVisetedRooms = new Set();

    this.width = 0;
    this.height = 0;

    this.visibleNow = null;
    this.discovered = null;

    this.lastPlayerX = -1;
    this.lastPlayerY = -1;
    this.lastRoom = null;
  }

  clear() {
    this.playerVisetedRooms.clear();
    this.cellsMap.clear();
  }

  update(player, level) {
    if (
      player.cords.x === this.lastPlayerX
      && player.cords.y === this.lastPlayerY
    ) return;

    const room = player.getCurrentRoom(level);

    if (room && room !== this.lastRoom) {
      this.cellsMap.clear();

      this.playerVisetedRooms.add(room);
      this.setRoomAsVisible(room);
    } else if (!room) {
      this.cellsMap.clear();

      this.#rayCasting(player, level.map, 2);
    }
    this.lastRoom = room;

    this.playerVisetedRooms.forEach((room) => { // FIXME room is declared upper
      this.setWallsAsVisible(room);
    });
  }

  #rayCasting(player, map, ang = 1) {
    const px = player.cords.x;
    const py = player.cords.y;
    const mapHeight = map.length;
    const mapWidth = map[0].length;
    const RAD_CONV = Math.PI / 180;

    for (let angle = 0; angle < 360; angle += ang) {
      const rad = angle * RAD_CONV;
      const dx = Math.cos(rad) * 0.3;
      const dy = Math.sin(rad) * 0.3;

      let x = px;
      let y = py;

      while (true) {
        const tileX = Math.round(x);
        const tileY = Math.round(y);

        if (tileY < 0 || tileY >= mapHeight || tileX < 0 || tileX >= mapWidth) {
          break;
        }

        this.cellsMap.set(getKey(tileX, tileY), true);

        const currentTile = map[tileY][tileX];
        if (currentTile === TileType.WALL || currentTile === TileType.EMPTY) {
          break;
        }

        x += dx;
        y += dy;

        const distSq = (x - px) * (x - px) + (y - py) * (y - py);
        if (distSq > 90000) break;
      }
    }
  }

  setWallsAsVisible(room) {
    const endY = room.y + room.height;
    const endX = room.x + room.width;

    for (let j = room.y - 1; j <= endY; j += 1) {
      for (let i = room.x - 1; i <= endX; i += 1) {
        if (i === room.x - 1 || i === endX || j === room.y - 1 || j === endY) {
          this.cellsMap.set(getKey(i, j), true);
        }
      }
    }
  }

  setRoomAsVisible(room) {
    const endY = room.y + room.height - 1;
    const endX = room.x + room.width - 1;

    for (let j = room.y; j <= endY; j += 1) {
      for (let i = room.x; i <= endX; i += 1) {
        this.cellsMap.set(getKey(i, j), true);
      }
    }
  }

  setRoomAsInvisible(room) {
    const endY = room.y + room.height - 1;
    const endX = room.x + room.width - 1;

    for (let j = room.y; j <= endY; j += 1) {
      for (let i = room.x; i <= endX; i += 1) {
        this.cellsMap.set(getKey(i, j), false);
      }
    }
  }
}
