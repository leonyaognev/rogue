import blessed from "blessed";

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
        let char = " ";
        const ch = level.map[y][x];
        switch (ch) {
          case 0:
            char = " ";
            break;
          case 1:
            char = ".";
            break;
          case 2:
            char = "#";
            break;
          case 3:
            char = ".";
            break;
        }

        if (player.cords.x === x && player.cords.y === y) {
          char = "@";
        }

        line += char;
      }
      content += line + "\n";
    }

    this.box.setContent(content);
    this.screen.render();
  }
}
