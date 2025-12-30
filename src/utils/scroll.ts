/**
 * Scroll to a specific index in a container
 */
export function scrollToIndex(
  container: HTMLElement,
  index: number,
  itemHeight: number | ((index: number) => number)
): void {
  const height = typeof itemHeight === 'function' ? itemHeight(index) : itemHeight
  let offsetTop = 0

  if (typeof itemHeight === 'function') {
    // Calculate offset for variable heights
    for (let i = 0; i < index; i++) {
      offsetTop += itemHeight(i)
    }
  } else {
    offsetTop = index * itemHeight
  }

  const containerHeight = container.clientHeight
  const scrollTop = container.scrollTop

  // Check if item is above visible area
  if (offsetTop < scrollTop) {
    container.scrollTop = offsetTop
  }
  // Check if item is below visible area
  else if (offsetTop + height > scrollTop + containerHeight) {
    container.scrollTop = offsetTop + height - containerHeight
  }
}

/**
 * Scroll to ensure an element is visible
 */
export function scrollToElement(
  container: HTMLElement,
  element: HTMLElement
): void {
  const containerRect = container.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()

  const isAbove = elementRect.top < containerRect.top
  const isBelow = elementRect.bottom > containerRect.bottom

  if (isAbove) {
    container.scrollTop -= containerRect.top - elementRect.top
  } else if (isBelow) {
    container.scrollTop += elementRect.bottom - containerRect.bottom
  }
}

/**
 * Get the visible range of indices in a virtualized list
 */
export function getVisibleRange(
  scrollTop: number,
  containerHeight: number,
  totalItems: number,
  itemHeight: number | ((index: number) => number),
  overscan = 3
): { start: number; end: number } {
  let start = 0
  let end = 0
  let currentOffset = 0

  if (typeof itemHeight === 'number') {
    // Fixed height calculation
    start = Math.floor(scrollTop / itemHeight)
    end = Math.ceil((scrollTop + containerHeight) / itemHeight)
  } else {
    // Variable height calculation
    // Find start index
    for (let i = 0; i < totalItems; i++) {
      const height = itemHeight(i)
      if (currentOffset + height > scrollTop) {
        start = i
        break
      }
      currentOffset += height
    }

    // Find end index
    currentOffset = 0
    for (let i = 0; i < totalItems; i++) {
      currentOffset += itemHeight(i)
      if (currentOffset >= scrollTop + containerHeight) {
        end = i + 1
        break
      }
    }

    if (end === 0) {
      end = totalItems
    }
  }

  // Apply overscan
  start = Math.max(0, start - overscan)
  end = Math.min(totalItems, end + overscan)

  return { start, end }
}
