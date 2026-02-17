# СРАВНИТЕЛЬНЫЙ АНАЛИЗ ПРОЕКТОВ ROGUE

---

# ИТОГ

| Критерий          | rouge_game3 | js3  | Победитель      |
| ----------------- | ----------- | ---- | --------------- |
| Архитектура       | 4/10        | 8/10 | **js3**         |
| Оптимизация       | 2/10        | 7/10 | **js3**         |
| A\* алгоритм      | 3/10        | 8/10 | **js3**         |
| Генерация уровней | 4/10        | 7/10 | **js3**         |
| Готовность        | 100%        | 20%  | **rouge_game3** |

---

# РАЗДЕЛ 1: АРХИТЕКТУРА

## 1.1 Структура проекта

### rouge_game3 (плохо)

```
src/
├── controllers/GameController.js    # 1173 строки - GOD CLASS
├── domain/
│   ├── player.js, enemy.js           # много дублирования
│   ├── level.js, room.js, corridor.js
│   └── 15+ файлов предметов/врагов
├── presentation/                     # 7 файлов - избыточно
└── datalayer/
```

**Проблемы:**

- GameController делает всё: ввод, бой, движение, UI, сохранение
- 7 presentation файлов вместо 1-2
- Дублирование \_findFreePosition в 2 местах

---

### js3 (хорошо)

```
src/
├── game.js, app.js                    # 33 строки total
├── services/
│   ├── domain/
│   │   ├── level.js                  # 144 строки
│   │   ├── room.js                   # 24 строки
│   │   ├── corridor.js               # 8 строк
│   │   ├── character.js              # 68 строк
│   │   ├── constants.js              # 22 строки - КОНФИГ
│   │   ├── utils/AStar.js            # 194 строки - MinHeap
│   │   └── characters/               # модульно
│   ├── presentation/2d/renderer.js   # 53 строки
│   └── datalayer/save_manager.js    # 22 строки (заглушка)
```

**Плюсы:**

- Разделение concerns: Game (логика), App (зависимости)
- constants.js - все конфиги в одном месте
- Компактные классы
- Character - базовый класс для Player/Enemy

---

## 1.2 Вывод по архитектуре

**js3: 8/10** - Чисто, компактно, понятно  
**rouge_game3: 4/10** - god class, дублирование

---

# РАЗДЕЛ 2: ОПТИМИЗАЦИЯ

## 2.1 Хранение данных

### rouge_game3 - ИЗБЫТОЧНО (1/10)

```javascript
// LevelGenerator.js - grid структура с 85% лишних данных
grid[i][j] = {
  grid_i: i, // нахуя? это i
  grid_j: j, // нахуя? это j
  hasRoom: false, // проверяется через roomId
  roomId: null, // ок
  top_left: null, // вычисляется из room
  bottom_right: null, // вычисляется из room
  doors: [null, null, null, null], // 75% не используется
  connections: [], // дублирует doors
  room: null, // создаётся отдельно
};
```

**Избыточность:** ~600 лишних полей на 25 ячеек

---

### js3 - ОПТИМАЛЬНО (8/10)

```javascript
// level.js - простой 2D массив
this.map = new Array(this.height)
  .fill(TileType.EMPTY)
  .map(() => new Array(this.width).fill(TileType.EMPTY));

// TileType - enum
export const TileType = Object.freeze({
  EMPTY: 0,
  FLOOR: 1,
  WALL: 2,
  CORRIDOR: 3,
});
```

**Плюсы:**

- 2D массив - O(1) доступ по координатам
- TileType enum - компактное представление
- Никаких объектов с 10 полями

---

## 2.2 A\* Алгоритм

### rouge_game3 - ПЛОХО (3/10)

```javascript
// LevelGenerator.js:837
let cur = open.reduce((a, b) => (a.f < b.f ? a : b)); // O(n)

// И splice для удаления - тоже O(n)
// ИТОГО: O(n²)
```

