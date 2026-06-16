/**
 * Sorts items by a date string in ascending order (nearest date first).
 * Returns a new array — does not mutate the original.
 */
export function sortByNearestDateAsc<T>(
  items: T[],
  getDate: (item: T) => string,
): T[] {
  return [...items].sort((a, b) => {
    const timeA = new Date(getDate(a)).getTime()
    const timeB = new Date(getDate(b)).getTime()
    return timeA - timeB
  })
}

/**
 * Sorts items by a date string in descending order (latest date first).
 * Returns a new array — does not mutate the original.
 */
export function sortByDateDesc<T>(
  items: T[],
  getDate: (item: T) => string,
): T[] {
  return [...items].sort((a, b) => {
    const timeA = new Date(getDate(a)).getTime()
    const timeB = new Date(getDate(b)).getTime()
    return timeB - timeA
  })
}
