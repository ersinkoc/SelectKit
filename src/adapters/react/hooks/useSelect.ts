import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import { createSelect, Select } from '../../../core/select'
import type {
  SelectConfig,
  SelectState,
  SelectOption,
  GroupedOptions,
  ContainerProps,
  TriggerProps,
  InputProps,
  MenuProps,
  OptionProps,
  GroupProps,
  GroupLabelProps,
  ClearButtonProps,
  TagProps,
  TagRemoveProps,
} from '../../../types'

export interface UseSelectReturn<T> {
  // Instance
  select: Select<T>

  // State
  state: SelectState<T>
  isOpen: boolean
  isFocused: boolean
  isLoading: boolean
  isDisabled: boolean
  highlightedIndex: number
  highlightedOption: SelectOption<T> | null
  selectedOption: SelectOption<T> | null
  selectedOptions: SelectOption<T>[]
  searchValue: string
  filteredOptions: SelectOption<T>[]

  // Actions
  open: () => void
  close: () => void
  toggle: () => void
  selectOption: (option: SelectOption<T>) => void
  deselectOption: (option: SelectOption<T>) => void
  toggleOption: (option: SelectOption<T>) => void
  clearValue: () => void
  setSearchValue: (value: string) => void
  highlightNext: () => void
  highlightPrev: () => void
  highlightFirst: () => void
  highlightLast: () => void
  setHighlightedIndex: (index: number) => void
  focus: () => void
  blur: () => void
  isSelected: (option: SelectOption<T>) => boolean

  // Props getters
  getContainerProps: () => ContainerProps
  getTriggerProps: () => TriggerProps
  getInputProps: () => InputProps
  getMenuProps: () => MenuProps
  getOptionProps: (option: SelectOption<T>, index: number) => OptionProps
  getGroupProps: (group: GroupedOptions<T>, index: number) => GroupProps
  getGroupLabelProps: (group: GroupedOptions<T>, index: number) => GroupLabelProps
  getClearButtonProps: () => ClearButtonProps
  getTagProps: (option: SelectOption<T>, index: number) => TagProps
  getTagRemoveProps: (option: SelectOption<T>) => TagRemoveProps
}

export function useSelect<T = unknown>(config: SelectConfig<T>): UseSelectReturn<T> {
  const selectRef = useRef<Select<T> | null>(null)

  // Create select instance only once
  if (!selectRef.current) {
    selectRef.current = createSelect(config)
  }

  const select = selectRef.current

  // Store config in a ref to avoid re-subscription on config changes
  const configRef = useRef(config)
  configRef.current = config

  // Subscribe to state changes
  const state = useSyncExternalStore(
    useCallback((onStoreChange) => select.subscribe(onStoreChange), [select]),
    useCallback(() => select.getState(), [select]),
    useCallback(() => select.getState(), [select])
  )

  // Update controlled value
  useEffect(() => {
    if (config.value !== undefined) {
      select.setValue(config.value)
    }
  }, [select, config.value])

  // Update options when they change
  useEffect(() => {
    select.setOptions(config.options)
  }, [select, config.options])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      select.destroy()
    }
  }, [select])

  // Memoized actions
  const open = useCallback(() => select.open(), [select])
  const close = useCallback(() => select.close(), [select])
  const toggle = useCallback(() => select.toggle(), [select])
  const selectOption = useCallback((option: SelectOption<T>) => select.selectOption(option), [select])
  const deselectOption = useCallback((option: SelectOption<T>) => select.deselectOption(option), [select])
  const toggleOption = useCallback((option: SelectOption<T>) => select.toggleOption(option), [select])
  const clearValue = useCallback(() => select.clearValue(), [select])
  const setSearchValue = useCallback((value: string) => select.setSearchValue(value), [select])
  const highlightNext = useCallback(() => select.highlightNext(), [select])
  const highlightPrev = useCallback(() => select.highlightPrev(), [select])
  const highlightFirst = useCallback(() => select.highlightFirst(), [select])
  const highlightLast = useCallback(() => select.highlightLast(), [select])
  const setHighlightedIndex = useCallback((index: number) => select.setHighlightedIndex(index), [select])
  const focus = useCallback(() => select.focus(), [select])
  const blur = useCallback(() => select.blur(), [select])
  const isSelected = useCallback((option: SelectOption<T>) => select.isSelected(option), [select])

  // Memoized props getters
  const getContainerProps = useCallback(() => select.getContainerProps(), [select])
  const getTriggerProps = useCallback(() => select.getTriggerProps(), [select])
  const getInputProps = useCallback(() => select.getInputProps(), [select])
  const getMenuProps = useCallback(() => select.getMenuProps(), [select])
  const getOptionProps = useCallback(
    (option: SelectOption<T>, index: number) => select.getOptionProps(option, index),
    [select]
  )
  const getGroupProps = useCallback(
    (group: GroupedOptions<T>, index: number) => select.getGroupProps(group, index),
    [select]
  )
  const getGroupLabelProps = useCallback(
    (group: GroupedOptions<T>, index: number) => select.getGroupLabelProps(group, index),
    [select]
  )
  const getClearButtonProps = useCallback(() => select.getClearButtonProps(), [select])
  const getTagProps = useCallback(
    (option: SelectOption<T>, index: number) => select.getTagProps(option, index),
    [select]
  )
  const getTagRemoveProps = useCallback(
    (option: SelectOption<T>) => select.getTagRemoveProps(option),
    [select]
  )

  return {
    select,
    state,
    isOpen: state.isOpen,
    isFocused: state.isFocused,
    isLoading: state.isLoading,
    isDisabled: state.isDisabled,
    highlightedIndex: state.highlightedIndex,
    highlightedOption: state.highlightedOption,
    selectedOption: state.selectedOptions[0] ?? null,
    selectedOptions: state.selectedOptions,
    searchValue: state.searchValue,
    filteredOptions: state.filteredOptions,
    open,
    close,
    toggle,
    selectOption,
    deselectOption,
    toggleOption,
    clearValue,
    setSearchValue,
    highlightNext,
    highlightPrev,
    highlightFirst,
    highlightLast,
    setHighlightedIndex,
    focus,
    blur,
    isSelected,
    getContainerProps,
    getTriggerProps,
    getInputProps,
    getMenuProps,
    getOptionProps,
    getGroupProps,
    getGroupLabelProps,
    getClearButtonProps,
    getTagProps,
    getTagRemoveProps,
  }
}
