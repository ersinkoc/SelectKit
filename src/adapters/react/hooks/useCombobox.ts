import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import { createSelect, Select } from '../../../core/select'
import type {
  SelectConfig,
  SelectOption,
  InputProps,
  MenuProps,
  OptionProps,
} from '../../../types'

export interface UseComboboxConfig<T> extends Omit<SelectConfig<T>, 'multiple' | 'searchable'> {
  onSelect?: (option: SelectOption<T>) => void
  freeSolo?: boolean
  clearOnSelect?: boolean
}

export interface UseComboboxReturn<T> {
  // State
  inputValue: string
  isOpen: boolean
  isLoading: boolean
  highlightedIndex: number
  highlightedOption: SelectOption<T> | null
  filteredOptions: SelectOption<T>[]
  selectedOption: SelectOption<T> | null

  // Actions
  setInputValue: (value: string) => void
  selectOption: (option: SelectOption<T>) => void
  open: () => void
  close: () => void
  highlightNext: () => void
  highlightPrev: () => void
  setHighlightedIndex: (index: number) => void
  reset: () => void

  // Props getters
  getInputProps: () => InputProps
  getMenuProps: () => MenuProps
  getOptionProps: (option: SelectOption<T>, index: number) => OptionProps
}

export function useCombobox<T = unknown>(config: UseComboboxConfig<T>): UseComboboxReturn<T> {
  const { onSelect, freeSolo, clearOnSelect = true, ...selectConfig } = config
  const selectRef = useRef<Select<T> | null>(null)

  // Create select instance
  if (!selectRef.current) {
    selectRef.current = createSelect({
      ...selectConfig,
      searchable: true,
      multiple: false,
      closeOnSelect: true,
      openOnFocus: config.openOnFocus ?? true,
    })
  }

  const select = selectRef.current

  // Subscribe to state changes
  const state = useSyncExternalStore(
    useCallback((onStoreChange) => select.subscribe(onStoreChange), [select]),
    useCallback(() => select.getState(), [select]),
    useCallback(() => select.getState(), [select])
  )

  // Handle selection
  const handleSelect = useCallback(
    (option: SelectOption<T>) => {
      select.selectOption(option)
      onSelect?.(option)

      if (clearOnSelect) {
        select.clearSearch()
      }
    },
    [select, onSelect, clearOnSelect]
  )

  // Update options when they change
  useEffect(() => {
    if (selectConfig.options) {
      select.setOptions(selectConfig.options)
    }
  }, [select, selectConfig.options])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      select.destroy()
    }
  }, [select])

  // Actions
  const setInputValue = useCallback((value: string) => select.setSearchValue(value), [select])
  const open = useCallback(() => select.open(), [select])
  const close = useCallback(() => select.close(), [select])
  const highlightNext = useCallback(() => select.highlightNext(), [select])
  const highlightPrev = useCallback(() => select.highlightPrev(), [select])
  const setHighlightedIndex = useCallback((index: number) => select.setHighlightedIndex(index), [select])

  const reset = useCallback(() => {
    select.clearSearch()
    select.clearValue()
    select.close()
  }, [select])

  // Props getters with combobox-specific modifications
  const getInputProps = useCallback((): InputProps => {
    const props = select.getInputProps()
    return {
      ...props,
      value: state.searchValue,
    }
  }, [select, state.searchValue])

  const getMenuProps = useCallback(() => select.getMenuProps(), [select])

  const getOptionProps = useCallback(
    (option: SelectOption<T>, index: number): OptionProps => {
      const props = select.getOptionProps(option, index)
      return {
        ...props,
        onClick: (e: unknown) => {
          const event = e as MouseEvent
          event.preventDefault()
          event.stopPropagation()
          handleSelect(option)
        },
      }
    },
    [select, handleSelect]
  )

  return {
    inputValue: state.searchValue,
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    highlightedIndex: state.highlightedIndex,
    highlightedOption: state.highlightedOption,
    filteredOptions: state.filteredOptions,
    selectedOption: state.selectedOptions[0] ?? null,
    setInputValue,
    selectOption: handleSelect,
    open,
    close,
    highlightNext,
    highlightPrev,
    setHighlightedIndex,
    reset,
    getInputProps,
    getMenuProps,
    getOptionProps,
  }
}
