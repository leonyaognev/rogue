import blessed from 'blessed';
import logger from '../../logger.js';
import { TypesLogs } from '../../../constants.js';

function showListMenu({
  screen,
  title,
  menu, // [{ label, item }]
  onSelect,
  bind,
}) {
  const list = blessed.list({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '50%',
    height: '60%',
    label: ` ${title} `,
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
    if (exit) screen.unkey(['escape', 'q'], exit);
  };

  const exitHandler = () => {
    cleanup(exitHandler);
    bind();
  };

  const selectHandler = (_, index) => {
    const selected = menu[index];
    if (selected?.item) onSelect(selected.item);
    exitHandler();
  };

  list.on('select', selectHandler);
  screen.key(['escape', 'q'], exitHandler);
  screen.render();
}

export function showInventoryMenu(pouch, screen, items, onSelect, bind) {
  const menu = items.length
    ? items.map((item, i) => ({
      label: `${i + 1}. ${item.subType}`,
      item,
    }))
    : [{ label: 'empty' }];

  showListMenu({
    screen,
    title: pouch,
    menu,
    onSelect,
    bind,
  });
}

export function showWeaponMenu(screen, items, onSelect, bind, weapon) {
  const menu = [];

  if (weapon) {
    menu.push({
      label: `1. ${weapon.subType} (current)`,
      item: weapon,
    });
  }

  items.forEach((item, i) => {
    menu.push({
      label: `${weapon ? i + 2 : i + 1}. ${item.subType}`,
      item,
    });
  });

  if (!menu.length) {
    menu.push({ label: 'empty' });
  }

  showListMenu({
    screen,
    title: 'Weapons',
    menu,
    onSelect,
    bind,
  });
}
