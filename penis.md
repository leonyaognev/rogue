# Стиль комментариев в заголовочных файлах (.h)

## Общие принципы

- Используется **Doxygen-подобный стиль** документации
- Комментарии располагаются непосредственно перед описываемым элементом
- Предпочтение кратким, лаконичным описаниям

## Многострочные комментарии (классы, функции)

```cpp
/**
 * @brief Краткое описание класса или функции.
 *
 * Более подробное описание (если нужно).
 *
 * @tparam T Тип элемента (для шаблонов)
 * @param value Параметр функции
 * @return Возвращаемое значение
 * @throws std::bad_alloc при нехватке памяти
 */
```

## Однострочные комментарии

```cpp
/// @brief Краткое описание
```

## Комментарии к членам класса

```cpp
T data;      ///< Данные узла
node* next;  ///< Указатель на следующий узел
node* prev;  ///< Указатель на предыдущий узел
```

## Группировка методов

Используется Doxygen-группы с `@name`:

```cpp
/** @name Constructors and assignment
 *  @brief Стандартные конструкторы и операторы присваивания.
 */
///@{
Конструкторы и операторы...
///@}

/** @name Element access
 *  @brief Доступ к элементам.
 */
///@{
Методы доступа...
///@}
```

## Типичные теги

| Тег       | Назначение            |
| --------- | --------------------- |
| `@brief`  | Краткое описание      |
| `@tparam` | Параметр шаблона      |
| `@param`  | Параметр функции      |
| `@return` | Возвращаемое значение |
| `@throws` | Исключения            |
| `@note`   | Примечание            |

## Примеры использования

### Класс

```cpp
/**
 * @brief Basic doubly linked list with a circular "dummy" node.
 *
 * @tparam T type of elements stored in the list.
 */
template <typename T>
class ListBase {
```

### Конструктор

```cpp
/**
 * @brief Constructs a list with a number of identical elements.
 * @param count Number of elements
 * @param value Value to initialize elements
 */
ListBase(std::size_t count, const T& value);
```

### Метод

```cpp
/** @brief Removes the first element. */
void popFront();
```

### Переменная-член

```cpp
node dummy;             ///< Dummy node (closes the list in a ring)
std::size_t _size = 0; ///< Number of elements in the list
```

### Типы

```cpp
using valueType = T;   ///< Value type
using pointer = T*;    ///< Pointer type
using reference = T&;  ///< Reference type
```

## Важные нюансы

1. **Английский язык** - все комментарии в заголовочных файлах на английском
2. **Краткость** - предпочтение коротким описаниям
3. **Шаблоны** - всегда документировать `@tparam`
4. **Исключения** - указывать `@throws` если метод может выбросить исключение
5. **Константность** - указывать `(const)` в описании для const-версий методов

# Стиль комментариев в файлах реализации

## Общие принципы

- Используются **однострочные комментарии** в стиле `// ...`
- Комментарии преимущественно на **Английском языке**
- Описывают логику работы, а не интерфейс

## Типичные примеры комментариев

### Описание логики

```cpp
// If we reached the sentinel node of the other tree,
// return our own sentinel to maintain structural consistency.
if (n == otherNil) {
    return nil;
}

// Create a new node copying the value
Node* x = new Node(n->value);

// Recursively copy the right subtree
x->right = copyTree(n->right, otherNil);
```

### Пометки о исправлениях

```cpp
for (size_t i = 0; i < _size; i++) {  // <-- ИСПРАВЛЕНО
    new (temp + i) T(std::move(_data[i]));
    _data[i].~T();
}
```

### Пометки об удалении

```cpp
// bool go_left = false; // УДАЛЕН: Не нужен
```

### Описательные комментарии

```cpp
// destroy elements we did not copy
for (size_t i = minSize; i < _size; i++) {
    _data[i].~T();
}
```

### Заголовки секций

```cpp
/**-----------------------------
 *         ARRAY METHODS
 *------------------------------
 */
```

## Паттерны комментариев

| Паттерн                    | Пример                                   |
| -------------------------- | ---------------------------------------- |
| Описание что делает строка | `// Start from the root`                 |
| Пометка об исправлении     | `// <-- ИСПРАВЛЕНО`                      |
| Пометка об удалении        | `// УДАЛЕН: Не нужен`                    |
| Описание блока             | `// If we hit NIL, this branch is empty` |
| Разделитель                | `/**----...----*/`                       |

## Ключевые особенности

1. **Английский язык** - основной язык комментариев
2. **Простота** - короткие, понятные комментарии
3. **Алгоритмичность** - описывают логику и алгоритмы
4. **Английский** - иногда встречается для технических терминов

## Что НЕ нужно комментировать

- Очевидные вещи (инкремент счётчика)
- Тривиальные присваивания
- Стандартные операции

## Примеры из кода

```cpp
// Fix red-black properties after insertion
while (z != root && z->parent->color == Red) {

// Node constructor:
// newly created nodes are red by default, following RB-tree rules.
Node(const T& v) : value(v), ... , color(Red) {

// If sibling is red, rotate and recolor to convert case
if (w->color == Red) {
```

## Рекомендации

1. Комментируй сложную логику
2. Используй пометки при исправлениях багов
3. Пиши на русском для личных заметок
4. Не злоупотребляй комментариями - код должен быть самодокументируемым
