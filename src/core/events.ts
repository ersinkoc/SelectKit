/**
 * Type-safe event emitter
 */
export class EventEmitter<Events extends { [K: string]: unknown[] }> {
  private handlers = new Map<keyof Events, Set<(...args: unknown[]) => void>>()

  /**
   * Subscribe to an event
   */
  on<E extends keyof Events>(
    event: E,
    handler: (...args: Events[E]) => void
  ): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    const handlers = this.handlers.get(event)!
    handlers.add(handler as (...args: unknown[]) => void)

    // Return unsubscribe function
    return () => this.off(event, handler)
  }

  /**
   * Unsubscribe from an event
   */
  off<E extends keyof Events>(
    event: E,
    handler: (...args: Events[E]) => void
  ): void {
    const handlers = this.handlers.get(event)
    if (handlers) {
      handlers.delete(handler as (...args: unknown[]) => void)
      if (handlers.size === 0) {
        this.handlers.delete(event)
      }
    }
  }

  /**
   * Emit an event
   */
  emit<E extends keyof Events>(event: E, ...args: Events[E]): void {
    const handlers = this.handlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(...args)
        } catch (error) {
          console.error(`Error in event handler for "${String(event)}":`, error)
        }
      })
    }
  }

  /**
   * Remove all event handlers
   */
  removeAllListeners(): void {
    this.handlers.clear()
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount<E extends keyof Events>(event: E): number {
    return this.handlers.get(event)?.size ?? 0
  }
}
