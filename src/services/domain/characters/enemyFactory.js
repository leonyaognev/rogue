import { DefaultEnemy } from "../../../constants.js";
import { Vampire } from "./enemies/vampire.js";
import { Zombie } from "./enemies/zombie.js";
import { Snake } from "./enemies/snake.js";
import { Ghost } from "./enemies/ghost.js";
import { Ogre } from "./enemies/ogre.js";

export const enemyClasses = [Zombie, Vampire, Ghost, Ogre, Snake];

export function createRandomEnemy(enemies, overrides = {}) {
  const EnemyClass = enemies[Math.floor(Math.random() * enemies.length)];
  return new EnemyClass(
    overrides.name ?? EnemyClass.name,
    overrides.maxHp ?? DefaultEnemy.maxHp,
    overrides.agility ?? DefaultEnemy.agility,
    overrides.strength ?? DefaultEnemy.strength,
    overrides.cords,
    overrides.hostility ?? DefaultEnemy.hostility,
    overrides.level
  );
}