**Проблемы:**

- Линейный поиск минимума в массиве
- splice() для удаления - O(n)
- Нет приоритетной очереди

---

### js3 - ХОРОШО (8/10)

```javascript
// AStar.js:3-68 - настоящий MinHeap
class MinHeap {
  #items;

  push(value) {
    this.#items.push(value);
    this.#bubbleUp(); // O(log n)
  }

  pop() {
    // ... O(log n)
    this.#bubbleDown(); // O(log n)
  }
}

// Использование
const openSet = new MinHeap(); // O(1) push/pop
const openMap = new Map(); // O(1) поиск
const closedSet = new Set(); // O(1) проверка
```

**Плюсы:**

- MinHeap с #private полями
- O(log n) вставка/извлечение
- Map/Set для быстрого поиска
- openMap - дополнительный O(1) lookup

**Минусы:**

- Node класс внутри файла (можно вынести)
- isNearCorridor вызывается для каждого соседа - можно кэшировать

---

## 2.3 Генерация комнат

### rouge_game3 (4/10)

- Фиксированная сетка 3x3 - нет вариативности
- 230 строк кода для коридоров
- Fallback \_forceConnectivity - костыль

### js3 (7/10)

```javascript
// level.js - BSP подход
function makeLeaves(width, height) {
  const pw = width / LevelConfig.GRID_DIVISIONS;
  const ph = height / LevelConfig.GRID_DIVISIONS;

  const leaves = [];
  for (let i = 0; i < LevelConfig.GRID_DIVISIONS; i++) {
    for (let j = 0; j < LevelConfig.GRID_DIVISIONS; j++) {
      leaves.push(new Node(pw * i, ph * j, pw, ph));
    }
  }
  return leaves;
}
```

**Плюсы:**

- BSP - стандартный алгоритм для roguelike
- Комнаты генерируются в секторах
- Конфигурируемо через LevelConfig

**Минусы:**

- Пока только квадратные сектора
- connectRooms() - O(n²) поиск ближайших

---

## 2.4 Вывод по оптимизации

| Аспект         | rouge_game3         | js3                          |
| -------------- | ------------------- | ---------------------------- |
| Хранение карты | Объекты с 10 полями | 2D массив enum               |
| A\*            | O(n²) reduce+splice | O(n log n) MinHeap           |
| Поиск комнаты  | O(n) getRoomAt()    | Пока нет (но можно добавить) |
| Генерация      | 230 строк коридоры  | 100 строк                    |

---

# РАЗДЕЛ 3: ЧИТАЕМОСТЬ И ПОДДЕРЖКА

## 3.1 Конфиги

### rouge_game3 - Магические числа

```javascript
// Разбросаны по коду
this.MAP_WIDTH = 80;
this.MAP_HEIGHT = 38;
this.ROOMS_PER_SIDE = 3;
this.MIN_ROOM_SIZE = 5;
const MAP_WIDTH = 80; // дублируется
const MAP_HEIGHT = 38; // дублируется
```

### js3 - Централизованные конфиги

```javascript
// constants.js - ВСЕ конфиги в одном месте
export const TileType = Object.freeze({...});
export const PathCost = Object.freeze({...});
export const LevelConfig = Object.freeze({
  GRID_DIVISIONS: 3,
  MIN_ROOM_SIZE: 3,
  DEFAULT_WIDTH: 80,
  DEFAULT_HEIGHT: 24,
});
```

---

## 3.2 Комментарии

### rouge_game3

- Много "ИСПРАВЛЕНО" - свидетельство переделок
- 50+ строк комментариев на одну функцию
- Русские комментарии - но не структурированы

### js3

- Минимальные комментарии - код самодокументируемый
- Классы маленькие и понятные
- English naming convention

---

## 3.3 Опечатки

### js3 - Есть

```javascript
// room.js:7
this.connextedRooms = []; // Должно быть connectedRooms
```

