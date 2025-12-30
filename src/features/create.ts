import type { SelectOption } from '../types'

export interface CreateConfig<T> {
  onCreate?: (inputValue: string) => SelectOption<T> | Promise<SelectOption<T>> | null
  createMessage?: string | ((search: string) => string)
  allowDuplicates?: boolean
}

/**
 * Check if we should show the create option
 */
export function shouldShowCreate<T>(
  searchValue: string,
  filteredOptions: SelectOption<T>[],
  config: CreateConfig<T>
): boolean {
  // Must have search value
  const search = searchValue.trim()
  if (!search) return false

  // Must have onCreate handler
  if (!config.onCreate) return false

  // Check for duplicates unless allowed
  if (!config.allowDuplicates) {
    const exists = filteredOptions.some(
      (opt) => opt.label.toLowerCase() === search.toLowerCase()
    )
    if (exists) return false
  }

  return true
}

/**
 * Get the create option message
 */
export function getCreateMessage<T>(
  searchValue: string,
  config: CreateConfig<T>
): string {
  const { createMessage } = config

  if (typeof createMessage === 'function') {
    return createMessage(searchValue)
  }

  return createMessage ?? `Create "${searchValue}"`
}

/**
 * Create a new option from input value
 */
export async function createNewOption<T>(
  inputValue: string,
  config: CreateConfig<T>
): Promise<SelectOption<T> | null> {
  if (!config.onCreate) return null

  try {
    const result = await Promise.resolve(config.onCreate(inputValue))
    return result
  } catch (error) {
    console.error('Error creating option:', error)
    return null
  }
}

/**
 * Create a simple option from a string value
 */
export function createSimpleOption<T = string>(
  value: string
): SelectOption<T> {
  return {
    value: value as T,
    label: value,
  }
}

/**
 * Create an option with a generated ID
 */
export function createOptionWithId<T>(
  label: string,
  idPrefix = 'created'
): SelectOption<T> {
  const id = `${idPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  return {
    value: id as T,
    label,
  }
}

/**
 * Validate option before creation
 */
export type ValidationResult =
  | { valid: true }
  | { valid: false; message: string }

export function validateCreateValue(
  value: string,
  validators: Array<(value: string) => ValidationResult>
): ValidationResult {
  for (const validator of validators) {
    const result = validator(value)
    if (!result.valid) {
      return result
    }
  }
  return { valid: true }
}

/**
 * Common validators
 */
export const validators = {
  minLength: (min: number) => (value: string): ValidationResult => {
    if (value.length < min) {
      return { valid: false, message: `Must be at least ${min} characters` }
    }
    return { valid: true }
  },

  maxLength: (max: number) => (value: string): ValidationResult => {
    if (value.length > max) {
      return { valid: false, message: `Must be at most ${max} characters` }
    }
    return { valid: true }
  },

  pattern: (regex: RegExp, message: string) => (value: string): ValidationResult => {
    if (!regex.test(value)) {
      return { valid: false, message }
    }
    return { valid: true }
  },

  noWhitespace: (value: string): ValidationResult => {
    if (/\s/.test(value)) {
      return { valid: false, message: 'Cannot contain whitespace' }
    }
    return { valid: true }
  },

  trimmed: (value: string): ValidationResult => {
    if (value !== value.trim()) {
      return { valid: false, message: 'Cannot have leading or trailing whitespace' }
    }
    return { valid: true }
  },

  email: (value: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return { valid: false, message: 'Must be a valid email address' }
    }
    return { valid: true }
  },
}
