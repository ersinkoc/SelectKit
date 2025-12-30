// ============ OPTION TYPES ============

export interface SelectOption<T = unknown> {
  value: T
  label: string
  disabled?: boolean
  group?: string
  data?: Record<string, unknown>
  icon?: string
  description?: string
}

export interface GroupedOptions<T = unknown> {
  label: string
  options: SelectOption<T>[]
}

export type Options<T = unknown> = SelectOption<T>[] | GroupedOptions<T>[]

// ============ FORMAT CONTEXT ============

export interface FormatContext {
  context: 'menu' | 'value'
  isSelected: boolean
  isHighlighted: boolean
  isDisabled: boolean
  searchValue: string
}

// ============ CHANGE ACTION ============

export type ChangeAction<T = unknown> =
  | { type: 'select'; option: SelectOption<T> }
  | { type: 'deselect'; option: SelectOption<T> }
  | { type: 'clear' }
  | { type: 'create'; option: SelectOption<T> }
  | { type: 'remove-last' }

// ============ SELECT CONFIG ============

export interface SelectConfig<T = unknown> {
  // Options
  options: Options<T>

  // Value
  value?: T | T[] | null
  defaultValue?: T | T[] | null

  // Mode
  multiple?: boolean
  searchable?: boolean
  creatable?: boolean
  clearable?: boolean

  // Search
  filterFn?: (option: SelectOption<T>, search: string) => boolean
  searchDebounce?: number
  minSearchLength?: number

  // Async
  loadOptions?: (search: string, signal: AbortSignal) => Promise<SelectOption<T>[]>
  loadingMessage?: string

  // Display
  placeholder?: string
  noOptionsMessage?: string | ((search: string) => string)
  createMessage?: string | ((search: string) => string)
  formatOptionLabel?: (option: SelectOption<T>, context: FormatContext) => string
  formatSelectedLabel?: (option: SelectOption<T>) => string

  // Behavior
  closeOnSelect?: boolean
  blurOnSelect?: boolean
  openOnFocus?: boolean
  openOnClick?: boolean
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  autoFocus?: boolean

  // Limits
  maxSelected?: number
  minSelected?: number

  // Virtualization
  virtualize?: boolean
  itemHeight?: number | ((option: SelectOption<T>) => number)
  overscan?: number
  maxHeight?: number

  // Positioning
  placement?: 'bottom' | 'top' | 'auto'
  flip?: boolean

  // Callbacks
  onChange?: (
    value: T | T[] | null,
    option: SelectOption<T> | SelectOption<T>[] | null,
    action: ChangeAction<T>
  ) => void
  onSearch?: (search: string) => void
  onOpen?: () => void
  onClose?: () => void
  onFocus?: () => void
  onBlur?: () => void
  onCreate?: (inputValue: string) => SelectOption<T> | Promise<SelectOption<T>> | null
  onHighlight?: (option: SelectOption<T> | null, index: number) => void

  // Accessibility
  id?: string
  name?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  ariaInvalid?: boolean
}

// ============ SELECT STATE ============

export interface SelectState<T = unknown> {
  // Open state
  isOpen: boolean

  // Value
  value: T | T[] | null
  selectedOptions: SelectOption<T>[]

  // Search
  searchValue: string

  // Options
  options: SelectOption<T>[]
  filteredOptions: SelectOption<T>[]
  flatOptions: SelectOption<T>[]

  // Highlight
  highlightedIndex: number
  highlightedOption: SelectOption<T> | null

  // Loading
  isLoading: boolean

  // Focus
  isFocused: boolean

  // Disabled
  isDisabled: boolean

  // Composing (IME)
  isComposing: boolean
}

// ============ EVENTS ============

export type SelectEvent =
  | 'change'
  | 'search'
  | 'open'
  | 'close'
  | 'focus'
  | 'blur'
  | 'create'
  | 'highlight'
  | 'loading'
  | 'error'

export interface SelectEvents<T = unknown> {
  change: [value: T | T[] | null, option: SelectOption<T> | SelectOption<T>[] | null, action: ChangeAction<T>]
  search: [search: string]
  open: []
  close: []
  focus: []
  blur: []
  create: [option: SelectOption<T>]
  highlight: [option: SelectOption<T> | null, index: number]
  loading: [isLoading: boolean]
  error: [error: Error]
  [key: string]: unknown[]
}

// ============ PROPS GETTERS ============

export interface ContainerProps {
  ref: (el: HTMLElement | null) => void
  'data-selectkit': ''
  'data-open': string
  'data-disabled': string
  'data-focused': string
  'data-multiple': string
  'data-searchable': string
  'data-loading': string
}

export interface TriggerProps {
  ref: (el: HTMLElement | null) => void
  id: string
  role: 'combobox'
  'aria-haspopup': 'listbox'
  'aria-expanded': boolean
  'aria-controls': string
  'aria-labelledby': string | undefined
  'aria-label': string | undefined
  'aria-disabled': boolean
  'aria-required': boolean
  'aria-invalid': boolean | undefined
  tabIndex: number
  onClick: (e: unknown) => void
  onKeyDown: (e: unknown) => void
  onMouseDown: (e: unknown) => void
}

export interface InputProps {
  ref: (el: HTMLInputElement | null) => void
  id: string
  type: 'text'
  role: 'combobox'
  'aria-autocomplete': 'list' | 'both'
  'aria-controls': string
  'aria-expanded': boolean
  'aria-activedescendant': string | undefined
  'aria-labelledby': string | undefined
  'aria-label': string | undefined
  'aria-disabled': boolean
  'aria-required': boolean
  autoComplete: 'off'
  autoCorrect: 'off'
  autoCapitalize: 'off'
  spellCheck: false
  value: string
  placeholder: string
  disabled: boolean
  readOnly: boolean
  onChange: (e: unknown) => void
  onFocus: (e: unknown) => void
  onBlur: (e: unknown) => void
  onKeyDown: (e: unknown) => void
  onCompositionStart: (e: unknown) => void
  onCompositionEnd: (e: unknown) => void
}

