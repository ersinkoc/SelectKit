import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  isElementVisible,
  scrollIntoView,
  getScrollParent,
  containsElement,
  focusElement,
  blurElement,
  isBrowser,
  preventEvent,
} from '../../../src/utils/dom'

describe('dom utilities', () => {
  describe('isElementVisible', () => {
    it('should return true when element is fully visible', () => {
      const container = {
        getBoundingClientRect: () => ({ top: 0, bottom: 100 }),
      } as HTMLElement
      const element = {
        getBoundingClientRect: () => ({ top: 10, bottom: 50 }),
      } as HTMLElement

      expect(isElementVisible(element, container)).toBe(true)
    })

    it('should return false when element is above container', () => {
      const container = {
        getBoundingClientRect: () => ({ top: 50, bottom: 150 }),
      } as HTMLElement
      const element = {
        getBoundingClientRect: () => ({ top: 10, bottom: 40 }),
      } as HTMLElement

      expect(isElementVisible(element, container)).toBe(false)
    })

    it('should return false when element is below container', () => {
      const container = {
        getBoundingClientRect: () => ({ top: 0, bottom: 100 }),
      } as HTMLElement
      const element = {
        getBoundingClientRect: () => ({ top: 110, bottom: 150 }),
      } as HTMLElement

      expect(isElementVisible(element, container)).toBe(false)
    })
  })

  describe('scrollIntoView', () => {
    it('should scroll up when element is above visible area', () => {
      const container = {
        scrollTop: 100,
        getBoundingClientRect: () => ({ top: 100, bottom: 200 }),
      } as HTMLElement
      const element = {
        getBoundingClientRect: () => ({ top: 50, bottom: 80 }),
      } as HTMLElement

      scrollIntoView(element, container)

      expect(container.scrollTop).toBe(50)
    })

    it('should scroll down when element is below visible area', () => {
      const container = {
        scrollTop: 0,
        getBoundingClientRect: () => ({ top: 0, bottom: 100 }),
      } as HTMLElement
      const element = {
        getBoundingClientRect: () => ({ top: 150, bottom: 180 }),
      } as HTMLElement

      scrollIntoView(element, container)

      expect(container.scrollTop).toBe(80)
    })

    it('should not scroll when element is visible', () => {
      const container = {
        scrollTop: 50,
        getBoundingClientRect: () => ({ top: 0, bottom: 100 }),
      } as HTMLElement
      const element = {
        getBoundingClientRect: () => ({ top: 10, bottom: 50 }),
      } as HTMLElement

      scrollIntoView(element, container)

      expect(container.scrollTop).toBe(50)
    })
  })

  describe('getScrollParent', () => {
    it('should return parent with overflow scroll', () => {
      const scrollParent = document.createElement('div')
      scrollParent.style.overflowY = 'scroll'

      const child = document.createElement('div')
      scrollParent.appendChild(child)
      document.body.appendChild(scrollParent)

      const result = getScrollParent(child)
      expect(result).toBe(scrollParent)

      document.body.removeChild(scrollParent)
    })

    it('should return parent with overflow auto', () => {
      const scrollParent = document.createElement('div')
      scrollParent.style.overflowY = 'auto'

      const child = document.createElement('div')
      scrollParent.appendChild(child)
      document.body.appendChild(scrollParent)

      const result = getScrollParent(child)
      expect(result).toBe(scrollParent)

      document.body.removeChild(scrollParent)
    })

    it('should return document element if no scroll parent found', () => {
      const element = document.createElement('div')
      document.body.appendChild(element)

      const result = getScrollParent(element)
      expect(result).toBe(document.documentElement)

      document.body.removeChild(element)
    })
  })

  describe('containsElement', () => {
    it('should return true when target is child of parent', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      parent.appendChild(child)

      expect(containsElement(parent, child)).toBe(true)
    })

    it('should return true when target is the parent itself', () => {
      const parent = document.createElement('div')
      expect(containsElement(parent, parent)).toBe(true)
    })

    it('should return false when target is not a child', () => {
      const parent = document.createElement('div')
      const other = document.createElement('span')

      expect(containsElement(parent, other)).toBe(false)
    })

    it('should return false when parent is null', () => {
      const other = document.createElement('span')
      expect(containsElement(null, other)).toBe(false)
    })

    it('should return false when target is null', () => {
      const parent = document.createElement('div')
      expect(containsElement(parent, null)).toBe(false)
    })

    it('should return false when target is not a Node', () => {
      const parent = document.createElement('div')
      expect(containsElement(parent, {} as EventTarget)).toBe(false)
    })
  })

  describe('focusElement', () => {
    it('should focus the element', () => {
      const element = document.createElement('input')
      element.focus = vi.fn()

      focusElement(element)

      expect(element.focus).toHaveBeenCalled()
    })

    it('should handle null element', () => {
      expect(() => focusElement(null)).not.toThrow()
    })
  })

  describe('blurElement', () => {
    it('should blur the element', () => {
      const element = document.createElement('input')
      element.blur = vi.fn()

      blurElement(element)

      expect(element.blur).toHaveBeenCalled()
    })

    it('should handle null element', () => {
      expect(() => blurElement(null)).not.toThrow()
    })
  })

  describe('isBrowser', () => {
    it('should return true in browser environment', () => {
      expect(isBrowser()).toBe(true)
    })
  })

  describe('preventEvent', () => {
    it('should prevent default and stop propagation', () => {
      const event = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as Event

      preventEvent(event)

      expect(event.preventDefault).toHaveBeenCalled()
      expect(event.stopPropagation).toHaveBeenCalled()
    })
  })
})
