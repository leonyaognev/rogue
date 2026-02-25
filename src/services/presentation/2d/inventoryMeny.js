import blessed from 'blessed';
import logger from '../../logger.js';
import { TypesLogs } from '../../../constants.js';

export function showInventoryMenu(pouch, screen, items, onSelect, bind) {
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

export function showWeaponMenu(screen, items, onSelect, bind, weapon) {
  const isNotEmpty = items.length !== 0;

  const menu = [];
  if (weapon) {
    menu.push({ label: `1. ${weapon.subType} (current)`, item: weapon });
  }

  if (isNotEmpty) {
    items.forEach((item, i) => {
      menu.push({ label: `${weapon ? i + 2 : i + 1}. ${item.subType}`, item });
    });
  }

  if (!menu.length) menu.push({ label: 'empty' });

  const list = blessed.list({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '50%',
    height: '60%',
    label: ' Weapons ',
    border: 'line',
    keys: true,
    mouse: true,
    vi: true,
    style: { selected: { bg: 'blue' } },
    items: menu.map((i) => i.label),
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

  const selectHandler = (elem) => {
    const text = elem.getText();

    const { item } = menu.find((i) => i.label === text);

    logger.log(`selected item: ${JSON.stringify(item)}`, TypesLogs.MESSAGE);

    if (item) onSelect(item);
    cleanup();
    bind();
  };

  list.on('select', selectHandler);
  screen.key(['escape', 'q'], exitHandler);
  screen.render();
}
