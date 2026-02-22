import blessed from "blessed";
import { ItemType, TileChar, TileType, TypesLogs } from "../../../constants.js";
import { logger } from "../../logger.js";

export class Renderer2D {
  constructor(screen) {
    this.screen = blessed.screen({
      smartCSR: true,
      title: "rogue demo",
    });

    this.gameBox = blessed.box({
      top: 0,
      left: 0,
      width: "70%",
      height: "100%",
      border: "line",
    });

    this.logger = new Logger(this.screen, "30%", "100%");

    this.screen.append(this.gameBox);

    /// отнял 2 из-за line при генерации box
    this.width = this.gameBox.width - 2;
    this.height = this.gameBox.height - 2;
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

    this.gameBox.setContent(content);
    this.logger.displayMessages();
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

class Logger {
  constructor(screen, width, height) {
    this.logBox = blessed.log({
      parent: screen,
      right: 0,
      width: width,
      height: height,
      border: "line",
      label: " Console ",
      tags: true,
      scrollable: true,
      keys: true,
      alwaysScroll: true,
      scrollbar: {
        ch: " ",
        inverse: true,
      },
    });

    this.screen = screen;
    this.screen.append(this.logBox);
  }

  displayMessages() {
    let mes = logger.getMessage();
    while (mes) {
      switch (mes.type) {
        case TypesLogs.MESSAGE:
          this.logBox.log(mes.message);
          break;
        case TypesLogs.INFO:
          this.logBox.log(`{green-fg}[INFO] ${mes.message}`);
          break;
        case TypesLogs.WARN:
          this.logBox.log(`{yellow-fg}[WARN] ${mes.message}`);
          break;
        case TypesLogs.ERROR:
          this.logBox.log(`{red-fg}[ERROR] ${mes.message}`);
          break;
      }

      mes = logger.getMessage();
    }
  }
}
