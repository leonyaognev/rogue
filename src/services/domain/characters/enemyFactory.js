import { DefaultEnemy } from '../../../constants.js';
import { Ghost } from './enemies/ghost.js';
import { Ogre } from './enemies/ogre.js';
import { Snake } from './enemies/snake.js';
import { Vampire } from './enemies/vampire.js';
import { Zombie } from './enemies/zombie.js';
import { Enemy } from './enemy.js';

export const enemyClasses = [Zombie, Vampire, Ghost, Ogre, Snake];
export const objEnemyClasses = {
  Zombie, Vampire, Ghost, Ogre, Snake,
};

export function createRandomEnemy(enemies, overrides = {}) {
  const EnemyClass = enemies[Math.floor(Math.random() * enemies.length)];
  return new EnemyClass(
    overrides.name ?? EnemyClass.name,
    overrides.maxHp ?? DefaultEnemy.maxHp,
    overrides.agility ?? DefaultEnemy.agility,
    overrides.strength ?? DefaultEnemy.strength,
    overrides.cords,
    overrides.hostility ?? DefaultEnemy.hostility,
    overrides.level,
  );
}

export function enemyDeserialize(data, level) {
  const Cls = objEnemyClasses[data._type] || Enemy;
  const enemy = new Cls(
    data.name,
    data.maxHP,
    data.agility,
    data.strength,
    data.cords,
    data.hostility,
    level,
  );
  enemy.hp = data.hp;
  return enemy;
}
