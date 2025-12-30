// Hooks
export { useSelect, type UseSelectReturn } from './hooks/useSelect'
export { useMultiSelect, type UseMultiSelectReturn } from './hooks/useMultiSelect'
export { useCombobox, type UseComboboxConfig, type UseComboboxReturn } from './hooks/useCombobox'

// Context
export {
  SelectContext,
  useSelectContext,
  useSelectState,
  useSelectActions,
  useSelectProps,
  type SelectContextValue,
} from './context'

// Components
export { Select, type SelectProps } from './components/Select'
export { MultiSelect, type MultiSelectProps } from './components/MultiSelect'
export { Combobox, type ComboboxProps } from './components/Combobox'
export { Autocomplete, type AutocompleteProps } from './components/Autocomplete'
export { SelectProvider, type SelectProviderProps } from './components/SelectProvider'

// Composable parts
export {
  SelectTrigger,
  SelectValue,
  SelectInput,
  SelectClear,
  SelectMenu,
  SelectOption as SelectOptionComponent,
  SelectGroup,
  SelectGroupLabel,
  SelectTag,
  SelectTagRemove,
  SelectEmpty,
  SelectLoading,
  SelectCreate,
} from './components/parts'

export type {
  SelectTriggerProps,
  SelectValueProps,
  SelectInputProps,
  SelectClearProps,
  SelectMenuProps,
  SelectOptionProps,
  SelectGroupProps,
  SelectGroupLabelProps,
  SelectTagProps,
  SelectTagRemoveProps,
  SelectEmptyProps,
  SelectLoadingProps,
  SelectCreateProps,
} from './components/parts'

// Re-export types from core
export type {
  SelectOption,
  GroupedOptions,
  Options,
  SelectConfig,
  SelectState,
  FormatContext,
  ChangeAction,
} from '../../types'
