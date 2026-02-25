import blessed from 'blessed';

export default function initScreen() {
  return blessed.screen({
    smartCSR: true,
    title: 'Rogue',
    fullUnicode: true,
  });
}
