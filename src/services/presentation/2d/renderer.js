import blessed from "blessed";
import { ItemType, TileChar, TileType } from "../../../constants.js";

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

  refresh(level, items, player, enemies) {
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

        for (const item of items) {
          if (item.cords.x === x && item.cords.y === y) {
            char = item.item.type[0];
          }
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

    const health = `${String(Math.floor(player.hp))}/${String(player.maxHP)}`;
    content = health + content.slice(health.length);

    this.box.setContent(content);
    this.screen.render();
  }

  showItemsMenu(items, onSelect, bind) {
    const isNotEmpty = items.length !== 0;
    const overlay = blessed.box({
      parent: this.screen,
      top: "center",
      left: "center",
      width: "50%",
      height: "60%",
      border: "line",
      label: " Inventory ",
      style: {
        border: { fg: "white" },
        bg: "black",
      },
    });

    const list = blessed.list({
      parent: overlay,
      top: 1,
      left: 1,
      width: "95%",
      height: "90%",
      keys: true,
      mouse: true,
      vi: true,
      style: {
        selected: {
          bg: "blue",
        },
      },
      items: isNotEmpty
        ? items.map((item, i) => `${i + 1}. ${item.subType}`)
        : ["empty"],
    });

    list.focus();

    const cleanup = () => {
      overlay.destroy();
      this.screen.render();
      this.screen.unkey(["escape", "q"], exitHandler);
      list.off("select", selectHandler);
    };

    const exitHandler = () => {
      cleanup();
      bind();
    };

    const selectHandler = (_, index) => {
      if (isNotEmpty) {
        const selectedItem = items[index];
        onSelect(selectedItem);
      }
      cleanup();
      bind();
    };

    list.on("select", selectHandler);

    this.screen.key(["escape", "q"], exitHandler);

    this.screen.render();
  }
}
