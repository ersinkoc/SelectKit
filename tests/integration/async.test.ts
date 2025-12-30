import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createSelect } from '../../src/core/select'
import { basicOptions } from '../fixtures/options'

describe('Async Select Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('loadOptions', () => {
    it('should load options on search', async () => {
      const loadOptions = vi.fn(async (search: string) => {
        return basicOptions.filter(o =>
          o.label.toLowerCase().includes(search.toLowerCase())
        )
      })

      const select = createSelect({
        options: [],
        searchable: true,
        loadOptions,
      })

      select.open()
      select.setSearchValue('app')

      // Wait for async load
      await vi.runAllTimersAsync()

      expect(loadOptions).toHaveBeenCalledWith('app', expect.any(AbortSignal))
      expect(select.getState().filteredOptions).toHaveLength(1)
      expect(select.getState().filteredOptions[0]?.value).toBe('apple')
    })

    it('should show loading state', async () => {
      const loadOptions = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return basicOptions
      })

      const select = createSelect({
        options: [],
        searchable: true,
        loadOptions,
      })

      select.setSearchValue('test')

      expect(select.isLoading()).toBe(true)

      await vi.advanceTimersByTimeAsync(100)

      expect(select.isLoading()).toBe(false)
    })

    it('should emit loading events', async () => {
      const loadingHandler = vi.fn()
      const loadOptions = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
        return basicOptions
      })

      const select = createSelect({
        options: [],
        searchable: true,
        loadOptions,
      })

      select.on('loading', loadingHandler)
      select.setSearchValue('test')

      expect(loadingHandler).toHaveBeenCalledWith(true)

      await vi.advanceTimersByTimeAsync(50)

      expect(loadingHandler).toHaveBeenCalledWith(false)
    })

    it('should cancel previous request on new search', async () => {
      let aborted = false
      const loadOptions = vi.fn(async (search: string, signal: AbortSignal) => {
        return new Promise<typeof basicOptions>((resolve, reject) => {
          const timeout = setTimeout(() => resolve(basicOptions), 100)
          signal.addEventListener('abort', () => {
            clearTimeout(timeout)
            aborted = true
            reject(new DOMException('Aborted', 'AbortError'))
          })
        })
      })

      const select = createSelect({
        options: [],
        searchable: true,
        loadOptions,
      })

      select.setSearchValue('first')
      await vi.advanceTimersByTimeAsync(50) // Midway through

      select.setSearchValue('second') // Cancel first

      expect(aborted).toBe(true)
    })

    it('should handle load errors gracefully', async () => {
      const errorHandler = vi.fn()
      const loadOptions = vi.fn(async () => {
        throw new Error('Network error')
      })

      const select = createSelect({
        options: [],
        searchable: true,
        loadOptions,
      })

      select.on('error', errorHandler)
      select.setSearchValue('test')

      await vi.runAllTimersAsync()

      expect(errorHandler).toHaveBeenCalled()
      expect(select.isLoading()).toBe(false)
    })
  })

  describe('debounced search', () => {
    it('should debounce search', async () => {
      const loadOptions = vi.fn(async () => basicOptions)

      const select = createSelect({
        options: [],
        searchable: true,
        loadOptions,
        searchDebounce: 300,
      })

      select.setSearchValue('a')
      select.setSearchValue('ap')
      select.setSearchValue('app')

      expect(loadOptions).not.toHaveBeenCalled()

      await vi.advanceTimersByTimeAsync(300)

      expect(loadOptions).toHaveBeenCalledTimes(1)
      expect(loadOptions).toHaveBeenCalledWith('app', expect.any(AbortSignal))
    })
  })

  describe('minSearchLength', () => {
    it('should not search below minimum length', async () => {
      const loadOptions = vi.fn(async () => basicOptions)

      const select = createSelect({
        options: [],
        searchable: true,
        loadOptions,
        minSearchLength: 2,
      })

      select.setSearchValue('a')
      await vi.runAllTimersAsync()

      expect(loadOptions).not.toHaveBeenCalled()

      select.setSearchValue('ap')
      await vi.runAllTimersAsync()

      expect(loadOptions).toHaveBeenCalled()
    })
  })

  describe('async with selection', () => {
    it('should allow selecting loaded options', async () => {
      const loadOptions = vi.fn(async () => basicOptions)

      const select = createSelect({
        options: [],
        searchable: true,
        loadOptions,
      })

      select.setSearchValue('test')
      await vi.runAllTimersAsync()

      select.selectOption(basicOptions[0]!)

      expect(select.getValue()).toBe('apple')
    })
  })

  describe('loadingMessage', () => {
    it('should return loading message', async () => {
      const loadOptions = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return basicOptions
      })

      const select = createSelect({
        options: [],
        searchable: true,
        loadOptions,
        loadingMessage: 'Searching...',
      })

      select.setSearchValue('test')

      expect(select.getLoadingMessage()).toBe('Searching...')
    })
  })
})
