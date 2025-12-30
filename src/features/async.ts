import type { SelectOption } from '../types'

export interface AsyncConfig<T> {
  loadOptions: (search: string, signal: AbortSignal) => Promise<SelectOption<T>[]>
  debounceMs?: number
  minSearchLength?: number
  cacheResults?: boolean
}

export interface AsyncState {
  isLoading: boolean
  error: Error | null
  loadCount: number
}

/**
 * Async options loader with abort support
 */
export class AsyncLoader<T> {
  private controller: AbortController | null = null
  private cache = new Map<string, SelectOption<T>[]>()
  private loadCount = 0

  /**
   * Load options with abort controller
   */
  async load(
    loadFn: (search: string, signal: AbortSignal) => Promise<SelectOption<T>[]>,
    search: string,
    config: { cacheResults?: boolean } = {}
  ): Promise<SelectOption<T>[]> {
    // Check cache first
    if (config.cacheResults && this.cache.has(search)) {
      return this.cache.get(search)!
    }

    // Cancel previous request
    this.cancel()

    // Create new controller
    this.controller = new AbortController()
    this.loadCount++

    try {
      const options = await loadFn(search, this.controller.signal)

      // Cache result if enabled
      if (config.cacheResults) {
        this.cache.set(search, options)
      }

      return options
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, return empty
        return []
      }
      throw error
    } finally {
      this.controller = null
    }
  }

  /**
   * Cancel the current request
   */
  cancel(): void {
    if (this.controller) {
      this.controller.abort()
      this.controller = null
    }
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache entry
   */
  getCached(search: string): SelectOption<T>[] | undefined {
    return this.cache.get(search)
  }

  /**
   * Check if currently loading
   */
  isLoading(): boolean {
    return this.controller !== null
  }

  /**
   * Get load count (for testing)
   */
  getLoadCount(): number {
    return this.loadCount
  }
}

/**
 * Create a cached loader function
 */
export function createCachedLoader<T>(
  loadFn: (search: string, signal: AbortSignal) => Promise<SelectOption<T>[]>,
  options: {
    maxCacheSize?: number
    ttlMs?: number
  } = {}
): (search: string, signal: AbortSignal) => Promise<SelectOption<T>[]> {
  const cache = new Map<string, { options: SelectOption<T>[]; timestamp: number }>()
  const { maxCacheSize = 100, ttlMs = 5 * 60 * 1000 } = options

  return async (search: string, signal: AbortSignal): Promise<SelectOption<T>[]> => {
    const now = Date.now()

    // Check cache
    const cached = cache.get(search)
    if (cached && now - cached.timestamp < ttlMs) {
      return cached.options
    }

    // Load fresh data
    const result = await loadFn(search, signal)

    // Update cache
    cache.set(search, { options: result, timestamp: now })

    // Prune cache if needed
    if (cache.size > maxCacheSize) {
      const oldestKey = cache.keys().next().value
      if (oldestKey !== undefined) {
        cache.delete(oldestKey)
      }
    }

    return result
  }
}

/**
 * Create a fetch-based loader
 */
export function createFetchLoader<T>(
  url: string | ((search: string) => string),
  options: {
    transformResponse?: (data: unknown) => SelectOption<T>[]
    headers?: HeadersInit
    credentials?: RequestCredentials
  } = {}
): (search: string, signal: AbortSignal) => Promise<SelectOption<T>[]> {
  const {
    transformResponse = (data) => data as SelectOption<T>[],
    headers,
    credentials,
  } = options

  return async (search: string, signal: AbortSignal): Promise<SelectOption<T>[]> => {
    const endpoint = typeof url === 'function' ? url(search) : `${url}?q=${encodeURIComponent(search)}`

    const fetchOptions: RequestInit = { signal }
    if (headers) fetchOptions.headers = headers
    if (credentials) fetchOptions.credentials = credentials

    const response = await fetch(endpoint, fetchOptions)

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const data = await response.json()
    return transformResponse(data)
  }
}

/**
 * Combine multiple loaders
 */
export function combineLoaders<T>(
  loaders: Array<(search: string, signal: AbortSignal) => Promise<SelectOption<T>[]>>
): (search: string, signal: AbortSignal) => Promise<SelectOption<T>[]> {
  return async (search: string, signal: AbortSignal): Promise<SelectOption<T>[]> => {
    const results = await Promise.all(
      loaders.map((loader) => loader(search, signal).catch(() => []))
    )
    return results.flat()
  }
}

/**
 * Add retry logic to a loader
 */
export function withRetry<T>(
  loader: (search: string, signal: AbortSignal) => Promise<SelectOption<T>[]>,
  options: {
    maxRetries?: number
    delayMs?: number
    backoff?: boolean
  } = {}
): (search: string, signal: AbortSignal) => Promise<SelectOption<T>[]> {
  const { maxRetries = 3, delayMs = 1000, backoff = true } = options

  return async (search: string, signal: AbortSignal): Promise<SelectOption<T>[]> => {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await loader(search, signal)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw error // Don't retry aborted requests
        }

        lastError = error as Error

        if (attempt < maxRetries) {
          const delay = backoff ? delayMs * Math.pow(2, attempt) : delayMs
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError
  }
}
