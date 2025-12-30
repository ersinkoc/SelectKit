import type { SelectOption, VirtualItem, VirtualState } from '../types'

export interface VirtualConfig {
  itemHeight: number | ((index: number) => number)
  containerHeight: number
  overscan?: number
  totalItems: number
}

/**
 * Calculate the virtual window state
 */
export function calculateVirtualWindow(
  scrollTop: number,
  config: VirtualConfig
): VirtualState {
  const { itemHeight, containerHeight, totalItems, overscan = 5 } = config

  if (totalItems === 0) {
    return {
      startIndex: 0,
      endIndex: 0,
      offsetTop: 0,
      totalHeight: 0,
      visibleItems: 0,
    }
  }

  // Calculate total height
  const totalHeight = getTotalHeight(totalItems, itemHeight)

  // Find start index
  let startIndex = 0
  let accumulatedHeight = 0

  if (typeof itemHeight === 'number') {
    startIndex = Math.floor(scrollTop / itemHeight)
    accumulatedHeight = startIndex * itemHeight
  } else {
    for (let i = 0; i < totalItems; i++) {
      const height = itemHeight(i)
      if (accumulatedHeight + height > scrollTop) {
        startIndex = i
        break
      }
      accumulatedHeight += height
    }
  }

  // Calculate visible count
  let visibleItems = 0

  if (typeof itemHeight === 'number') {
    visibleItems = Math.ceil(containerHeight / itemHeight)
  } else {
    let height = 0
    for (let i = startIndex; i < totalItems; i++) {
      height += itemHeight(i)
      visibleItems++
      if (height >= containerHeight) break
    }
  }

  // Apply overscan
  const overscanStart = Math.max(0, startIndex - overscan)
  const overscanEnd = Math.min(totalItems, startIndex + visibleItems + overscan)

  // Calculate offset for overscan start
  const offsetTop = getItemOffset(overscanStart, itemHeight)

  return {
    startIndex: overscanStart,
    endIndex: overscanEnd,
    offsetTop,
    totalHeight,
    visibleItems,
  }
}

/**
 * Get the offset for an item at a given index
 */
export function getItemOffset(
  index: number,
  itemHeight: number | ((index: number) => number)
): number {
  if (typeof itemHeight === 'number') {
    return index * itemHeight
  }

  let offset = 0
  for (let i = 0; i < index; i++) {
    offset += itemHeight(i)
  }
  return offset
}

/**
 * Get the height of an item at a given index
 */
export function getItemHeight(
  index: number,
  itemHeight: number | ((index: number) => number)
): number {
  return typeof itemHeight === 'number' ? itemHeight : itemHeight(index)
}

/**
 * Get the total height of all items
 */
export function getTotalHeight(
  totalItems: number,
  itemHeight: number | ((index: number) => number)
): number {
  if (typeof itemHeight === 'number') {
    return totalItems * itemHeight
  }

  let total = 0
  for (let i = 0; i < totalItems; i++) {
    total += itemHeight(i)
  }
  return total
}

/**
 * Get virtual items for rendering
 */
export function getVirtualItems<T>(
  options: SelectOption<T>[],
  virtualState: VirtualState,
  itemHeight: number | ((index: number) => number)
): VirtualItem<T>[] {
  const items: VirtualItem<T>[] = []
  let currentOffset = virtualState.offsetTop

  for (let i = virtualState.startIndex; i < virtualState.endIndex; i++) {
    const option = options[i]
    if (!option) continue

    const height = getItemHeight(i, itemHeight)

    items.push({
      index: i,
      option,
      offsetTop: currentOffset,
      height,
    })

    currentOffset += height
  }

  return items
}

/**
 * Find the index of an item at a given scroll position
 */
export function findIndexAtOffset(
  offset: number,
  totalItems: number,
  itemHeight: number | ((index: number) => number)
): number {
  if (totalItems === 0) return -1

  if (typeof itemHeight === 'number') {
    return Math.min(Math.floor(offset / itemHeight), totalItems - 1)
  }

  let accumulatedHeight = 0
  for (let i = 0; i < totalItems; i++) {
    const height = itemHeight(i)
    if (accumulatedHeight + height > offset) {
      return i
    }
    accumulatedHeight += height
  }

  return totalItems - 1
}

/**
 * Scroll to a specific index
 */
export function scrollToIndex(
  container: HTMLElement,
  index: number,
  itemHeight: number | ((index: number) => number),
  align: 'start' | 'center' | 'end' | 'auto' = 'auto'
): void {
  const offset = getItemOffset(index, itemHeight)
  const height = getItemHeight(index, itemHeight)
  const containerHeight = container.clientHeight
  const scrollTop = container.scrollTop

  let newScrollTop: number

  switch (align) {
    case 'start':
      newScrollTop = offset
      break
    case 'center':
      newScrollTop = offset - (containerHeight - height) / 2
      break
    case 'end':
      newScrollTop = offset - containerHeight + height
      break
    case 'auto':
    default:
      if (offset < scrollTop) {
        // Item is above viewport
        newScrollTop = offset
      } else if (offset + height > scrollTop + containerHeight) {
        // Item is below viewport
        newScrollTop = offset + height - containerHeight
      } else {
        // Item is visible, no scroll needed
        return
      }
  }

  container.scrollTop = Math.max(0, newScrollTop)
}

/**
 * Create a height estimator for variable heights
 */
export function createHeightEstimator(
  measuredHeights: Map<number, number>,
  defaultHeight: number
): (index: number) => number {
  return (index: number): number => {
    return measuredHeights.get(index) ?? defaultHeight
  }
}

/**
 * Virtual scroller class for managing scroll state
 */
export class VirtualScroller<T> {
  private scrollTop = 0
  private measuredHeights = new Map<number, number>()
  private defaultHeight: number

  constructor(defaultHeight: number) {
    this.defaultHeight = defaultHeight
  }

  getItemHeight = (index: number): number => {
    return this.measuredHeights.get(index) ?? this.defaultHeight
  }

  measureItem(index: number, height: number): void {
    this.measuredHeights.set(index, height)
  }

  setScrollTop(scrollTop: number): void {
    this.scrollTop = scrollTop
  }

  getScrollTop(): number {
    return this.scrollTop
  }

  getVirtualState(options: SelectOption<T>[], containerHeight: number): VirtualState {
    return calculateVirtualWindow(this.scrollTop, {
      itemHeight: this.getItemHeight,
      containerHeight,
      totalItems: options.length,
    })
  }

  getVirtualItems(options: SelectOption<T>[], containerHeight: number): VirtualItem<T>[] {
    const state = this.getVirtualState(options, containerHeight)
    return getVirtualItems(options, state, this.getItemHeight)
  }

  scrollToIndex(container: HTMLElement, index: number): void {
    scrollToIndex(container, index, this.getItemHeight)
  }

  reset(): void {
    this.scrollTop = 0
    this.measuredHeights.clear()
  }
}
