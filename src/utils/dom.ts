/**
 * Check if an element is visible within a container
 */
export function isElementVisible(element: HTMLElement, container: HTMLElement): boolean {
  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  return (
    elementRect.top >= containerRect.top &&
    elementRect.bottom <= containerRect.bottom
  )
}

/**
 * Scroll an element into view within a container
 */
export function scrollIntoView(element: HTMLElement, container: HTMLElement): void {
  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  if (elementRect.top < containerRect.top) {
    // Element is above the visible area
    container.scrollTop -= containerRect.top - elementRect.top
  } else if (elementRect.bottom > containerRect.bottom) {
    // Element is below the visible area
    container.scrollTop += elementRect.bottom - containerRect.bottom
  }
}

/**
 * Get the scroll parent of an element
 */
export function getScrollParent(element: HTMLElement): HTMLElement {
  let parent: HTMLElement | null = element.parentElement

  while (parent) {
    const style = getComputedStyle(parent)
    const overflowY = style.overflowY

    if (overflowY === 'auto' || overflowY === 'scroll') {
      return parent
    }

    parent = parent.parentElement
  }

  return document.documentElement
}

/**
 * Check if the element or its descendants contain the target
 */
export function containsElement(parent: HTMLElement | null, target: EventTarget | null): boolean {
  if (!parent || !target || !(target instanceof Node)) {
    return false
  }
  return parent.contains(target)
}

/**
 * Focus an element safely
 */
export function focusElement(element: HTMLElement | null): void {
  if (element && typeof element.focus === 'function') {
    element.focus()
  }
}

/**
 * Blur an element safely
 */
export function blurElement(element: HTMLElement | null): void {
  if (element && typeof element.blur === 'function') {
    element.blur()
  }
}

/**
 * Check if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * Prevent default and stop propagation
 */
export function preventEvent(e: Event): void {
  e.preventDefault()
  e.stopPropagation()
}
