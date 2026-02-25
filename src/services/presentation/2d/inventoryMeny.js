import blessed from 'blessed';

export default function showInventoryMenu(pouch, screen, items, onSelect, bind) {
  const isNotEmpty = items.length !== 0;
  const list = blessed.list({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '50%',
    height: '60%',
    label: ` ${pouch} `,
    border: 'line',
    keys: true,
    mouse: true,
    vi: true,
    style: { selected: { bg: 'blue' } },
    items: isNotEmpty
      ? items.map((item, i) => `${i + 1}. ${item.subType}`)
      : ['empty'],
    tags: true,
  });

  list.focus();

  const cleanup = (exit) => {
    list.destroy();
    screen.render();
    screen.unkey(['escape', 'q'], exit);
  };

  const exitHandler = () => {
    cleanup(exitHandler);
    bind();
  };

  const selectHandler = (_, index) => {
    if (isNotEmpty) onSelect(items[index]);
    cleanup();
    bind();
  };

  list.on('select', selectHandler);
  screen.key(['escape', 'q'], exitHandler);
  screen.render();
}
