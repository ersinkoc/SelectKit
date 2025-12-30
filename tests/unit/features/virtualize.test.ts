import { describe, it, expect, vi } from 'vitest'
import {
  calculateVirtualWindow,
  getItemOffset,
  getItemHeight,
  getTotalHeight,
  getVirtualItems,
  findIndexAtOffset,
  scrollToIndex,
  createHeightEstimator,
  VirtualScroller,
} from '../../../src/features/virtualize'
import { largeOptionsList } from '../../fixtures/options'

describe('virtualize', () => {
  describe('calculateVirtualWindow', () => {
    it('should calculate window with fixed height', () => {
      const result = calculateVirtualWindow(0, {
        itemHeight: 40,
        containerHeight: 200,
        totalItems: 100,
        overscan: 3,
      })

      expect(result.startIndex).toBe(0)
      expect(result.endIndex).toBeLessThanOrEqual(100)
      expect(result.totalHeight).toBe(4000) // 100 * 40
      expect(result.visibleItems).toBe(5) // 200 / 40
    })

    it('should handle scroll position', () => {
      const result = calculateVirtualWindow(200, {
        itemHeight: 40,
        containerHeight: 200,
        totalItems: 100,
        overscan: 3,
      })

      expect(result.startIndex).toBe(2) // 5 - 3 overscan
      expect(result.offsetTop).toBe(80) // 2 * 40
    })

    it('should calculate window with variable height', () => {
      const itemHeight = (i: number) => (i % 2 === 0 ? 40 : 60)

      const result = calculateVirtualWindow(0, {
        itemHeight,
        containerHeight: 200,
        totalItems: 10,
        overscan: 2,
      })

      expect(result.startIndex).toBe(0)
      expect(result.totalHeight).toBe(500) // 5 * 40 + 5 * 60
    })

    it('should handle empty list', () => {
      const result = calculateVirtualWindow(0, {
        itemHeight: 40,
        containerHeight: 200,
        totalItems: 0,
      })

      expect(result.startIndex).toBe(0)
      expect(result.endIndex).toBe(0)
      expect(result.totalHeight).toBe(0)
    })

    it('should apply default overscan', () => {
      const result = calculateVirtualWindow(0, {
        itemHeight: 40,
        containerHeight: 200,
        totalItems: 100,
      })

      // Default overscan is 5
      expect(result.startIndex).toBe(0)
    })
  })

  describe('getItemOffset', () => {
    it('should calculate offset with fixed height', () => {
      expect(getItemOffset(0, 40)).toBe(0)
      expect(getItemOffset(5, 40)).toBe(200)
      expect(getItemOffset(10, 40)).toBe(400)
    })

    it('should calculate offset with variable height', () => {
      const itemHeight = (i: number) => (i % 2 === 0 ? 40 : 60)

      expect(getItemOffset(0, itemHeight)).toBe(0)
      expect(getItemOffset(1, itemHeight)).toBe(40)
      expect(getItemOffset(2, itemHeight)).toBe(100) // 40 + 60
      expect(getItemOffset(3, itemHeight)).toBe(140) // 40 + 60 + 40
    })
  })

  describe('getItemHeight', () => {
    it('should return fixed height', () => {
      expect(getItemHeight(0, 40)).toBe(40)
      expect(getItemHeight(5, 40)).toBe(40)
    })

    it('should call height function', () => {
      const itemHeight = vi.fn((i: number) => 40 + i)
      expect(getItemHeight(5, itemHeight)).toBe(45)
      expect(itemHeight).toHaveBeenCalledWith(5)
    })
  })

  describe('getTotalHeight', () => {
    it('should calculate total with fixed height', () => {
      expect(getTotalHeight(10, 40)).toBe(400)
      expect(getTotalHeight(100, 50)).toBe(5000)
    })

    it('should calculate total with variable height', () => {
      const itemHeight = (i: number) => 40 + (i * 2)

      expect(getTotalHeight(5, itemHeight)).toBe(
        40 + 42 + 44 + 46 + 48
      )
    })
  })

  describe('getVirtualItems', () => {
    it('should return virtual items', () => {
      const options = largeOptionsList.slice(0, 10)
      const virtualState = {
        startIndex: 2,
        endIndex: 5,
        offsetTop: 80,
        totalHeight: 400,
        visibleItems: 3,
      }

      const items = getVirtualItems(options, virtualState, 40)

      expect(items).toHaveLength(3)
      expect(items[0]?.index).toBe(2)
      expect(items[0]?.offsetTop).toBe(80)
      expect(items[0]?.height).toBe(40)
    })

    it('should handle variable heights', () => {
      const options = largeOptionsList.slice(0, 10)
      const virtualState = {
        startIndex: 0,
        endIndex: 3,
        offsetTop: 0,
        totalHeight: 300,
        visibleItems: 3,
      }
      const itemHeight = (i: number) => 40 + (i * 10)

      const items = getVirtualItems(options, virtualState, itemHeight)

      expect(items[0]?.height).toBe(40)
      expect(items[1]?.height).toBe(50)
      expect(items[1]?.offsetTop).toBe(40)
    })
  })

  describe('findIndexAtOffset', () => {
    it('should find index with fixed height', () => {
      expect(findIndexAtOffset(0, 100, 40)).toBe(0)
      expect(findIndexAtOffset(40, 100, 40)).toBe(1)
      expect(findIndexAtOffset(85, 100, 40)).toBe(2)
    })

    it('should find index with variable height', () => {
      const itemHeight = (i: number) => (i % 2 === 0 ? 40 : 60)

      expect(findIndexAtOffset(0, 10, itemHeight)).toBe(0)
      expect(findIndexAtOffset(40, 10, itemHeight)).toBe(1)
      expect(findIndexAtOffset(100, 10, itemHeight)).toBe(2)
    })

    it('should return -1 for empty list', () => {
      expect(findIndexAtOffset(100, 0, 40)).toBe(-1)
    })

    it('should clamp to last index', () => {
      expect(findIndexAtOffset(1000, 10, 40)).toBe(9)
    })
  })

  describe('scrollToIndex', () => {
    it('should scroll to bring item into view (above)', () => {
      const container = {
        scrollTop: 200,
        clientHeight: 200,
      } as HTMLElement

      scrollToIndex(container, 2, 40)

      expect(container.scrollTop).toBe(80) // 2 * 40
    })

    it('should scroll to bring item into view (below)', () => {
      const container = {
        scrollTop: 0,
        clientHeight: 200,
      } as HTMLElement

      scrollToIndex(container, 10, 40)

      expect(container.scrollTop).toBe(240) // (10 * 40 + 40) - 200
    })

    it('should not scroll if item is visible', () => {
      const container = {
        scrollTop: 100,
        clientHeight: 200,
      } as HTMLElement

      scrollToIndex(container, 5, 40) // Item at 200, visible in 100-300

      expect(container.scrollTop).toBe(100)
    })

    it('should scroll to start', () => {
      const container = {
        scrollTop: 200,
        clientHeight: 200,
      } as HTMLElement

      scrollToIndex(container, 3, 40, 'start')

      expect(container.scrollTop).toBe(120)
    })

    it('should scroll to center', () => {
      const container = {
        scrollTop: 0,
        clientHeight: 200,
      } as HTMLElement

      scrollToIndex(container, 5, 40, 'center')

      // Item at 200, center = 200 - (200 - 40) / 2 = 120
      expect(container.scrollTop).toBe(120)
    })

    it('should scroll to end', () => {
      const container = {
        scrollTop: 0,
        clientHeight: 200,
      } as HTMLElement

      scrollToIndex(container, 5, 40, 'end')

      // Item at 200 + 40 - 200 = 40
      expect(container.scrollTop).toBe(40)
    })
  })

  describe('createHeightEstimator', () => {
    it('should return measured height', () => {
      const measured = new Map<number, number>()
      measured.set(5, 80)

      const estimator = createHeightEstimator(measured, 40)

      expect(estimator(5)).toBe(80)
    })

    it('should return default for unmeasured', () => {
      const measured = new Map<number, number>()
      const estimator = createHeightEstimator(measured, 40)

      expect(estimator(5)).toBe(40)
    })
  })

  describe('VirtualScroller', () => {
    it('should manage scroll state', () => {
      const scroller = new VirtualScroller(40)

      expect(scroller.getScrollTop()).toBe(0)

      scroller.setScrollTop(100)
      expect(scroller.getScrollTop()).toBe(100)
    })

    it('should measure items', () => {
      const scroller = new VirtualScroller(40)

      scroller.measureItem(5, 80)
      expect(scroller.getItemHeight(5)).toBe(80)
      expect(scroller.getItemHeight(6)).toBe(40) // Default
    })

    it('should get virtual state', () => {
      const scroller = new VirtualScroller(40)
      const options = largeOptionsList.slice(0, 100)

      const state = scroller.getVirtualState(options, 200)

      expect(state.totalHeight).toBe(4000)
      expect(state.visibleItems).toBeGreaterThan(0)
    })

    it('should get virtual items', () => {
      const scroller = new VirtualScroller(40)
      const options = largeOptionsList.slice(0, 100)

      const items = scroller.getVirtualItems(options, 200)

      expect(items.length).toBeGreaterThan(0)
      expect(items[0]?.option).toBe(options[0])
    })

    it('should scroll to index', () => {
      const scroller = new VirtualScroller(40)
      const container = {
        scrollTop: 0,
        clientHeight: 200,
      } as HTMLElement

      scroller.scrollToIndex(container, 10)

      expect(container.scrollTop).toBe(240)
    })

    it('should reset state', () => {
      const scroller = new VirtualScroller(40)

      scroller.setScrollTop(100)
      scroller.measureItem(5, 80)
      scroller.reset()

      expect(scroller.getScrollTop()).toBe(0)
      expect(scroller.getItemHeight(5)).toBe(40) // Back to default
    })
  })
})
