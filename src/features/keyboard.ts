import type { Select } from '../core/select'

export type KeyAction = 'next' | 'prev' | 'first' | 'last' | 'pageDown' | 'pageUp' | 'select' | 'close' | 'open' | 'toggle' | 'clear' | 'backspace' | 'create'

export interface KeyBinding {
  key: string
  action: KeyAction
  when?: 'open' | 'closed' | 'always'
  withModifiers?: {
    shift?: boolean
    ctrl?: boolean
    alt?: boolean
    meta?: boolean
  }
}

/**
 * Default key bindings
 */
export const defaultKeyBindings: KeyBinding[] = [
  // Navigation (when open)
  { key: 'ArrowDown', action: 'next', when: 'open' },
  { key: 'ArrowUp', action: 'prev', when: 'open' },
  { key: 'Home', action: 'first', when: 'open' },
  { key: 'End', action: 'last', when: 'open' },
  { key: 'PageDown', action: 'pageDown', when: 'open' },
  { key: 'PageUp', action: 'pageUp', when: 'open' },

  // Selection
  { key: 'Enter', action: 'select', when: 'open' },
  { key: ' ', action: 'select', when: 'open' }, // Space (only for non-searchable)

  // Open/close
  { key: 'ArrowDown', action: 'open', when: 'closed' },
  { key: 'ArrowUp', action: 'open', when: 'closed' },
  { key: 'Enter', action: 'open', when: 'closed' },
  { key: ' ', action: 'open', when: 'closed' },
  { key: 'Escape', action: 'close', when: 'open' },

  // Clear
  { key: 'Backspace', action: 'backspace', when: 'open' },
  { key: 'Delete', action: 'clear', when: 'always' },
]

/**
 * Check if modifiers match
 */
function matchModifiers(
  event: KeyboardEvent,
  required?: KeyBinding['withModifiers']
): boolean {
  if (!required) return true

  if (required.shift !== undefined && event.shiftKey !== required.shift) return false
  if (required.ctrl !== undefined && event.ctrlKey !== required.ctrl) return false
  if (required.alt !== undefined && event.altKey !== required.alt) return false
  if (required.meta !== undefined && event.metaKey !== required.meta) return false

  return true
}

/**
 * Find matching key binding
 */
function findBinding(
  event: KeyboardEvent,
  isOpen: boolean,
  bindings: KeyBinding[] = defaultKeyBindings
): KeyBinding | undefined {
  return bindings.find((binding) => {
    // Check key
    if (binding.key !== event.key) return false

    // Check when condition
    if (binding.when === 'open' && !isOpen) return false
    if (binding.when === 'closed' && isOpen) return false

    // Check modifiers
    if (!matchModifiers(event, binding.withModifiers)) return false

    return true
  })
}

/**
 * Handle keyboard events
 */
export function handleKeyDown<T>(
  select: Select<T>,
  event: KeyboardEvent
): boolean {
  const state = select.getState()
  const config = select.getConfig()

  // Don't handle if composing (IME)
  if (state.isComposing) return false

  // Don't handle if disabled
  if (state.isDisabled) return false

  const binding = findBinding(event, state.isOpen)

  if (!binding) {
    // Handle character input for type-ahead
    if (!state.isOpen && config.searchable && isCharacterKey(event)) {
      event.preventDefault()
      select.open()
      select.setSearchValue(event.key)
      return true
    }
    return false
  }

  // Special handling for space in searchable mode
  if (binding.key === ' ' && config.searchable && state.isOpen) {
    // Let space be typed in search input
    return false
  }

  event.preventDefault()

  switch (binding.action) {
    case 'next':
      select.highlightNext()
      break

    case 'prev':
      select.highlightPrev()
      break

    case 'first':
      select.highlightFirst()
      break

    case 'last':
      select.highlightLast()
      break

    case 'pageDown':
      select.highlightNextPage()
      break

    case 'pageUp':
      select.highlightPrevPage()
      break

    case 'select':
      if (state.isOpen) {
        const highlighted = select.getHighlightedOption()
        if (highlighted) {
          select.selectOption(highlighted)
        } else if (config.creatable && select.shouldShowCreate()) {
          select.createOption(state.searchValue)
        }
      }
      break

    case 'open':
      select.open()
      break

    case 'close':
      // If searchable and has search, clear search first
      if (config.searchable && state.searchValue) {
        select.clearSearch()
      } else {
        select.close()
      }
      break

    case 'toggle':
      select.toggle()
      break

    case 'clear':
      if (config.clearable) {
        select.clearValue()
      }
      break

    case 'backspace':
      // In multi-select, remove last tag when input is empty
      if (config.multiple && !state.searchValue && state.selectedOptions.length > 0) {
        const lastOption = state.selectedOptions[state.selectedOptions.length - 1]
        if (lastOption) {
          select.deselectOption(lastOption)
        }
      }
      break

    case 'create':
      if (config.creatable && select.shouldShowCreate()) {
        select.createOption(state.searchValue)
      }
      break
  }

  return true
}

/**
 * Check if a key event is a printable character
 */
function isCharacterKey(event: KeyboardEvent): boolean {
  // Single character and no modifier keys (except shift)
  return (
    event.key.length === 1 &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.metaKey
  )
}

/**
 * Handle Tab key specially
 */
export function handleTab<T>(
  select: Select<T>,
  event: KeyboardEvent
): boolean {
  if (event.key !== 'Tab') return false

  const state = select.getState()

  if (state.isOpen) {
    // Close on tab
    select.close()
  }

  // Don't prevent default - allow normal tab behavior
  return false
}

/**
 * Create custom key bindings
 */
export function createKeyBindings(
  customBindings: Partial<Record<KeyAction, string[]>>
): KeyBinding[] {
  const bindings: KeyBinding[] = []

  for (const [action, keys] of Object.entries(customBindings)) {
    for (const key of keys ?? []) {
      bindings.push({
        key,
        action: action as KeyAction,
        when: 'always',
      })
    }
  }

  return bindings
}

/**
 * Merge key bindings
 */
export function mergeKeyBindings(
  base: KeyBinding[],
  overrides: KeyBinding[]
): KeyBinding[] {
  // Create a map of override keys
  const overrideKeys = new Set(overrides.map((b) => `${b.key}-${b.when ?? 'always'}`))

  // Filter out base bindings that are overridden
  const filtered = base.filter((b) => {
    const key = `${b.key}-${b.when ?? 'always'}`
    return !overrideKeys.has(key)
  })

  return [...filtered, ...overrides]
}
