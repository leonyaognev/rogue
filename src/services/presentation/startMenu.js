import blessed from "blessed";

export function showStartMenu(screen) {
  return new Promise((resolve) => {
    const list = blessed.list({
      parent: screen,
      top: "center",
      left: "center",
      width: "50%",
      height: "60%",
      label: " Main menu ",
      border: "line",
      keys: true,
      mouse: true,
      vi: true,
      style: { selected: { bg: "blue" } },
      items: ["start new game", "start from last save"],
      tags: true,
    });

    list.focus();

    const cleanup = () => {
      list.destroy();
      screen.render();
      screen.unkey(["escape", "q"], cleanup);
    };

    const selectHandler = (item) => {
      cleanup();
      resolve(item);
    };

    list.on("select", selectHandler);
    screen.key(["escape", "q"], () => {
      screen.destroy();
    });
    screen.render();
  });
}
