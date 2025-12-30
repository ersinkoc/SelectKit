import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  AsyncLoader,
  createCachedLoader,
  createFetchLoader,
  combineLoaders,
  withRetry,
} from '../../../src/features/async'
import { basicOptions } from '../../fixtures/options'

describe('async', () => {
  describe('AsyncLoader', () => {
    it('should load options', async () => {
      const loader = new AsyncLoader()
      const loadFn = vi.fn(async () => basicOptions)

      const result = await loader.load(loadFn, 'test')

      expect(result).toEqual(basicOptions)
      expect(loadFn).toHaveBeenCalledWith('test', expect.any(AbortSignal))
    })

    it('should cancel previous request', async () => {
      const loader = new AsyncLoader()
      let aborted = false

      const loadFn = vi.fn(async (search: string, signal: AbortSignal) => {
        return new Promise<typeof basicOptions>((resolve, reject) => {
          const timeout = setTimeout(() => resolve(basicOptions), 100)
          signal.addEventListener('abort', () => {
            clearTimeout(timeout)
            aborted = true
            reject(new DOMException('Aborted', 'AbortError'))
          })
        })
      })

      // Start first request
      const promise1 = loader.load(loadFn, 'first')

      // Immediately start second request (cancels first)
      const promise2 = loader.load(loadFn, 'second')

      await Promise.all([promise1.catch(() => {}), promise2])

      expect(aborted).toBe(true)
    })

    it('should return empty array for aborted requests', async () => {
      const loader = new AsyncLoader()
      const loadFn = vi.fn(async () => {
        throw new DOMException('Aborted', 'AbortError')
      })

      const result = await loader.load(loadFn, 'test')
      expect(result).toEqual([])
    })

    it('should rethrow non-abort errors', async () => {
      const loader = new AsyncLoader()
      const loadFn = vi.fn(async () => {
        throw new Error('Network error')
      })

      await expect(loader.load(loadFn, 'test')).rejects.toThrow('Network error')
    })

    it('should cache results when enabled', async () => {
      const loader = new AsyncLoader()
      const loadFn = vi.fn(async () => basicOptions)

      await loader.load(loadFn, 'test', { cacheResults: true })
      await loader.load(loadFn, 'test', { cacheResults: true })

      expect(loadFn).toHaveBeenCalledTimes(1)
    })

    it('should return cached results', async () => {
      const loader = new AsyncLoader()
      const loadFn = vi.fn(async () => basicOptions)

      await loader.load(loadFn, 'test', { cacheResults: true })
      const cached = loader.getCached('test')

      expect(cached).toEqual(basicOptions)
    })

    it('should cancel current request', () => {
      const loader = new AsyncLoader()
      const loadFn = vi.fn(async () => basicOptions)

      loader.load(loadFn, 'test')
      expect(loader.isLoading()).toBe(true)

      loader.cancel()
      expect(loader.isLoading()).toBe(false)
    })

    it('should clear cache', async () => {
      const loader = new AsyncLoader()
      const loadFn = vi.fn(async () => basicOptions)

      await loader.load(loadFn, 'test', { cacheResults: true })
      loader.clearCache()

      expect(loader.getCached('test')).toBeUndefined()
    })

    it('should track load count', async () => {
      const loader = new AsyncLoader()
      const loadFn = vi.fn(async () => basicOptions)

      expect(loader.getLoadCount()).toBe(0)

      await loader.load(loadFn, 'test')
      expect(loader.getLoadCount()).toBe(1)

      await loader.load(loadFn, 'test2')
      expect(loader.getLoadCount()).toBe(2)
    })
  })

  describe('createCachedLoader', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should cache results', async () => {
      const baseFn = vi.fn(async () => basicOptions)
      const cached = createCachedLoader(baseFn)
      const signal = new AbortController().signal

      await cached('test', signal)
      await cached('test', signal)

      expect(baseFn).toHaveBeenCalledTimes(1)
    })

    it('should expire cache after TTL', async () => {
      const baseFn = vi.fn(async () => basicOptions)
      const cached = createCachedLoader(baseFn, { ttlMs: 1000 })
      const signal = new AbortController().signal

      await cached('test', signal)

      vi.advanceTimersByTime(1001)

      await cached('test', signal)

      expect(baseFn).toHaveBeenCalledTimes(2)
    })

    it('should prune cache when exceeding max size', async () => {
      const baseFn = vi.fn(async () => basicOptions)
      const cached = createCachedLoader(baseFn, { maxCacheSize: 2 })
      const signal = new AbortController().signal

      await cached('a', signal)
      await cached('b', signal)
      await cached('c', signal) // Should remove 'a'
      await cached('a', signal) // Should load again

      expect(baseFn).toHaveBeenCalledTimes(4)
    })
  })

  describe('createFetchLoader', () => {
    beforeEach(() => {
      global.fetch = vi.fn()
    })

    it('should fetch from URL', async () => {
      const mockResponse = { json: () => Promise.resolve(basicOptions), ok: true }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as Response)

      const loader = createFetchLoader('/api/search')
      const signal = new AbortController().signal

      const result = await loader('test', signal)

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/search?q=test',
        expect.objectContaining({ signal })
      )
      expect(result).toEqual(basicOptions)
    })

    it('should use URL function', async () => {
      const mockResponse = { json: () => Promise.resolve(basicOptions), ok: true }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as Response)

      const loader = createFetchLoader((s) => `/api/search/${s}`)
      const signal = new AbortController().signal

      await loader('test', signal)

      expect(global.fetch).toHaveBeenCalledWith('/api/search/test', expect.anything())
    })

    it('should transform response', async () => {
      const mockResponse = {
        json: () => Promise.resolve({ data: basicOptions }),
        ok: true,
      }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as Response)

      const loader = createFetchLoader('/api', {
        transformResponse: (data: any) => data.data,
      })
      const signal = new AbortController().signal

      const result = await loader('test', signal)
      expect(result).toEqual(basicOptions)
    })

    it('should throw on HTTP error', async () => {
      const mockResponse = { ok: false, status: 404 }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as Response)

      const loader = createFetchLoader('/api')
      const signal = new AbortController().signal

      await expect(loader('test', signal)).rejects.toThrow('HTTP error: 404')
    })
  })

  describe('combineLoaders', () => {
    it('should combine results from multiple loaders', async () => {
      const loader1 = vi.fn(async () => [basicOptions[0]!])
      const loader2 = vi.fn(async () => [basicOptions[1]!])

      const combined = combineLoaders([loader1, loader2])
      const signal = new AbortController().signal

      const result = await combined('test', signal)

      expect(result).toHaveLength(2)
      expect(result).toContainEqual(basicOptions[0])
      expect(result).toContainEqual(basicOptions[1])
    })

    it('should handle loader errors gracefully', async () => {
      const loader1 = vi.fn(async () => [basicOptions[0]!])
      const loader2 = vi.fn(async () => {
        throw new Error('fail')
      })

      const combined = combineLoaders([loader1, loader2])
      const signal = new AbortController().signal

      const result = await combined('test', signal)

      expect(result).toHaveLength(1)
    })
  })

  describe('withRetry', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should retry on failure', async () => {
      let attempts = 0
      const loader = vi.fn(async () => {
        attempts++
        if (attempts < 3) throw new Error('fail')
        return basicOptions
      })

      const retrying = withRetry(loader, { maxRetries: 3, delayMs: 100 })
      const signal = new AbortController().signal

      const promise = retrying('test', signal)

      // Advance through retries
      await vi.advanceTimersByTimeAsync(100)
      await vi.advanceTimersByTimeAsync(200)

      const result = await promise
      expect(result).toEqual(basicOptions)
      expect(attempts).toBe(3)
    })

    it('should not retry on abort', async () => {
      const loader = vi.fn(async () => {
        throw new DOMException('Aborted', 'AbortError')
      })

      const retrying = withRetry(loader, { maxRetries: 3 })
      const signal = new AbortController().signal

      await expect(retrying('test', signal)).rejects.toThrow()
      expect(loader).toHaveBeenCalledTimes(1)
    })

    it('should throw after max retries', async () => {
      const loader = vi.fn(async () => {
        throw new Error('fail')
      })

      const retrying = withRetry(loader, { maxRetries: 2, delayMs: 10, backoff: false })
      const signal = new AbortController().signal

      // Use a different approach - catch the error explicitly
      let caughtError: Error | null = null
      const promise = retrying('test', signal).catch(e => {
        caughtError = e
      })

      // Run all timers to completion
      await vi.runAllTimersAsync()
      await promise

      expect(caughtError).toBeInstanceOf(Error)
      expect(caughtError?.message).toBe('fail')
      expect(loader).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })

    it('should use exponential backoff', async () => {
      let callTimes: number[] = []
      const loader = vi.fn(async () => {
        callTimes.push(Date.now())
        if (callTimes.length < 3) throw new Error('fail')
        return basicOptions
      })

      const retrying = withRetry(loader, { maxRetries: 3, delayMs: 100, backoff: true })
      const signal = new AbortController().signal

      const promise = retrying('test', signal)

      await vi.advanceTimersByTimeAsync(100) // First retry
      await vi.advanceTimersByTimeAsync(200) // Second retry (backoff: 100 * 2)

      await promise
      expect(loader).toHaveBeenCalledTimes(3)
    })
  })
})