### rouge_game3 - Есть

```javascript
// Много где
// Исправлено в комментариях но не в коде
```

---

# РАЗДЕЛ 4: ЧТО JS3 ДЕЛАЕТ ЛУЧШЕ

## 4.1 Компактность

| Файл           | rouge_game3       | js3                  |
| -------------- | ----------------- | -------------------- |
| Level          | 169 строк         | 144 строк            |
| Room           | 24 строк          | 24 строк             |
| Corridor       | 24 строк          | 8 строк              |
| A\*            | 50 строк (плохой) | 194 строки (хороший) |
| GameController | 1173 строки       | -                    |
| Game           | -                 | 22 строки            |

**Итого рабочего кода:**

- rouge_game3: ~3000 строк
- js3: ~600 строк (в 5 раз меньше)

---

## 4.2 Наследование

### js3 - Правильно

```javascript
// character.js - базовый класс
export class Character {
  constructor(name, maxHP, hp, agility, strength, weapon = null) {...}
  attack(target) {...}
  takeDamage(amount) {...}
}

// player.js - расширяет
export class Player extends Character {
  constructor(...args) {
    super(...args);
    this.inventory = new Inventory();
  }
}

// enemy.js - расширяет
export class Enemy extends Character {
  constructor(type, hp, agility, strength, hostility) {
    super(type, hp, hp, agility, strength);
  }
}
```

### rouge_game3 - Дублирование

```javascript
// Отдельные классы с копипастой методов
// Player: attack(), takeDamage()
// Enemy: attack(), takeDamage()
// Почти идентичный код
```

---

## 4.3 Presentation слой

### js3 - Просто и понятно

```javascript
// presentation/2d/renderer.js - 53 строки
export class Renderer2D {
  refresh(level, entities, player, enemies) {
    // Рендерит карту
  }
}
```

### rouge_game3 - Избыточно

```
7 файлов:
- ScreenManager.js
- GameWindow.js
- InventoryWindow.js
- StatsWindow.js
- StatusWindow.js
- MessageLog.js
- LeaderboardWindow.js

Каждый 50-100 строк, много дублирования
```

---

# РАЗДЕЛ 5: ЧТО JS3 НУЖНО ДОПИСАТЬ

## 5.1 Незавершённые методы

```javascript
// room.js
isAccessible(x, y) {
  /* проверка координат */  // TODO
}

// inventory.js
add(item) {
  /* добавить с проверкой на колличество (до 9 предметов)*/  // TODO
}

// level.js
populateEnemies() {
  /* добавить монстров */  // TODO
}

populateItems() {
  /* добавить предметы */  // TODO
}
```

## 5.2 Отсутствующие компоненты

- Input handler - нет обработки клавиш
- Combat system - только базовый метод в Character
- Enemy AI - пустые movePattern(), decideAction()
- Save/Load - заглушки
- 3D renderer - папка есть, файла нет

---

# РАЗДЕЛ 6: ИТОГОВАЯ ОЦЕНКА

## js3

| Критерий    | Оценка | Комментарий                 |
| ----------- | ------ | --------------------------- |
| Архитектура | 8/10   | Компактно, модульно         |
| Оптимизация | 7/10   | MinHeap, 2D массив          |
| A\*         | 8/10   | Профессиональная реализация |
| Генерация   | 7/10   | BSP, но без вариативности   |
| Читаемость  | 9/10   | Понятный код                |
| Готовность  | 2/10   | 20% функционала             |

**Общая: 6.8/10**

---

## rouge_game3

| Критерий    | Оценка | Комментарий              |
| ----------- | ------ | ------------------------ |
| Архитектура | 4/10   | God class, дублирование  |
| Оптимизация | 2/10   | Избыточные данные, O(n²) |
| A\*         | 3/10   | Без heap                 |
| Генерация   | 4/10   | Нет вариативности        |
| Читаемость  | 5/10   | Много мусора             |
| Готовность  | 10/10  | Всё работает             |

