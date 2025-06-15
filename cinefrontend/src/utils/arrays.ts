export function groupByKey<T>(array: Array<T>, reducer: (_: T) => string) {
  const result: { [x: string]: T[] } = {};

  array.forEach((element) => {
    const key = reducer(element);
    if (key in result) {
      result[key].push(element);
    } else {
      result[key] = [element];
    }
  });

  return result;
}

export function filterByUnique<T extends any>(
  array: T[],
  filterFn: (_: T) => string | number
): T[] {
  const result = array.reduce((acc, value) => {
    const key = filterFn(value);
    if (!acc[key]) {
      Object.assign(acc, { [key]: value });
    }
    return acc;
  }, {});
  return Object.values(result).flat() as T[];
}

/**
 * Вывод следующего элемента списка
 */
export function getNextArrayElement<T extends any>(
  currentItem: T,
  array: Array<T>
): T {
  const currentIndex = array.indexOf(currentItem);
  const nextIndex = currentIndex + 1;
  if (nextIndex > array.length) {
    return currentItem;
  }
  return array[nextIndex];
}

/**
 * Вывод прошлого элемента списка
 */
export function getPrevArrayElement<T extends any>(
  currentItem: T,
  array: T[]
): T {
  const currentIndex = array.indexOf(currentItem);
  const prevIndex = currentIndex - 1;
  return array[prevIndex];
}
