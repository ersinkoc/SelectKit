import type { SelectConfig, SelectOption, SelectState } from '../types'
import { normalizeOptions, findOptionsByValue } from './options'

/**
 * Create initial state from config
 */
export function createInitialState<T>(config: SelectConfig<T>): SelectState<T> {
  const { flat: flatOptions } = normalizeOptions(config.options)

  // Determine initial value
  const initialValue = config.value ?? config.defaultValue ?? (config.multiple ? [] : null)

  // Find selected options
  const selectedOptions = findOptionsByValue(flatOptions, initialValue)

  return {
    isOpen: false,
    value: initialValue,
    selectedOptions,
    searchValue: '',
    options: flatOptions,
    filteredOptions: flatOptions,
    flatOptions,
    highlightedIndex: -1,
    highlightedOption: null,
    isLoading: false,
    isFocused: false,
    isDisabled: config.disabled ?? false,
    isComposing: false,
  }
}

/**
 * State manager class
 */
export class StateManager<T> {
  private state: SelectState<T>
  private listeners = new Set<(state: SelectState<T>) => void>()

  constructor(initialState: SelectState<T>) {
    this.state = initialState
  }

  /**
   * Get current state
   */
  getState(): SelectState<T> {
    return this.state
  }

  /**
   * Update state with partial updates
   */
  setState(updates: Partial<SelectState<T>>): void {
    const prevState = this.state
    this.state = { ...prevState, ...updates }

    // Only notify if state actually changed
    if (this.state !== prevState) {
      this.notify()
    }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: SelectState<T>) => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Notify all listeners of state change
   */
  private notify(): void {
    const currentState = this.state
    this.listeners.forEach((listener) => {
      listener(currentState)
    })
  }

  /**
   * Get the number of subscribers
   */
  getSubscriberCount(): number {
    return this.listeners.size
  }

  /**
   * Clear all subscribers
   */
  clearSubscribers(): void {
    this.listeners.clear()
  }
}

/**
 * Get highlighted option from state
 */
export function getHighlightedOption<T>(state: SelectState<T>): SelectOption<T> | null {
  const { filteredOptions, highlightedIndex } = state
  if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
    return filteredOptions[highlightedIndex] ?? null
  }
  return null
}

/**
 * Calculate next highlighted index
 */
export function getNextHighlightedIndex<T>(
  state: SelectState<T>,
  direction: 'next' | 'prev' | 'first' | 'last' | 'pageDown' | 'pageUp'
): number {
  const { filteredOptions, highlightedIndex } = state
  const count = filteredOptions.length

  if (count === 0) return -1

  // Find next non-disabled option
  const findNonDisabled = (startIndex: number, increment: number): number => {
    let index = startIndex
    let iterations = 0

    while (iterations < count) {
      const option = filteredOptions[index]
      if (option && !option.disabled) {
        return index
      }
      index = (index + increment + count) % count
      iterations++
    }

    return -1
  }

  switch (direction) {
    case 'next': {
      const start = highlightedIndex < 0 ? 0 : (highlightedIndex + 1) % count
      return findNonDisabled(start, 1)
    }
    case 'prev': {
      const start = highlightedIndex < 0 ? count - 1 : (highlightedIndex - 1 + count) % count
      return findNonDisabled(start, -1)
    }
    case 'first':
      return findNonDisabled(0, 1)
    case 'last':
      return findNonDisabled(count - 1, -1)
    case 'pageDown': {
      const pageSize = 10
      const targetIndex = Math.min(highlightedIndex + pageSize, count - 1)
      return findNonDisabled(targetIndex, -1)
    }
    case 'pageUp': {
      const pageSize = 10
      const targetIndex = Math.max(highlightedIndex - pageSize, 0)
      return findNonDisabled(targetIndex, 1)
    }
    default:
      return highlightedIndex
  }
}
