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
      width: this.width,
      height: this.height,
      tags: true,
      border: { type: "line" },
    });

    this.screen.append(this.box);
  }

  refresh(level, entities, player, enemies) {
    const width = Math.max(...level.rooms.map((r) => r.x + r.width));
    const height = Math.max(...level.rooms.map((r) => r.y + r.height));

    let content = "";
    for (let y = 0; y < height; y++) {
      let line = "";
      for (let x = 0; x < width; x++) {
        let char = " ";
        for (const room of level.rooms) {
          if (
            room.x <= x &&
            x < room.x + room.width &&
            room.y <= y &&
            y < room.y + room.height
          ) {
            char = "#";
            break;
          }
        }
        line += char;
      }
      content += line + "\n";
    }
    this.box.setContent(content);
    this.screen.render();
  }
}