**Общая: 4.7/10**

---

# ВЫВОД

## Если нужен рабочий игра - rouge_game3

Всё работает, 21 уровень, боевая система, сохранение.

## Если нужен качественный код - js3

Лучше спроектирован, чище, оптимизированнее. Нужно дописать ~80%.

---

# js3 - ПОЛНЫЙ РАЗБОР

## 1. Опечатки и говнокод

### room.js

```javascript
// room.js:7
this.connextedRooms = []; // "connexted" - что за хуйня?
```

Должно быть `connectedRooms`. Это базовый уровень.

---

## 2. Level.js - проблемы

### 2.1 connectRooms() - O(n²) говно

```javascript
// level.js:102-129
#connectRooms() {
  const connected = new Set();
  const remaining = new Set(this.rooms);

  while (remaining.size > 0) {
    let bestPair = null;
    let bestDistance = Infinity;

    // ДВА вложенных цикла - O(n²)
    for (const a of connected) {
      for (const b of remaining) {
        const d = a.distance(b);  // sqrt - дорогая операция
        if (d < bestDistance) {...}
      }
    }
    // ...
  }
}
```

**Проблемы:**

- Каждый шаг: O(connected × remaining) = O(n²)
- a.distance(b) - Math.sqrt() на каждой итерации - нахуя?
- Можно сравнивать квадраты расстояний без sqrt

**Исправление:**

```javascript
const d2 = dx*dx + dy*dy; // Без sqrt
if (d2 < bestDistanceSq) {...}
```

---

### 2.2 #buildPath - нет проверки на null

```javascript
// level.js:91-100
#buildPath(start, end) {
  const path = aStar(this.map, start.center, end.center);
  // НЕТ ПРОВЕРКИ if (path === null)!
  for (const cord of path) { // Если path null - краш
    // ...
  }
}
```

Если A* не найдёт путь - программа крашнется. А A* может не найти путь если карта непроходима.

---

### 2.3 Level зависит от process.stdout

```javascript
// level.js:42-43
this.width = process.stdout.columns || LevelConfig.DEFAULT_WIDTH;
this.height = process.stdout.rows || LevelConfig.DEFAULT_HEIGHT;
```

**Проблемы:**

- Невозможно тестировать без терминала
- Невозможно запустить в headless mode
- Константы DEFAULT_WIDTH/height есть, но используются как fallback а не по дефолту

---

### 2.4 generate() вызывается в конструкторе

```javascript
// level.js:49
this.generate(); //side effect в конструкторе
```

**Проблемы:**

- Невозможно создать Level без генерации
- Невозможно протестировать отдельно
- Side effect в конструкторе - антипаттерн

---

## 3. AStar.js - проблемы

### 3.1 isNearCorridor вызывается 4 раза на каждого соседа

```javascript
// AStar.js:171
if (isNearCorridor(nx, ny, grid)) cost += PathCost.NEAR_CORRIDOR;
```

**Проблема:** Для каждого neighbor проверяется 9 клеток вокруг. Это 36 проверок на итерацию.

**Исправление:** Кэшировать карту "рядом с коридором" при инициализации.

---

### 3.2 Дважды определяется isInside

```javascript
// AStar.js:93-95
const isInside = (x, y, grid) => {...}
// И потом в 150:
if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
```

Функция isInside определена, но не используется. Вместо этого ручная проверка.

---

### 3.3 Node класс внутри файла

```javascript
// AStar.js:71-80
class Node {
  constructor(x, y, g, h, f, parent) {...}
}
```

**Проблемы:**

- В Level.js тоже есть Node
- Два разных Node класса в одном проекте
- Название неговорящее (AStar.Node vs Level.Node)

---

### 3.4 heap хранит Node объекты но не обновляет их

