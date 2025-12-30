import { describe, it, expect, vi } from 'vitest'
import { EventEmitter } from '../../../src/core/events'

interface TestEvents {
  test: [value: string]
  multi: [a: number, b: string]
  empty: []
}

describe('EventEmitter', () => {
  it('should emit events to subscribers', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('test', handler)
    emitter.emit('test', 'value')

    expect(handler).toHaveBeenCalledWith('value')
  })

  it('should support multiple handlers for same event', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    emitter.on('test', handler1)
    emitter.on('test', handler2)
    emitter.emit('test', 'value')

    expect(handler1).toHaveBeenCalledWith('value')
    expect(handler2).toHaveBeenCalledWith('value')
  })

  it('should support multiple arguments', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('multi', handler)
    emitter.emit('multi', 42, 'hello')

    expect(handler).toHaveBeenCalledWith(42, 'hello')
  })

  it('should support events with no arguments', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('empty', handler)
    emitter.emit('empty')

    expect(handler).toHaveBeenCalledWith()
  })

  describe('on', () => {
    it('should return unsubscribe function', () => {
      const emitter = new EventEmitter<TestEvents>()
      const handler = vi.fn()

      const unsubscribe = emitter.on('test', handler)

      emitter.emit('test', 'first')
      expect(handler).toHaveBeenCalledTimes(1)

      unsubscribe()

      emitter.emit('test', 'second')
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('off', () => {
    it('should remove a specific handler', () => {
      const emitter = new EventEmitter<TestEvents>()
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      emitter.on('test', handler1)
      emitter.on('test', handler2)

      emitter.off('test', handler1)
      emitter.emit('test', 'value')

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).toHaveBeenCalled()
    })

    it('should handle removing non-existent handler', () => {
      const emitter = new EventEmitter<TestEvents>()
      const handler = vi.fn()

      expect(() => emitter.off('test', handler)).not.toThrow()
    })

    it('should clean up empty handler sets', () => {
      const emitter = new EventEmitter<TestEvents>()
      const handler = vi.fn()

      emitter.on('test', handler)
      emitter.off('test', handler)

      expect(emitter.listenerCount('test')).toBe(0)
    })
  })

  describe('emit', () => {
    it('should not throw when no handlers exist', () => {
      const emitter = new EventEmitter<TestEvents>()

      expect(() => emitter.emit('test', 'value')).not.toThrow()
    })

    it('should catch and log errors in handlers', () => {
      const emitter = new EventEmitter<TestEvents>()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error')
      })
      const normalHandler = vi.fn()

      emitter.on('test', errorHandler)
      emitter.on('test', normalHandler)

      emitter.emit('test', 'value')

      expect(consoleSpy).toHaveBeenCalled()
      expect(normalHandler).toHaveBeenCalled() // Should still call other handlers

      consoleSpy.mockRestore()
    })
  })

  describe('removeAllListeners', () => {
    it('should remove all handlers', () => {
      const emitter = new EventEmitter<TestEvents>()
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      emitter.on('test', handler1)
      emitter.on('multi', handler2)

      emitter.removeAllListeners()

      emitter.emit('test', 'value')
      emitter.emit('multi', 1, 'str')

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).not.toHaveBeenCalled()
    })
  })

  describe('listenerCount', () => {
    it('should return the number of listeners', () => {
      const emitter = new EventEmitter<TestEvents>()

      expect(emitter.listenerCount('test')).toBe(0)

      emitter.on('test', vi.fn())
      expect(emitter.listenerCount('test')).toBe(1)

      emitter.on('test', vi.fn())
      expect(emitter.listenerCount('test')).toBe(2)
    })
  })
})
