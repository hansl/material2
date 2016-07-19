
const timeoutMap = new Map<Function, number>();


/**
 * Call a function after an
 * @param fn
 * @param wait
 */
export function debounce(fn: Function, wait: number = 0) {
  if (!timeoutMap.has(fn)) {
    timeoutMap.set(fn, wait);
    setTimeout(() => {
      timeoutMap.delete(fn);
      fn.call(null);
    }, wait);
  }
}
