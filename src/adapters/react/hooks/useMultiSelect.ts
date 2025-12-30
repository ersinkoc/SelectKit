import type { SelectConfig } from '../../../types'
import { useSelect, type UseSelectReturn } from './useSelect'

export interface UseMultiSelectReturn<T> extends Omit<UseSelectReturn<T>, 'selectedOption'> {
  selectedValues: T[]
  canAddMore: boolean
  canRemove: boolean
  removeLastSelected: () => void
  selectAll: () => void
  deselectAll: () => void
}

export function useMultiSelect<T = unknown>(
  config: Omit<SelectConfig<T>, 'multiple'>
): UseMultiSelectReturn<T> {
  const selectReturn = useSelect<T>({
    ...config,
    multiple: true,
    closeOnSelect: config.closeOnSelect ?? false,
  })

  const { select, state } = selectReturn

  // Calculate derived values
  const selectedValues = (state.value as T[] | null) ?? []
  const maxSelected = select.getConfig().maxSelected
  const minSelected = select.getConfig().minSelected

  const canAddMore = maxSelected === undefined || state.selectedOptions.length < maxSelected
  const canRemove = minSelected === undefined || state.selectedOptions.length > minSelected

  // Additional actions for multi-select
  const removeLastSelected = () => {
    const lastOption = state.selectedOptions[state.selectedOptions.length - 1]
    if (lastOption && canRemove) {
      select.deselectOption(lastOption)
    }
  }

  const selectAll = () => {
    const options = state.filteredOptions.filter((opt) => !opt.disabled)
    for (const option of options) {
      if (!select.isSelected(option)) {
        select.selectOption(option)
      }
    }
  }

  const deselectAll = () => {
    select.clearValue()
  }

  return {
    ...selectReturn,
    selectedValues,
    canAddMore,
    canRemove,
    removeLastSelected,
    selectAll,
    deselectAll,
  }
}
