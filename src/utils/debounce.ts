export interface DebouncedFunction<T extends (...args: never[]) => void> {
  (...args: Parameters<T>): void
  cancel: () => void
  flush: () => void
}

/**
 * Creates a debounced version of a function
 */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null

  const clearTimer = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const cancel = (): void => {
    clearTimer()
    lastArgs = null
  }

  const flush = (): void => {
    if (lastArgs !== null) {
      const args = lastArgs
      cancel()
      fn(...args)
    }
  }

  const debounced = (...args: Parameters<T>): void => {
    lastArgs = args
    clearTimer()
    timeoutId = setTimeout(() => {
      timeoutId = null
      if (lastArgs !== null) {
        const argsToCall = lastArgs
        lastArgs = null
        fn(...argsToCall)
      }
    }, delay)
  }

  debounced.cancel = cancel
  debounced.flush = flush

  return debounced
}