```javascript
// AStar.js:183-188
} else if (gScore < exists.g) {
  exists.g = gScore;
  exists.h = hScore;
  exists.f = fScore;
  exists.parent = current;
  // НО НЕ ПЕРЕСОРТИРУЕТ HEAP!
  // MinHeap не умеет перестраиваться
}
```

**Это баг!** Heap не пересортируется после обновления. Путь может быть неоптимальным.

**Правильно:** Удалить старый Node и вставить новый, или пометить старый как closed и добавить новый.

---

## 4. Constants.js - проблемы

### 4.1 PathCost - нелогичные значения

```javascript
export const PathCost = Object.freeze({
  EMPTY: 1,
  FLOOR: 1,
  WALL: 20, // Штраф за стену
  CORRIDOR: 20, // Почему коридор дороже пола?
  NEAR_CORRIDOR: 10, // Это что за хуйня?
});
```

**Проблемы:**

- EMPTY имеет цену 1 - значит можно ходить по пустому пространству? Но там ничего нет!
- CORRIDOR дороже FLOOR - логика?
- NEAR_CORRIDOR - что это значит? Зачем?

---

### 4.2 LevelConfig - странные значения

```javascript
export const LevelConfig = Object.freeze({
  GRID_DIVISIONS: 3,
  MIN_ROOM_SIZE: 3, // Комната 3x3 - это квадрат 3 клетки?
  DEFAULT_WIDTH: 80,
  DEFAULT_HEIGHT: 24, // Почему не 38 как в rouge_game3?
});
```

**Проблемы:**

- MIN_ROOM_SIZE = 3 - очень маленькие комнаты
- DEFAULT_HEIGHT = 24 - не соответствует ширине 80 (пропорции)

---

## 5. Character.js - проблемы

### 5.1 Weapon - null safety говнокод

```javascript
// character.js:43
const weaponBonus = this.weapon?.strengthBonus ?? 0;
```

**Проблема:** Оружие не имеет класса, просто проверяется свойство. Нет типизации.

---

### 5.2 damage.variance = 3

```javascript
// character.js:46
const variance = Math.floor(Math.random() * CombatConfig.damage.variance);
// variance может быть 0, 1, 2 - влияние 33% на урон
```

**Проблема:** Разброс 3 - это очень много. Урон может отличаться на 60%+.

---

### 5.3 attack возвращает 0 или 1

```javascript
// character.js:57-59
const died = target.takeDamage(damage);
return died ? 1 : 0;
```

**Проблема:** Зачем возвращать 1? Для подсчёта убийств? Это должно быть в game logic, а не в character.

---

## 6. Player.js - проблемы

### 6.1 extends Character но не инициализирует базовые поля

```javascript
// player.js:5-10
constructor(...args) {
  super(...args); // Передаёт все аргументы в Character
  this.inventory = new Inventory();
  this.level = 1;
  this.treasures = 0;
}
```

**Проблема:** Character требует (name, maxHP, hp, agility, strength, weapon). Player не передаёт эти параметры - будет undefined или ошибка.

---

### 6.2 inventory.add возвращает непонятно что

```javascript
// player.js:17
pickItem(item) {
  return this.inventory.add(item); // add() возвращает что?
}
```

**Проблема:** Inventory.add() возвращает что? Неизвестно. Нет документации.

---

## 7. Inventory.js - проблемы

### 7.1 Только заглушки

```javascript
// inventory.js
add(item) {
  /* добавить с проверкой на колличество (до 9 предметов)*/ // TODO
}
```

**Говнокод:** Класс существует но не работает.

---

### 7.2 Структура items - странная

```javascript
// inventory.js:3
this.items = { food: [], potion: [], scroll: [], weapon: [], treasure: [] };
```

**Проблемы:**

- 5 разных массивов - но что если нужно 10 еды?
- Нет проверки лимитов
- Нет метода getTotalCount()

---

## 8. Level generation - проблемы

