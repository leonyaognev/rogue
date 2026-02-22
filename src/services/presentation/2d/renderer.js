import blessed from "blessed";
import { TileChar, TileType, TypesLogs } from "../../../constants.js";
import { logger } from "../../logger.js";

function colorChar(char, fg = "white", bg = null) {
  let result = `{${fg}-fg}`;
  if (bg) result += `{${bg}-bg}`;
  result += char;
  if (bg) result += `{/${bg}-bg}`;
  result += `{/${fg}-fg}`;
  return result;
}

export class Renderer2D {
  constructor() {
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
      tags: true,
    });

    this.logger = new Logger(this.screen, "30%", "50%");
    this.playerDisplay = new PlayerDisplay(this.screen, "30%", "50%");

    this.screen.append(this.gameBox);

    // размеры игрового окна (отнимаем 2 из-за border)
    this.width = this.gameBox.width - 2;
    this.height = this.gameBox.height - 2;
  }

  refresh(level, items, player, enemies) {
    let content = "";
    for (let y = 0; y < level.map.length; y++) {
      let line = "";
      for (let x = 0; x < level.map[0].length; x++) {
        const ch = level.map[y][x];
        let char = TileChar.EMPTY;

        switch (ch) {
          case TileType.EMPTY:
            char = colorChar(TileChar.EMPTY, "black");
            break;
          case TileType.FLOOR:
            char = colorChar(TileChar.FLOOR, "cyan");
            break;
          case TileType.WALL:
            char = colorChar(TileChar.WALL, "grey");
            break;
          case TileType.CORRIDOR:
            char = colorChar(TileChar.CORRIDOR, "cyan");
            break;
        }

        if (level.endRoom.center.x === x && level.endRoom.center.y === y) {
          char = colorChar(TileChar.END_ROOM, "magenta");
        }

        for (const item of items) {
          if (item.cords.x === x && item.cords.y === y) {
            char = colorChar(item.item.type[0], "green");
          }
        }

        for (const enemy of enemies) {
          if (enemy.cords.x === x && enemy.cords.y === y && enemy.visible) {
            char = colorChar(enemy.name[0], "red");
          }
        }

        if (player.cords.x === x && player.cords.y === y) {
          char = colorChar(TileChar.PLAYER, "blue");
        }

        line += char;
      }
      content += `${line}\n`;
    }

    this.gameBox.setContent(content);
    this.logger.displayMessages();
    this.playerDisplay.displayPlayerInformation(player, level);
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
      tags: true,
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
        selected: { bg: "blue" },
      },
      items: isNotEmpty
        ? items.map((item, i) => `${i + 1}. ${item.subType}`)
        : ["empty"],
      tags: true,
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
  static #colors = ["red", "yellow", "green", "cyan", "blue", "magenta"];

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
      scrollbar: { ch: " ", inverse: true },
      bottom: 0,
    });

    this.screen = screen;
    this.screen.append(this.logBox);
    this.color = 0;
  }

  displayMessages() {
    let mes = logger.getMessage();
    while (mes) {
      switch (mes.type) {
        case TypesLogs.MESSAGE:
          this.logBox.log(`{${Logger.#colors[this.color]}-fg}${mes.message}`);
          this.color = (this.color + 1) % Logger.#colors.length;
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

class PlayerDisplay {
  constructor(screen, width, height) {
    this.playerBox = blessed.box({
      parent: screen,
      right: 0,
      width: width,
      height: height,
      border: "line",
      label: " penis ",
      tags: true,
      scrollable: true,
      keys: true,
      alwaysScroll: true,
      scrollbar: { ch: " ", inverse: true },
    });

    this.screen = screen;
    this.screen.append(this.playerBox);
  }

  displayPlayerInformation(player, level) {
    const bufs = player.potionsBufs();
    let content = "";

    const curLevel = `current level: ${level.number} `;
    content += `${colorChar(curLevel, "white")}\n`;

    const health = `health: ${Math.floor(player.hp)}/${player.maxHP} `;
    content += `${colorChar(health, "red")}\n`;

    const strength = `strength: ${Math.floor(player.strength + bufs.strength)}`;
    content += `${colorChar(strength, "gray")}\n`;

    const agility = `strength: ${Math.floor(player.agility + bufs.agility)}`;
    content += `${colorChar(agility, "green")}\n`;

    const weapon = `weapon: ${player.weapon?.subType ?? "no weapon"} ${player.weapon?.strengthBonus ?? ""}`;
    content += `${colorChar(weapon, "yellow")}\n`;

    this.playerBox.setContent(content);
  }
}
