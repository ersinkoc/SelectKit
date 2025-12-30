let counter = 0

/**
 * Generate a unique ID with optional prefix
 */
export function generateId(prefix = 'selectkit'): string {
  counter += 1
  return `${prefix}-${counter}`
}

/**
 * Reset the ID counter (for testing)
 */
export function resetIdCounter(): void {
  counter = 0
}

/**
 * Get the option ID for a given base ID and index
 */
export function getOptionId(baseId: string, index: number): string {
  return `${baseId}-option-${index}`
}

/**
 * Get the menu ID for a given base ID
 */
export function getMenuId(baseId: string): string {
  return `${baseId}-menu`
}

/**
 * Get the trigger ID for a given base ID
 */
export function getTriggerId(baseId: string): string {
  return `${baseId}-trigger`
}

/**
 * Get the input ID for a given base ID
 */
export function getInputId(baseId: string): string {
  return `${baseId}-input`
}

/**
 * Get the group label ID for a given base ID and index
 */
export function getGroupLabelId(baseId: string, index: number): string {
  return `${baseId}-group-${index}`
}
