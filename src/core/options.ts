import type { GroupedOptions, Options, SelectOption } from '../types'
import { isGroupedOptions } from '../types'

export interface NormalizedOptions<T> {
  flat: SelectOption<T>[]
  grouped: GroupedOptions<T>[]
  hasGroups: boolean
}

/**
 * Normalize options to a consistent format
 */
export function normalizeOptions<T>(options: Options<T>): NormalizedOptions<T> {
  if (!Array.isArray(options) || options.length === 0) {
    return { flat: [], grouped: [], hasGroups: false }
  }

  if (isGroupedOptions(options)) {
    // Already grouped format
    const grouped = options as GroupedOptions<T>[]
    const flat = flattenOptions(grouped)
    return { flat, grouped, hasGroups: true }
  }

  // Flat options - check if they have group property
  const flatOptions = options as SelectOption<T>[]
  const hasGroupProperty = flatOptions.some((opt) => opt.group !== undefined)

  if (hasGroupProperty) {
    // Group by the group property
    const grouped = groupOptionsByProperty(flatOptions)
    return { flat: flatOptions, grouped, hasGroups: true }
  }

  // Plain flat options
  return { flat: flatOptions, grouped: [], hasGroups: false }
}

/**
 * Flatten grouped options into a single array
 */
export function flattenOptions<T>(grouped: GroupedOptions<T>[]): SelectOption<T>[] {
  return grouped.flatMap((group) => group.options)
}

/**
 * Group flat options by their group property
 */
export function groupOptionsByProperty<T>(options: SelectOption<T>[]): GroupedOptions<T>[] {
  const groups = new Map<string, SelectOption<T>[]>()
  const ungrouped: SelectOption<T>[] = []

  for (const option of options) {
    if (option.group !== undefined) {
      const existing = groups.get(option.group)
      if (existing) {
        existing.push(option)
      } else {
        groups.set(option.group, [option])
      }
    } else {
      ungrouped.push(option)
    }
  }

  const result: GroupedOptions<T>[] = []

  // Add grouped options
  for (const [label, groupOptions] of groups) {
    result.push({ label, options: groupOptions })
  }

  // Add ungrouped options as a separate group if there are any
  if (ungrouped.length > 0) {
    result.push({ label: '', options: ungrouped })
  }

  return result
}

/**
 * Find an option by its value
 */
export function findOptionByValue<T>(
  options: SelectOption<T>[],
  value: T
): SelectOption<T> | undefined {
  return options.find((option) => option.value === value)
}

/**
 * Find multiple options by their values
 */
export function findOptionsByValue<T>(
  options: SelectOption<T>[],
  value: T | T[] | null
): SelectOption<T>[] {
  if (value === null) return []

  if (Array.isArray(value)) {
    return value
      .map((v) => findOptionByValue(options, v))
      .filter((opt): opt is SelectOption<T> => opt !== undefined)
  }

  const found = findOptionByValue(options, value)
  return found ? [found] : []
}

/**
 * Check if an option is selected
 */
export function isOptionSelected<T>(
  option: SelectOption<T>,
  selectedOptions: SelectOption<T>[]
): boolean {
  return selectedOptions.some((selected) => selected.value === option.value)
}

/**
 * Add an option to the selected list
 */
export function addToSelection<T>(
  selectedOptions: SelectOption<T>[],
  option: SelectOption<T>,
  maxSelected?: number
): SelectOption<T>[] {
  // Check if already selected
  if (isOptionSelected(option, selectedOptions)) {
    return selectedOptions
  }

  // Check max limit
  if (maxSelected !== undefined && selectedOptions.length >= maxSelected) {
    return selectedOptions
  }

  return [...selectedOptions, option]
}

/**
 * Remove an option from the selected list
 */
export function removeFromSelection<T>(
  selectedOptions: SelectOption<T>[],
  option: SelectOption<T>,
  minSelected?: number
): SelectOption<T>[] {
  // Check min limit
  if (minSelected !== undefined && selectedOptions.length <= minSelected) {
    return selectedOptions
  }

  return selectedOptions.filter((selected) => selected.value !== option.value)
}

/**
 * Toggle an option in the selected list
 */
export function toggleSelection<T>(
  selectedOptions: SelectOption<T>[],
  option: SelectOption<T>,
  config: { maxSelected?: number | undefined; minSelected?: number | undefined } = {}
): SelectOption<T>[] {
  if (isOptionSelected(option, selectedOptions)) {
    return removeFromSelection(selectedOptions, option, config.minSelected)
  }
  return addToSelection(selectedOptions, option, config.maxSelected)
}

/**
 * Get values from selected options
 */
export function getValuesFromOptions<T>(
  options: SelectOption<T>[],
  multiple: boolean
): T | T[] | null {
  if (options.length === 0) {
    return multiple ? [] : null
  }

  if (multiple) {
    return options.map((opt) => opt.value)
  }

  return options[0]?.value ?? null
}

/**
 * Compare two options for equality
 */
export function areOptionsEqual<T>(a: SelectOption<T>, b: SelectOption<T>): boolean {
  return a.value === b.value
}

/**
 * Get the index of an option in a list
 */
export function getOptionIndex<T>(
  options: SelectOption<T>[],
  option: SelectOption<T>
): number {
  return options.findIndex((opt) => opt.value === option.value)
}
