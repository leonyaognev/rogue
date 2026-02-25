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

  const cleanup = (exit) => {
    leaderBoardDisplayBox.destroy();
    screen.render();
    screen.unkey(['escape', 'q'], exit);
  };

  const exitHandler = () => {
    cleanup(exitHandler);
    bind();
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
