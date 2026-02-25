import blessed from 'blessed';

export function initScreen() {
  return blessed.screen({
    smartCSR: true,
    title: 'Rogue',
    fullUnicode: true,
  });
}
