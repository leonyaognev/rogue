import blessed from 'blessed';

function pad(str, len) {
  str = String(str);
  return str.length >= len
    ? str.slice(0, len)
    : str + ' '.repeat(len - str.length);
}

function generateBoard(board, totalWidth) {
  if (!board.length) {
    return 'There are no leaders yet. Be the first!\n';
  }

  // сколько колонок
  const columns = [
    'Name',
    'Lvl',
    'Tre',
    'Def',
    'Hit',
    'Miss',
    'Cells',
  ];

  const colCount = columns.length;

  // вычитаем границы | и пробелы
  const usableWidth = totalWidth - (colCount + 1) - (colCount * 2);

  const baseWidth = Math.floor(usableWidth / colCount);
  const widths = Array(colCount).fill(baseWidth);

  const makeSeparator = () => `+${
    widths.map((w) => '-'.repeat(w + 2)).join('+')
  }+\n`;

  const makeRow = (row) => `|${
    row.map((cell, i) => ` ${pad(cell, widths[i])} `).join('|')
  }|\n`;

  const rows = board.map((s) => [
    s.playerName,
    s.level,
    s.treasures,
    s.defeatedEnemies,
    s.hits,
    s.missed,
    s.passedCells,
  ]);

  let output = '';
  output += makeSeparator();
  output += makeRow(columns);
  output += makeSeparator();
  rows.forEach((r) => {
    output += makeRow(r);
  });
  output += makeSeparator();

  return output;
}

export default function showLeaderBoard(screen, board, bind) {
  const box = blessed.box({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '70%',
    height: '70%',
    border: 'line',
    label: ' Leader board ',
    scrollable: true,
    keys: true,
    vi: true,
  });

  const cleanup = (exit) => {
    box.destroy();
    screen.unkey(['escape', 'q'], exit);
    screen.render();
  };

  const exitHandler = () => {
    cleanup(exitHandler);
    bind();
  };

  const renderTable = () => {
    const contentWidth = box.width - 2; // минус рамки
    box.setContent(generateBoard(board, contentWidth));
    screen.render();
  };

  renderTable();

  screen.on('resize', renderTable);

  screen.key(['escape', 'q'], exitHandler);
}