export interface MenuProps {
  ref: (el: HTMLElement | null) => void
  id: string
  role: 'listbox'
  'aria-label': string | undefined
  'aria-labelledby': string | undefined
  'aria-multiselectable': boolean | undefined
  tabIndex: -1
  onMouseDown: (e: unknown) => void
}

export interface OptionProps {
  ref: (el: HTMLElement | null) => void
  id: string
  role: 'option'
  'aria-selected': boolean
  'aria-disabled': boolean
  'data-highlighted': string
  'data-selected': string
  'data-disabled': string
  'data-index': number
  tabIndex: -1
  onClick: (e: unknown) => void
  onMouseEnter: (e: unknown) => void
  onMouseMove: (e: unknown) => void
}

export interface GroupProps {
  role: 'group'
  'aria-labelledby': string
}

export interface GroupLabelProps {
  id: string
  role: 'presentation'
}

export interface ClearButtonProps {
  type: 'button'
  'aria-label': string
  tabIndex: -1
  onClick: (e: unknown) => void
  onMouseDown: (e: unknown) => void
}

export interface TagProps {
  'data-tag': ''
  'data-value': string
  'data-index': number
}

export interface TagRemoveProps {
  type: 'button'
  'aria-label': string
  tabIndex: -1
  onClick: (e: unknown) => void
  onMouseDown: (e: unknown) => void
}

// ============ VIRTUALIZATION ============

export interface VirtualState {
  startIndex: number
  endIndex: number
  offsetTop: number
  totalHeight: number
  visibleItems: number
}

export interface VirtualItem<T = unknown> {
  index: number
  option: SelectOption<T>
  offsetTop: number
  height: number
}

// ============ SELECT INTERFACE ============

export interface Select<T = unknown> {
  // Mount/unmount
  mount(container: HTMLElement): void
  unmount(): void
  isMounted(): boolean

  // State
  getState(): SelectState<T>
  subscribe(callback: (state: SelectState<T>) => void): () => void

  // Config
  getConfig(): SelectConfig<T>
  updateConfig(config: Partial<SelectConfig<T>>): void

  // Value
  getValue(): T | T[] | null
  setValue(value: T | T[] | null): void
  clearValue(): void

  // Options
  getOptions(): SelectOption<T>[]
  setOptions(options: Options<T>): void
  addOption(option: SelectOption<T>): void
  removeOption(value: T): void
  updateOption(value: T, updates: Partial<SelectOption<T>>): void

  // Search
  getSearchValue(): string
  setSearchValue(search: string): void
  clearSearch(): void

  // Open/close
  open(): void
  close(): void
  toggle(): void
  isOpen(): boolean

  // Focus
  focus(): void
  blur(): void
  isFocused(): boolean

  // Disabled
  isDisabled(): boolean
  setDisabled(disabled: boolean): void

  // Loading
  isLoading(): boolean

  // Highlight
  getHighlightedIndex(): number
  getHighlightedOption(): SelectOption<T> | null
  setHighlightedIndex(index: number): void
  highlightOption(option: SelectOption<T>): void
  highlightNext(): void
  highlightPrev(): void
  highlightFirst(): void
  highlightLast(): void
  highlightNextPage(): void
  highlightPrevPage(): void

  // Selection
  selectHighlighted(): void
  selectOption(option: SelectOption<T>): void
  deselectOption(option: SelectOption<T>): void
  toggleOption(option: SelectOption<T>): void
  isSelected(option: SelectOption<T>): boolean
  getSelectedOptions(): SelectOption<T>[]

  // Creatable
  createOption(inputValue: string): Promise<void>

  // Events
  on<E extends keyof SelectEvents<T>>(
    event: E,
    handler: (...args: SelectEvents<T>[E]) => void
  ): () => void
  off<E extends keyof SelectEvents<T>>(
    event: E,
    handler: (...args: SelectEvents<T>[E]) => void
  ): void
  emit<E extends keyof SelectEvents<T>>(event: E, ...args: SelectEvents<T>[E]): void

  // Props getters
  getContainerProps(): ContainerProps
  getTriggerProps(): TriggerProps
  getInputProps(): InputProps
  getMenuProps(): MenuProps
  getOptionProps(option: SelectOption<T>, index: number): OptionProps
  getGroupProps(group: GroupedOptions<T>, index: number): GroupProps
  getGroupLabelProps(group: GroupedOptions<T>, index: number): GroupLabelProps
  getClearButtonProps(): ClearButtonProps
  getTagProps(option: SelectOption<T>, index: number): TagProps
  getTagRemoveProps(option: SelectOption<T>): TagRemoveProps

  // Refs
  setContainerRef(el: HTMLElement | null): void
  setTriggerRef(el: HTMLElement | null): void
  setInputRef(el: HTMLInputElement | null): void
  setMenuRef(el: HTMLElement | null): void

  // Cleanup
  destroy(): void
}

// ============ TYPE GUARDS ============

export function isGroupedOptions<T>(options: Options<T>): options is GroupedOptions<T>[] {
  if (!Array.isArray(options) || options.length === 0) {
    return false
  }
  const first = options[0]
  return first !== undefined && 'options' in first && Array.isArray(first.options)
}

export function isSelectOption<T>(item: SelectOption<T> | GroupedOptions<T>): item is SelectOption<T> {
  return 'value' in item && 'label' in item && !('options' in item)
}