### 8.1 Комнаты генерируются с -1 позицией

```javascript
// level.js:76-79
for (let i = x - 1; i < x + rw + 1; i++) {
  for (let j = y - 1; j < y + rh + 1; j++) {
    this.map[j][i] = TileType.WALL; // Может выйти за границы массива!
  }
}
```

Если x = 0: x - 1 = -1, это выход за границы массива!

---

### 8.2 room.center вычисляется при создании

```javascript
// room.js:8-11
this.center = {
  x: Math.floor(x + width / 2),
  y: Math.floor(y + height / 2),
};
```

**Проблема:** center может указывать на стену! Комната может быть 3x3, center будет (1,1) - это стена!

---

## 9. Game.js - проблемы

### 9.1 level.entities не существует

```javascript
// game.js:17
this.level.enemies; // Level имеет this.enemies = []
this.level.entities; // НЕТ ТАКОГО ПОЛЯ!
```

### 9.2 Нет game loop

```javascript
// game.js:14-21
run() {
  this.app.renderer.refresh(
    this.level,
    this.level.entities, // undefined!
    this.player,
    this.level.enemies
  );
}
```

**Проблема:** Это не game loop. Это один render. Нет:

- Обработки ввода
- Обновления состояния
- Цикла игры

---

## 10. Renderer.js - проблемы

### 10.1 Switch-case без default

```javascript
// renderer.js:30-43
switch (ch) {
  case 0:
    char = " ";
    break;
  case 1:
    char = ".";
    break;
  case 2:
    char = "#";
    break;
  case 3:
    char = ".";
    break;
  // НЕТ DEFAULT! Неизвестные тайлы - undefined
}
```

### 10.2 Width/height не синхронизированы с level

```javascript
// renderer.js:10-11
this.width = process.stdout.columns;
this.height = process.stdout.rows;
// level.js:42-43
this.width = process.stdout.columns || LevelConfig.DEFAULT_WIDTH;
```

Два разных значения! Рендерер и Level могут иметь разные размеры.

---

## 11. App.js - проблемы

### 11.1 Конструктор game не передаётся

```javascript
// app.js
this.renderer = new Renderer2D();
this.saveManager = new SaveManager();
// Но game создаётся где?
```

**Проблема:** App не создаёт Game. Кто создаёт?

### 11.2 SaveManager требует filePath но не передаётся

```javascript
// save_manager.js:2
constructor(filePath) {
  this.filePath = filePath;
}
// app.js:7
this.saveManager = new SaveManager(); // filePath = undefined!
```

---

## ИТОГОВАЯ ОЦЕНКА js3

| Критерий      | Оценка | Комментарий                |
| ------------- | ------ | -------------------------- |
| Архитектура   | 8/10   | Компактно, но есть косяки  |
| Оптимизация   | 7/10   | MinHeap есть, но баги      |
| A\*           | 5/10   | Баг с пересортировкой heap |
| Генерация     | 5/10   | Выход за границы массива   |
| Чистота кода  | 6/10   | Опечатка, нет проверок     |
| Готовность    | 2/10   | 90% - заглушки             |
| Играбельность | 0/10   | Не запустится              |

**ВЕРДИКТ: 4.5/10**

---

## ВЫВОД

### Почему так мало:

1. A\* с багом - heap не пересортируется
2. Выход за границы массива - level.js:76-79
3. NPE в buildPath - нет проверки на null
4. Game не запустится - undefined entities, нет loop
5. 90% заглушек - код есть, но не работает

### По сравнению с rouge_game3:

| Проект      | Оценка | Комментарий                            |
| ----------- | ------ | -------------------------------------- |
| rouge_game3 | 3.5/10 | Работает, но говнокод (по оптимизации) |
| js3         | 4.5/10 | Не работает, но архитектура лучше      |

**Итог:** js3 - "потенциально хороший проект который не работает", rouge_game3 - "работающий говнокод".
