import type { SelectOption } from '../types'
import {
  addToSelection,
  isOptionSelected,
  removeFromSelection,
  toggleSelection,
} from '../core/options'

export interface MultiSelectConfig {
  maxSelected?: number
  minSelected?: number
}

/**
 * Check if we can add more selections
 */
export function canAddSelection<T>(
  selectedOptions: SelectOption<T>[],
  maxSelected?: number
): boolean {
  if (maxSelected === undefined) return true
  return selectedOptions.length < maxSelected
}

/**
 * Check if we can remove selections
 */
export function canRemoveSelection<T>(
  selectedOptions: SelectOption<T>[],
  minSelected?: number
): boolean {
  if (minSelected === undefined) return true
  return selectedOptions.length > minSelected
}

/**
 * Get the number of remaining selections allowed
 */
export function getRemainingSelections<T>(
  selectedOptions: SelectOption<T>[],
  maxSelected?: number
): number {
  if (maxSelected === undefined) return Infinity
  return Math.max(0, maxSelected - selectedOptions.length)
}

/**
 * Select multiple options at once
 */
export function selectMultiple<T>(
  selectedOptions: SelectOption<T>[],
  optionsToSelect: SelectOption<T>[],
  config: MultiSelectConfig = {}
): SelectOption<T>[] {
  let result = [...selectedOptions]

  for (const option of optionsToSelect) {
    if (!canAddSelection(result, config.maxSelected)) break
    if (!isOptionSelected(option, result)) {
      result = addToSelection(result, option, config.maxSelected)
    }
  }

  return result
}

/**
 * Deselect multiple options at once
 */
export function deselectMultiple<T>(
  selectedOptions: SelectOption<T>[],
  optionsToDeselect: SelectOption<T>[],
  config: MultiSelectConfig = {}
): SelectOption<T>[] {
  let result = [...selectedOptions]

  for (const option of optionsToDeselect) {
    if (!canRemoveSelection(result, config.minSelected)) break
    result = removeFromSelection(result, option, config.minSelected)
  }

  return result
}

/**
 * Select all options
 */
export function selectAll<T>(
  allOptions: SelectOption<T>[],
  selectedOptions: SelectOption<T>[],
  config: MultiSelectConfig = {}
): SelectOption<T>[] {
  const selectableOptions = allOptions.filter((opt) => !opt.disabled)
  return selectMultiple(selectedOptions, selectableOptions, config)
}

/**
 * Deselect all options
 */
export function deselectAll<T>(
  selectedOptions: SelectOption<T>[],
  config: MultiSelectConfig = {}
): SelectOption<T>[] {
  if (config.minSelected !== undefined && config.minSelected > 0) {
    // Keep minimum required
    return selectedOptions.slice(0, config.minSelected)
  }
  return []
}

/**
 * Toggle select all
 */
export function toggleSelectAll<T>(
  allOptions: SelectOption<T>[],
  selectedOptions: SelectOption<T>[],
  config: MultiSelectConfig = {}
): SelectOption<T>[] {
  const selectableOptions = allOptions.filter((opt) => !opt.disabled)

  // If all are selected, deselect all
  const allSelected = selectableOptions.every((opt) =>
    isOptionSelected(opt, selectedOptions)
  )

  if (allSelected) {
    return deselectAll(selectedOptions, config)
  }

  return selectAll(allOptions, selectedOptions, config)
}

/**
 * Check if all options are selected
 */
export function areAllSelected<T>(
  allOptions: SelectOption<T>[],
  selectedOptions: SelectOption<T>[]
): boolean {
  const selectableOptions = allOptions.filter((opt) => !opt.disabled)
  if (selectableOptions.length === 0) return false
  return selectableOptions.every((opt) => isOptionSelected(opt, selectedOptions))
}

/**
 * Check if some options are selected
 */
export function areSomeSelected<T>(
  allOptions: SelectOption<T>[],
  selectedOptions: SelectOption<T>[]
): boolean {
  const selectableOptions = allOptions.filter((opt) => !opt.disabled)
  return selectableOptions.some((opt) => isOptionSelected(opt, selectedOptions))
}

/**
 * Get selection count message
 */
export function getSelectionCountMessage<T>(
  selectedOptions: SelectOption<T>[],
  options?: {
    singular?: string
    plural?: string
  }
): string {
  const count = selectedOptions.length
  const singular = options?.singular ?? 'item'
  const plural = options?.plural ?? 'items'

  if (count === 0) return 'No items selected'
  if (count === 1) return `1 ${singular} selected`
  return `${count} ${plural} selected`
}

// Re-export utilities from options
export { addToSelection, removeFromSelection, toggleSelection, isOptionSelected }
