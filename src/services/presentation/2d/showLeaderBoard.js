import blessed from 'blessed';

export default function showLeaderBoard(screen, board, bind) {
  const leaderBoardDisplayBox = blessed.box({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '50%',
    height: '60%',
    label: ' Leader board ',
    border: 'line',
  });

  const exitHandler = () => {
    // TODO fix eslint error
    // eslint-disable-next-line no-use-before-define
    cleanup();
    bind();
  };

  const cleanup = () => {
    leaderBoardDisplayBox.destroy();
    screen.render();
    screen.unkey(['escape', 'q'], exitHandler);
  };

  let content;
  if (board.length > 0) {
    content = board
      .map((player) => `name: ${player.playerName} | level: ${player.levelNumber} | score: ${player.score}`)
      .join('\n');
  } else content = 'There are no leaders yet, you can be the first!';

  leaderBoardDisplayBox.setContent(content);
  screen.key(['escape', 'q'], exitHandler);
  screen.render();
}
