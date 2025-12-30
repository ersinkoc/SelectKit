import { describe, it, expect, vi } from 'vitest'
import {
  createInitialState,
  StateManager,
  getHighlightedOption,
  getNextHighlightedIndex,
} from '../../../src/core/state'
import { basicOptions, optionsWithDisabled } from '../../fixtures/options'

describe('state', () => {
  describe('createInitialState', () => {
    it('should create initial state with defaults', () => {
      const state = createInitialState({
        options: basicOptions,
      })

      expect(state.isOpen).toBe(false)
      expect(state.value).toBeNull()
      expect(state.selectedOptions).toEqual([])
      expect(state.searchValue).toBe('')
      expect(state.highlightedIndex).toBe(-1)
      expect(state.highlightedOption).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.isFocused).toBe(false)
      expect(state.isDisabled).toBe(false)
      expect(state.isComposing).toBe(false)
    })

    it('should use defaultValue for initial value', () => {
      const state = createInitialState({
        options: basicOptions,
        defaultValue: 'apple',
      })

      expect(state.value).toBe('apple')
      expect(state.selectedOptions).toHaveLength(1)
      expect(state.selectedOptions[0]?.value).toBe('apple')
    })

    it('should use value over defaultValue', () => {
      const state = createInitialState({
        options: basicOptions,
        value: 'banana',
        defaultValue: 'apple',
      })

      expect(state.value).toBe('banana')
    })

    it('should handle multiple default values', () => {
      const state = createInitialState({
        options: basicOptions,
        multiple: true,
        defaultValue: ['apple', 'banana'],
      })

      expect(state.value).toEqual(['apple', 'banana'])
      expect(state.selectedOptions).toHaveLength(2)
    })

    it('should handle disabled state', () => {
      const state = createInitialState({
        options: basicOptions,
        disabled: true,
      })

      expect(state.isDisabled).toBe(true)
    })

    it('should normalize options', () => {
      const state = createInitialState({
        options: basicOptions,
      })

      expect(state.flatOptions).toEqual(basicOptions)
      expect(state.filteredOptions).toEqual(basicOptions)
    })
  })

  describe('StateManager', () => {
    it('should get current state', () => {
      const initialState = createInitialState({ options: basicOptions })
      const manager = new StateManager(initialState)

      expect(manager.getState()).toBe(initialState)
    })

    it('should update state', () => {
      const initialState = createInitialState({ options: basicOptions })
      const manager = new StateManager(initialState)

      manager.setState({ isOpen: true })

      expect(manager.getState().isOpen).toBe(true)
      expect(manager.getState().isDisabled).toBe(false) // Other values preserved
    })

    it('should notify subscribers on state change', () => {
      const initialState = createInitialState({ options: basicOptions })
      const manager = new StateManager(initialState)
      const subscriber = vi.fn()

      manager.subscribe(subscriber)
      manager.setState({ isOpen: true })

      expect(subscriber).toHaveBeenCalledWith(manager.getState())
    })

    it('should return unsubscribe function', () => {
      const initialState = createInitialState({ options: basicOptions })
      const manager = new StateManager(initialState)
      const subscriber = vi.fn()

      const unsubscribe = manager.subscribe(subscriber)
      manager.setState({ isOpen: true })
      expect(subscriber).toHaveBeenCalledTimes(1)

      unsubscribe()
      manager.setState({ isOpen: false })
      expect(subscriber).toHaveBeenCalledTimes(1)
    })

    it('should support multiple subscribers', () => {
      const initialState = createInitialState({ options: basicOptions })
      const manager = new StateManager(initialState)
      const subscriber1 = vi.fn()
      const subscriber2 = vi.fn()

      manager.subscribe(subscriber1)
      manager.subscribe(subscriber2)
      manager.setState({ isOpen: true })

      expect(subscriber1).toHaveBeenCalled()
      expect(subscriber2).toHaveBeenCalled()
    })

    it('should get subscriber count', () => {
      const initialState = createInitialState({ options: basicOptions })
      const manager = new StateManager(initialState)

      expect(manager.getSubscriberCount()).toBe(0)

      const unsub1 = manager.subscribe(vi.fn())
      expect(manager.getSubscriberCount()).toBe(1)

      manager.subscribe(vi.fn())
      expect(manager.getSubscriberCount()).toBe(2)

      unsub1()
      expect(manager.getSubscriberCount()).toBe(1)
    })

    it('should clear all subscribers', () => {
      const initialState = createInitialState({ options: basicOptions })
      const manager = new StateManager(initialState)
      const subscriber = vi.fn()

      manager.subscribe(subscriber)
      manager.clearSubscribers()
      manager.setState({ isOpen: true })

      expect(subscriber).not.toHaveBeenCalled()
      expect(manager.getSubscriberCount()).toBe(0)
    })
  })

  describe('getHighlightedOption', () => {
    it('should return highlighted option when valid index', () => {
      const state = createInitialState({ options: basicOptions })
      state.highlightedIndex = 1
      state.filteredOptions = basicOptions

      const highlighted = getHighlightedOption(state)

      expect(highlighted).toBe(basicOptions[1])
    })

    it('should return null when index is -1', () => {
      const state = createInitialState({ options: basicOptions })
      state.highlightedIndex = -1

      expect(getHighlightedOption(state)).toBeNull()
    })

    it('should return null when index is out of bounds', () => {
      const state = createInitialState({ options: basicOptions })
      state.highlightedIndex = 100

      expect(getHighlightedOption(state)).toBeNull()
    })
  })

  describe('getNextHighlightedIndex', () => {
    it('should get next index', () => {
      const state = createInitialState({ options: basicOptions })
      state.filteredOptions = basicOptions
      state.highlightedIndex = 0

      expect(getNextHighlightedIndex(state, 'next')).toBe(1)
    })

    it('should wrap around when at end', () => {
      const state = createInitialState({ options: basicOptions })
      state.filteredOptions = basicOptions
      state.highlightedIndex = basicOptions.length - 1

      expect(getNextHighlightedIndex(state, 'next')).toBe(0)
    })

    it('should get previous index', () => {
      const state = createInitialState({ options: basicOptions })
      state.filteredOptions = basicOptions
      state.highlightedIndex = 2

      expect(getNextHighlightedIndex(state, 'prev')).toBe(1)
    })

    it('should wrap around when at start', () => {
      const state = createInitialState({ options: basicOptions })
      state.filteredOptions = basicOptions
      state.highlightedIndex = 0

      expect(getNextHighlightedIndex(state, 'prev')).toBe(basicOptions.length - 1)
    })

    it('should get first non-disabled index', () => {
      const state = createInitialState({ options: optionsWithDisabled })
      state.filteredOptions = optionsWithDisabled

      expect(getNextHighlightedIndex(state, 'first')).toBe(0)
    })

    it('should get last non-disabled index', () => {
      const state = createInitialState({ options: optionsWithDisabled })
      state.filteredOptions = optionsWithDisabled

      expect(getNextHighlightedIndex(state, 'last')).toBe(4)
    })

    it('should skip disabled options when going next', () => {
      const state = createInitialState({ options: optionsWithDisabled })
      state.filteredOptions = optionsWithDisabled
      state.highlightedIndex = 0

      // Index 1 is disabled, should skip to 2
      expect(getNextHighlightedIndex(state, 'next')).toBe(2)
    })

    it('should handle pageDown', () => {
      const state = createInitialState({ options: basicOptions })
      state.filteredOptions = basicOptions
      state.highlightedIndex = 0

      const result = getNextHighlightedIndex(state, 'pageDown')
      expect(result).toBe(basicOptions.length - 1) // Clamped to end
    })

    it('should handle pageUp', () => {
      const state = createInitialState({ options: basicOptions })
      state.filteredOptions = basicOptions
      state.highlightedIndex = basicOptions.length - 1

      const result = getNextHighlightedIndex(state, 'pageUp')
      expect(result).toBe(0)
    })

    it('should return -1 when no options', () => {
      const state = createInitialState({ options: [] })
      state.filteredOptions = []

      expect(getNextHighlightedIndex(state, 'next')).toBe(-1)
    })

    it('should start at 0 when highlightedIndex is -1 for next', () => {
      const state = createInitialState({ options: basicOptions })
      state.filteredOptions = basicOptions
      state.highlightedIndex = -1

      expect(getNextHighlightedIndex(state, 'next')).toBe(0)
    })

    it('should start at end when highlightedIndex is -1 for prev', () => {
      const state = createInitialState({ options: basicOptions })
      state.filteredOptions = basicOptions
      state.highlightedIndex = -1

      expect(getNextHighlightedIndex(state, 'prev')).toBe(basicOptions.length - 1)
    })
  })
})
