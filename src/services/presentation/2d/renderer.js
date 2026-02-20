import blessed from "blessed";
import { TileChar, TileType } from "../../../constants.js";

export class Renderer2D {
  constructor(screen) {
    this.screen = blessed.screen({
      smartCSR: true,
      title: "rogue demo",
    });

    this.width = process.stdout.columns;
    this.height = process.stdout.rows;

    this.box = blessed.box({
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    });

    this.screen.append(this.box);
  }

  refresh(level, entities, player, enemies) {
    let content = "";
    for (let y = 0; y < level.map.length; y++) {
      let line = "";
      for (let x = 0; x < level.map[0].length; x++) {
        let char = TileChar.EMPTY;
        const ch = level.map[y][x];
        switch (ch) {
          case TileType.EMPTY:
            char = TileChar.EMPTY;
            break;
          case TileType.FLOOR:
            char = TileChar.FLOOR;
            break;
          case TileType.WALL:
            char = TileChar.WALL;
            break;
          case TileType.CORRIDOR:
            char = TileChar.CORRIDOR;
            break;
        }

        if (level.endRoom.center.x === x && level.endRoom.center.y === y) {
          char = TileChar.END_ROOM;
        }
        for (const enemy of enemies) {
          if (enemy.cords.x === x && enemy.cords.y === y && enemy.visible) {
            char = enemy.name[0];
          }
        }
        if (player.cords.x === x && player.cords.y === y) {
          char = TileChar.PLAYER;
        }

        line += char;
      }
      content += `${line}\n`;
    }

    const health = `${String(player.hp)}/${String(player.maxHP)}`;
    content = health + content.slice(health.length);

    this.box.setContent(content);
    this.screen.render();
  }
}
