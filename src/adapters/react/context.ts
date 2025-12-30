import { createContext, useContext } from 'react'
import type { Select, SelectState, SelectOption, GroupedOptions } from '../../types'

export interface SelectContextValue<T = unknown> {
  select: Select<T>
  state: SelectState<T>
}

export const SelectContext = createContext<SelectContextValue<unknown> | null>(null)

export function useSelectContext<T = unknown>(): SelectContextValue<T> {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error('useSelectContext must be used within a SelectProvider')
  }
  return context as SelectContextValue<T>
}

export function useSelectState<T = unknown>(): SelectState<T> {
  const { state } = useSelectContext<T>()
  return state
}

export function useSelectActions<T = unknown>() {
  const { select } = useSelectContext<T>()

  return {
    open: () => select.open(),
    close: () => select.close(),
    toggle: () => select.toggle(),
    selectOption: (option: SelectOption<T>) => select.selectOption(option),
    deselectOption: (option: SelectOption<T>) => select.deselectOption(option),
    toggleOption: (option: SelectOption<T>) => select.toggleOption(option),
    clearValue: () => select.clearValue(),
    setSearchValue: (value: string) => select.setSearchValue(value),
    highlightNext: () => select.highlightNext(),
    highlightPrev: () => select.highlightPrev(),
    highlightFirst: () => select.highlightFirst(),
    highlightLast: () => select.highlightLast(),
    setHighlightedIndex: (index: number) => select.setHighlightedIndex(index),
    focus: () => select.focus(),
    blur: () => select.blur(),
  }
}

export function useSelectProps<T = unknown>() {
  const { select } = useSelectContext<T>()

  return {
    getContainerProps: () => select.getContainerProps(),
    getTriggerProps: () => select.getTriggerProps(),
    getInputProps: () => select.getInputProps(),
    getMenuProps: () => select.getMenuProps(),
    getOptionProps: (option: SelectOption<T>, index: number) =>
      select.getOptionProps(option, index),
    getGroupProps: (group: GroupedOptions<T>, index: number) =>
      select.getGroupProps(group, index),
    getGroupLabelProps: (group: GroupedOptions<T>, index: number) =>
      select.getGroupLabelProps(group, index),
    getClearButtonProps: () => select.getClearButtonProps(),
    getTagProps: (option: SelectOption<T>, index: number) =>
      select.getTagProps(option, index),
    getTagRemoveProps: (option: SelectOption<T>) =>
      select.getTagRemoveProps(option),
  }
}
