import blessed from 'blessed';
import { colorChar } from './utils.js';

export class PlayerStats {
  constructor(screen, options = {}) {
    this.playerBox = blessed.box({
      parent: screen,
      right: 0,
      top: 0,
      width: options.width || '30%',
      height: options.height || '50%',
      border: 'line',
      label: ' Player Stats ',
      tags: true,
    });
  }

  displayPlayerInformation(player, level) {
    const bufs = player.potionsBufs();
    let content = '';

    content += `${colorChar(`current level: ${level.number} `, 'white')}\n`;
    content += `${colorChar(`treasures: ${player.treasures} `, 'yellow')}\n`;
    content
      += `${colorChar(`health: ${Math.floor(player.hp)}/${player.maxHP} `, 'red')
      }\n`;
    content
      += `${colorChar(
        `strength: ${Math.floor(player.strength + bufs.strength)}`,
        'gray',
      )}\n`;
    content
      += `${colorChar(
        `agility: ${Math.floor(player.agility + bufs.agility)}`,
        'green',
      )}\n`;

    const weaponStats = player.weapon
      ? `${player.weapon.subType} ${player.weapon.strengthBonus}`
      : 'no weapon';
    content += `${colorChar(`weapon: ${weaponStats}`, 'yellow')}\n\n`;

    this.playerBox.setContent(content);
  }
}
