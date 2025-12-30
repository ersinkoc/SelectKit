import type {
  ChangeAction,
  ClearButtonProps,
  ContainerProps,
  GroupedOptions,
  GroupLabelProps,
  GroupProps,
  InputProps,
  MenuProps,
  OptionProps,
  Options,
  Select as SelectInterface,
  SelectConfig,
  SelectEvents,
  SelectOption,
  SelectState,
  TagProps,
  TagRemoveProps,
  TriggerProps,
} from '../types'
import { EventEmitter } from './events'
import { createInitialState, getHighlightedOption, getNextHighlightedIndex, StateManager } from './state'
import {
  findOptionByValue,
  getOptionIndex,
  getValuesFromOptions,
  isOptionSelected,
  normalizeOptions,
  removeFromSelection,
  toggleSelection,
} from './options'
import { filterOptions, defaultFilter } from '../features/search'
import { debounce, type DebouncedFunction } from '../utils/debounce'
import { generateId, getGroupLabelId, getInputId, getMenuId, getOptionId, getTriggerId } from '../utils/id'
import { containsElement, focusElement, preventEvent, scrollIntoView } from '../utils/dom'
import { handleKeyDown } from '../features/keyboard'

export class Select<T = unknown> implements SelectInterface<T> {
  private config: SelectConfig<T>
  private stateManager: StateManager<T>
  private events: EventEmitter<SelectEvents<T>>
  private baseId: string
  private mounted = false
  private abortController: AbortController | null = null
  private debouncedSearch: DebouncedFunction<(search: string) => void> | null = null

  // Element refs
  private containerRef: HTMLElement | null = null
  private triggerRef: HTMLElement | null = null
  private inputRef: HTMLInputElement | null = null
  private menuRef: HTMLElement | null = null
  private optionRefs: Map<number, HTMLElement> = new Map()

  constructor(config: SelectConfig<T>) {
    this.config = this.normalizeConfig(config)
    this.baseId = config.id ?? generateId()
    this.stateManager = new StateManager(createInitialState(this.config))
    this.events = new EventEmitter()

    // Setup callbacks from config
    this.setupConfigCallbacks()

    // Setup debounced search if needed
    this.setupDebouncedSearch()

    // Handle document click for outside clicks
    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', this.handleDocumentMouseDown)
    }
  }

  private normalizeConfig(config: SelectConfig<T>): SelectConfig<T> {
    return {
      ...config,
      multiple: config.multiple ?? false,
      searchable: config.searchable ?? false,
      creatable: config.creatable ?? false,
      clearable: config.clearable ?? false,
      closeOnSelect: config.closeOnSelect ?? !config.multiple,
      openOnClick: config.openOnClick ?? true,
      openOnFocus: config.openOnFocus ?? false,
      disabled: config.disabled ?? false,
      readOnly: config.readOnly ?? false,
      required: config.required ?? false,
      placeholder: config.placeholder ?? 'Select...',
      noOptionsMessage: config.noOptionsMessage ?? 'No options',
      loadingMessage: config.loadingMessage ?? 'Loading...',
      createMessage: config.createMessage ?? ((s) => `Create "${s}"`),
      itemHeight: config.itemHeight ?? 40,
      maxHeight: config.maxHeight ?? 300,
      overscan: config.overscan ?? 5,
      placement: config.placement ?? 'bottom',
      flip: config.flip ?? true,
      searchDebounce: config.searchDebounce ?? 0,
      minSearchLength: config.minSearchLength ?? 0,
    }
  }

  private setupConfigCallbacks(): void {
    if (this.config.onChange) {
      this.on('change', this.config.onChange)
    }
    if (this.config.onSearch) {
      this.on('search', this.config.onSearch)
    }
    if (this.config.onOpen) {
      this.on('open', this.config.onOpen)
    }
    if (this.config.onClose) {
      this.on('close', this.config.onClose)
    }
    if (this.config.onFocus) {
      this.on('focus', this.config.onFocus)
    }
    if (this.config.onBlur) {
      this.on('blur', this.config.onBlur)
    }
    if (this.config.onHighlight) {
      this.on('highlight', this.config.onHighlight)
    }
  }

  private setupDebouncedSearch(): void {
    const debounceMs = this.config.searchDebounce ?? 0
    if (debounceMs > 0) {
      this.debouncedSearch = debounce((search: string) => {
        this.performSearch(search)
      }, debounceMs)
    }
  }

  private handleDocumentMouseDown = (e: MouseEvent): void => {
    const state = this.stateManager.getState()
    if (!state.isOpen) return

    const target = e.target as HTMLElement
    if (!containsElement(this.containerRef, target)) {
      this.close()
    }
  }

  // ============ LIFECYCLE ============

  mount(container: HTMLElement): void {
    this.containerRef = container
    this.mounted = true
  }

  unmount(): void {
    this.mounted = false
    this.containerRef = null
  }

  isMounted(): boolean {
    return this.mounted
  }

  destroy(): void {
    this.unmount()
    this.events.removeAllListeners()
    this.stateManager.clearSubscribers()
    this.debouncedSearch?.cancel()
    this.abortController?.abort()

    if (typeof document !== 'undefined') {
      document.removeEventListener('mousedown', this.handleDocumentMouseDown)
    }
  }

  // ============ STATE ============

  getState(): SelectState<T> {
    return this.stateManager.getState()
  }

  subscribe(callback: (state: SelectState<T>) => void): () => void {
    return this.stateManager.subscribe(callback)
  }

  // ============ CONFIG ============

  getConfig(): SelectConfig<T> {
    return this.config
  }

  updateConfig(updates: Partial<SelectConfig<T>>): void {
    this.config = { ...this.config, ...updates }

    // If options changed, update state
    if (updates.options !== undefined) {
      this.setOptions(updates.options)
    }

    // If value changed externally, update state
    if (updates.value !== undefined) {
      this.setValue(updates.value)
    }

    // If disabled changed, update state
    if (updates.disabled !== undefined) {
      this.setDisabled(updates.disabled)
    }
  }

  // ============ VALUE ============

  getValue(): T | T[] | null {
    return this.stateManager.getState().value
  }

  setValue(value: T | T[] | null): void {
    const { flat } = normalizeOptions(this.config.options)

    // Find selected options
    let selectedOptions: SelectOption<T>[] = []
    if (value !== null) {
      if (Array.isArray(value)) {
        selectedOptions = value
          .map((v) => findOptionByValue(flat, v))
          .filter((opt): opt is SelectOption<T> => opt !== undefined)
      } else {
        const found = findOptionByValue(flat, value)
        if (found) {
          selectedOptions = [found]
        }
      }
    }

    this.stateManager.setState({
      value,
      selectedOptions,
    })

    // Don't emit change for external setValue
  }

  clearValue(): void {
    const newValue = this.config.multiple ? [] : null

    this.stateManager.setState({
      value: newValue,
      selectedOptions: [],
    })

    const action: ChangeAction<T> = { type: 'clear' }
    this.emit('change', newValue, null, action)
  }

  // ============ OPTIONS ============

  getOptions(): SelectOption<T>[] {
    return this.stateManager.getState().flatOptions
  }

  setOptions(options: Options<T>): void {
    const { flat } = normalizeOptions(options)
    const state = this.stateManager.getState()

    // Re-filter if we have a search value
    const filtered = state.searchValue
      ? filterOptions(flat, state.searchValue, this.config.filterFn ?? defaultFilter)
      : flat

    // Update selected options to match new options
    const selectedOptions = state.selectedOptions
      .map((selected) => findOptionByValue(flat, selected.value))
      .filter((opt): opt is SelectOption<T> => opt !== undefined)

    this.stateManager.setState({
      options: flat,
      flatOptions: flat,
      filteredOptions: filtered,
      selectedOptions,
    })
  }

  addOption(option: SelectOption<T>): void {
    const state = this.stateManager.getState()
    const newOptions = [...state.flatOptions, option]
    this.setOptions(newOptions)
  }

  removeOption(value: T): void {
    const state = this.stateManager.getState()
    const newOptions = state.flatOptions.filter((opt) => opt.value !== value)
    this.setOptions(newOptions)
  }

  updateOption(value: T, updates: Partial<SelectOption<T>>): void {
    const state = this.stateManager.getState()
    const newOptions = state.flatOptions.map((opt) =>
      opt.value === value ? { ...opt, ...updates } : opt
    )
    this.setOptions(newOptions)
  }

  // ============ SEARCH ============

  getSearchValue(): string {
    return this.stateManager.getState().searchValue
  }

  setSearchValue(search: string): void {
    this.stateManager.setState({ searchValue: search })

    if (this.debouncedSearch) {
      this.debouncedSearch(search)
    } else {
      this.performSearch(search)
    }
  }

  private performSearch(search: string): void {
    const state = this.stateManager.getState()
    const minLength = this.config.minSearchLength ?? 0

    // Check minimum length
    if (search.length < minLength) {
      this.stateManager.setState({
        filteredOptions: state.flatOptions,
        highlightedIndex: -1,
        highlightedOption: null,
      })
      this.emit('search', search)
      return
    }

    // Handle async loading
    if (this.config.loadOptions) {
      this.loadOptionsAsync(search)
      return
    }

    // Local filtering
    const filtered = filterOptions(
      state.flatOptions,
      search,
      this.config.filterFn ?? defaultFilter
    )

    this.stateManager.setState({
      filteredOptions: filtered,
      highlightedIndex: filtered.length > 0 ? 0 : -1,
      highlightedOption: filtered[0] ?? null,
    })

    this.emit('search', search)
  }

  private async loadOptionsAsync(search: string): Promise<void> {
    if (!this.config.loadOptions) return

    // Cancel previous request
    this.abortController?.abort()
    this.abortController = new AbortController()

    this.stateManager.setState({ isLoading: true })
    this.emit('loading', true)

    try {
      const options = await this.config.loadOptions(search, this.abortController.signal)
      this.stateManager.setState({
        flatOptions: options,
        filteredOptions: options,
        isLoading: false,
        highlightedIndex: options.length > 0 ? 0 : -1,
        highlightedOption: options[0] ?? null,
      })
      this.emit('loading', false)
      this.emit('search', search)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, ignore
        return
      }
      this.stateManager.setState({ isLoading: false })
      this.emit('loading', false)
      this.emit('error', error as Error)
    }
  }

  clearSearch(): void {
    this.setSearchValue('')
  }

  setComposing(isComposing: boolean): void {
    this.stateManager.setState({ isComposing })
  }

  // ============ OPEN/CLOSE ============

  open(): void {
    if (this.config.disabled || this.stateManager.getState().isOpen) return

    const state = this.stateManager.getState()
    let highlightedIndex = -1

    // Highlight first selected option or first option
    if (state.selectedOptions.length > 0) {
      const firstSelected = state.selectedOptions[0]
      if (firstSelected) {
        highlightedIndex = getOptionIndex(state.filteredOptions, firstSelected)
      }
    }

    if (highlightedIndex === -1 && state.filteredOptions.length > 0) {
      // Find first non-disabled option
      highlightedIndex = state.filteredOptions.findIndex((opt) => !opt.disabled)
    }

    this.stateManager.setState({
      isOpen: true,
      highlightedIndex,
      highlightedOption: highlightedIndex >= 0 ? state.filteredOptions[highlightedIndex] ?? null : null,
    })

    this.emit('open')

    // Focus input if searchable
    if (this.config.searchable && this.inputRef) {
      focusElement(this.inputRef)
    }
  }

  close(): void {
    if (!this.stateManager.getState().isOpen) return

    this.stateManager.setState({
      isOpen: false,
      highlightedIndex: -1,
      highlightedOption: null,
      searchValue: '',
    })

    // Reset filtered options
    const state = this.stateManager.getState()
    this.stateManager.setState({
      filteredOptions: state.flatOptions,
    })

    this.emit('close')
  }

  toggle(): void {
    if (this.stateManager.getState().isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  isOpen(): boolean {
    return this.stateManager.getState().isOpen
  }

  // ============ FOCUS ============

  focus(): void {
    if (this.config.searchable && this.inputRef) {
      focusElement(this.inputRef)
    } else if (this.triggerRef) {
      focusElement(this.triggerRef)
    }

    if (!this.stateManager.getState().isFocused) {
      this.stateManager.setState({ isFocused: true })
      this.emit('focus')
    }
  }

  blur(): void {
    if (this.stateManager.getState().isFocused) {
      this.stateManager.setState({ isFocused: false })
      this.emit('blur')
    }
  }

  isFocused(): boolean {
    return this.stateManager.getState().isFocused
  }

  // ============ DISABLED ============

  isDisabled(): boolean {
    return this.stateManager.getState().isDisabled
  }

  setDisabled(disabled: boolean): void {
    this.stateManager.setState({ isDisabled: disabled })
    if (disabled) {
      this.close()
    }
  }

  // ============ LOADING ============

  isLoading(): boolean {
    return this.stateManager.getState().isLoading
  }

  // ============ HIGHLIGHT ============

  getHighlightedIndex(): number {
    return this.stateManager.getState().highlightedIndex
  }

  getHighlightedOption(): SelectOption<T> | null {
    return getHighlightedOption(this.stateManager.getState())
  }

  setHighlightedIndex(index: number): void {
    const state = this.stateManager.getState()
    const option = state.filteredOptions[index] ?? null

    // Skip disabled options
    if (option?.disabled) return

    this.stateManager.setState({
      highlightedIndex: index,
      highlightedOption: option,
    })

    this.emit('highlight', option, index)

    // Scroll into view
    this.scrollToHighlighted()
  }

  highlightOption(option: SelectOption<T>): void {
    const state = this.stateManager.getState()
    const index = getOptionIndex(state.filteredOptions, option)
    if (index >= 0) {
      this.setHighlightedIndex(index)
    }
  }

  highlightNext(): void {
    const state = this.stateManager.getState()
    const nextIndex = getNextHighlightedIndex(state, 'next')
    if (nextIndex >= 0) {
      this.setHighlightedIndex(nextIndex)
    }
  }

  highlightPrev(): void {
    const state = this.stateManager.getState()
    const prevIndex = getNextHighlightedIndex(state, 'prev')
    if (prevIndex >= 0) {
      this.setHighlightedIndex(prevIndex)
    }
  }

  highlightFirst(): void {
    const state = this.stateManager.getState()
    const firstIndex = getNextHighlightedIndex(state, 'first')
    if (firstIndex >= 0) {
      this.setHighlightedIndex(firstIndex)
    }
  }

  highlightLast(): void {
    const state = this.stateManager.getState()
    const lastIndex = getNextHighlightedIndex(state, 'last')
    if (lastIndex >= 0) {
      this.setHighlightedIndex(lastIndex)
    }
  }

  highlightNextPage(): void {
    const state = this.stateManager.getState()
    const nextIndex = getNextHighlightedIndex(state, 'pageDown')
    if (nextIndex >= 0) {
      this.setHighlightedIndex(nextIndex)
    }
  }

  highlightPrevPage(): void {
    const state = this.stateManager.getState()
    const prevIndex = getNextHighlightedIndex(state, 'pageUp')
    if (prevIndex >= 0) {
      this.setHighlightedIndex(prevIndex)
    }
  }

  private scrollToHighlighted(): void {
    const state = this.stateManager.getState()
    const optionEl = this.optionRefs.get(state.highlightedIndex)
    if (optionEl && this.menuRef) {
      scrollIntoView(optionEl, this.menuRef)
    }
  }

  // ============ SELECTION ============

  selectHighlighted(): void {
    const state = this.stateManager.getState()
    const option = getHighlightedOption(state)
    if (option && !option.disabled) {
      this.selectOption(option)
    }
  }

  selectOption(option: SelectOption<T>): void {
    if (option.disabled) return

    const state = this.stateManager.getState()

    if (this.config.multiple) {
      // Multi-select: toggle
      const newSelectedOptions = toggleSelection(
        state.selectedOptions,
        option,
        { maxSelected: this.config.maxSelected, minSelected: this.config.minSelected }
      )

      const isNowSelected = isOptionSelected(option, newSelectedOptions)
      const action: ChangeAction<T> = isNowSelected
        ? { type: 'select', option }
        : { type: 'deselect', option }

      const newValue = getValuesFromOptions(newSelectedOptions, true) as T[]

      this.stateManager.setState({
        value: newValue,
        selectedOptions: newSelectedOptions,
      })

      this.emit('change', newValue, newSelectedOptions, action)
    } else {
      // Single select
      const newValue = option.value
      const action: ChangeAction<T> = { type: 'select', option }

      this.stateManager.setState({
        value: newValue,
        selectedOptions: [option],
      })

      this.emit('change', newValue, option, action)
    }

    if (this.config.closeOnSelect) {
      this.close()
    }

    if (this.config.blurOnSelect) {
      this.blur()
    }
  }

  deselectOption(option: SelectOption<T>): void {
    const state = this.stateManager.getState()

    if (!this.config.multiple) {
      this.clearValue()
      return
    }

    const newSelectedOptions = removeFromSelection(
      state.selectedOptions,
      option,
      this.config.minSelected
    )

    if (newSelectedOptions.length === state.selectedOptions.length) {
      // Nothing was removed (minSelected constraint)
      return
    }

    const newValue = getValuesFromOptions(newSelectedOptions, true) as T[]
    const action: ChangeAction<T> = { type: 'deselect', option }

    this.stateManager.setState({
      value: newValue,
      selectedOptions: newSelectedOptions,
    })

    this.emit('change', newValue, newSelectedOptions, action)
  }

  toggleOption(option: SelectOption<T>): void {
    if (this.isSelected(option)) {
      this.deselectOption(option)
    } else {
      this.selectOption(option)
    }
  }

  isSelected(option: SelectOption<T>): boolean {
    const state = this.stateManager.getState()
    return isOptionSelected(option, state.selectedOptions)
  }

  getSelectedOptions(): SelectOption<T>[] {
    return this.stateManager.getState().selectedOptions
  }

  // ============ CREATABLE ============

  async createOption(inputValue: string): Promise<void> {
    if (!this.config.creatable || !this.config.onCreate) return

    const result = await this.config.onCreate(inputValue)
    if (!result) return

    // Add to options
    this.addOption(result)

    // Select the new option
    this.selectOption(result)

    // Clear search
    this.clearSearch()

    this.emit('create', result)
  }

  shouldShowCreate(): boolean {
    if (!this.config.creatable) return false

    const state = this.stateManager.getState()
    const search = state.searchValue.trim()

    if (!search) return false

    // Check if option with same label already exists
    const exists = state.filteredOptions.some(
      (opt) => opt.label.toLowerCase() === search.toLowerCase()
    )

    return !exists
  }

  getCreateMessage(): string {
    const state = this.stateManager.getState()
    const { createMessage } = this.config

    if (typeof createMessage === 'function') {
      return createMessage(state.searchValue)
    }

    return createMessage ?? `Create "${state.searchValue}"`
  }

  // ============ EVENTS ============

  on<E extends keyof SelectEvents<T>>(
    event: E,
    handler: (...args: SelectEvents<T>[E]) => void
  ): () => void {
    return this.events.on(event, handler)
  }

  off<E extends keyof SelectEvents<T>>(
    event: E,
    handler: (...args: SelectEvents<T>[E]) => void
  ): void {
    this.events.off(event, handler)
  }

  emit<E extends keyof SelectEvents<T>>(event: E, ...args: SelectEvents<T>[E]): void {
    this.events.emit(event, ...args)
  }

  // ============ REFS ============

  setContainerRef(el: HTMLElement | null): void {
    this.containerRef = el
  }

  setTriggerRef(el: HTMLElement | null): void {
    this.triggerRef = el
  }

  setInputRef(el: HTMLInputElement | null): void {
    this.inputRef = el
  }

  setMenuRef(el: HTMLElement | null): void {
    this.menuRef = el
  }

  setOptionRef(index: number, el: HTMLElement | null): void {
    if (el) {
      this.optionRefs.set(index, el)
    } else {
      this.optionRefs.delete(index)
    }
  }

  // ============ PROPS GETTERS ============

  getContainerProps(): ContainerProps {
    const state = this.stateManager.getState()

    return {
      ref: (el) => this.setContainerRef(el),
      'data-selectkit': '',
      'data-open': String(state.isOpen),
      'data-disabled': String(state.isDisabled),
      'data-focused': String(state.isFocused),
      'data-multiple': String(this.config.multiple ?? false),
      'data-searchable': String(this.config.searchable ?? false),
      'data-loading': String(state.isLoading),
    }
  }

  getTriggerProps(): TriggerProps {
    const state = this.stateManager.getState()

    return {
      ref: (el) => this.setTriggerRef(el),
      id: getTriggerId(this.baseId),
      role: 'combobox',
      'aria-haspopup': 'listbox',
      'aria-expanded': state.isOpen,
      'aria-controls': getMenuId(this.baseId),
      'aria-labelledby': this.config.ariaLabelledBy,
      'aria-label': this.config.ariaLabel,
      'aria-disabled': state.isDisabled,
      'aria-required': this.config.required ?? false,
      'aria-invalid': this.config.ariaInvalid,
      tabIndex: state.isDisabled ? -1 : 0,
      onClick: (e) => this.handleTriggerClick(e as MouseEvent),
      onKeyDown: (e) => this.handleTriggerKeyDown(e as KeyboardEvent),
      onMouseDown: (e) => this.handleTriggerMouseDown(e as MouseEvent),
    }
  }

  getInputProps(): InputProps {
    const state = this.stateManager.getState()
    const highlightedOption = getHighlightedOption(state)

    return {
      ref: (el) => this.setInputRef(el),
      id: getInputId(this.baseId),
      type: 'text',
      role: 'combobox',
      'aria-autocomplete': this.config.loadOptions ? 'both' : 'list',
      'aria-controls': getMenuId(this.baseId),
      'aria-expanded': state.isOpen,
      'aria-activedescendant': highlightedOption
        ? getOptionId(this.baseId, state.highlightedIndex)
        : undefined,
      'aria-labelledby': this.config.ariaLabelledBy,
      'aria-label': this.config.ariaLabel,
      'aria-disabled': state.isDisabled,
      'aria-required': this.config.required ?? false,
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'off',
      spellCheck: false,
      value: state.searchValue,
      placeholder: state.selectedOptions.length > 0
        ? ''
        : this.config.placeholder ?? 'Select...',
      disabled: state.isDisabled,
      readOnly: this.config.readOnly ?? false,
      onChange: (e) => this.handleInputChange(e as Event),
      onFocus: (e) => this.handleInputFocus(e as FocusEvent),
      onBlur: (e) => this.handleInputBlur(e as FocusEvent),
      onKeyDown: (e) => this.handleInputKeyDown(e as KeyboardEvent),
      onCompositionStart: () => this.handleCompositionStart(),
      onCompositionEnd: () => this.handleCompositionEnd(),
    }
  }

  getMenuProps(): MenuProps {
    return {
      ref: (el) => this.setMenuRef(el),
      id: getMenuId(this.baseId),
      role: 'listbox',
      'aria-label': this.config.ariaLabel,
      'aria-labelledby': this.config.ariaLabelledBy,
      'aria-multiselectable': this.config.multiple ? true : undefined,
      tabIndex: -1,
      onMouseDown: (e) => preventEvent(e as Event), // Prevent blur
    }
  }

  getOptionProps(option: SelectOption<T>, index: number): OptionProps {
    const state = this.stateManager.getState()
    const isSelected = this.isSelected(option)
    const isHighlighted = state.highlightedIndex === index
    const isDisabled = option.disabled ?? false

    return {
      ref: (el) => this.setOptionRef(index, el),
      id: getOptionId(this.baseId, index),
      role: 'option',
      'aria-selected': isSelected,
      'aria-disabled': isDisabled,
      'data-highlighted': String(isHighlighted),
      'data-selected': String(isSelected),
      'data-disabled': String(isDisabled),
      'data-index': index,
      tabIndex: -1,
      onClick: (e) => this.handleOptionClick(e as MouseEvent, option),
      onMouseEnter: () => this.handleOptionMouseEnter(index),
      onMouseMove: () => this.handleOptionMouseMove(index),
    }
  }

  getGroupProps(_group: GroupedOptions<T>, index: number): GroupProps {
    return {
      role: 'group',
      'aria-labelledby': getGroupLabelId(this.baseId, index),
    }
  }

  getGroupLabelProps(_group: GroupedOptions<T>, index: number): GroupLabelProps {
    return {
      id: getGroupLabelId(this.baseId, index),
      role: 'presentation',
    }
  }

  getClearButtonProps(): ClearButtonProps {
    return {
      type: 'button',
      'aria-label': 'Clear selection',
      tabIndex: -1,
      onClick: (e) => this.handleClearClick(e as MouseEvent),
      onMouseDown: (e) => preventEvent(e as Event),
    }
  }

  getTagProps(option: SelectOption<T>, index: number): TagProps {
    return {
      'data-tag': '',
      'data-value': String(option.value),
      'data-index': index,
    }
  }

  getTagRemoveProps(option: SelectOption<T>): TagRemoveProps {
    return {
      type: 'button',
      'aria-label': `Remove ${option.label}`,
      tabIndex: -1,
      onClick: (e) => this.handleTagRemoveClick(e as MouseEvent, option),
      onMouseDown: (e) => preventEvent(e as Event),
    }
  }

  // ============ EVENT HANDLERS ============

  private handleTriggerClick(_e: MouseEvent): void {
    if (this.config.disabled) return

    if (this.config.openOnClick) {
      this.toggle()
    }
  }

  private handleTriggerMouseDown(_e: MouseEvent): void {
    // Prevent default to avoid stealing focus from input
    if (this.config.searchable) {
      preventEvent(_e)
    }
  }

  private handleTriggerKeyDown(e: KeyboardEvent): void {
    handleKeyDown(this, e)
  }

  private handleInputChange(e: Event): void {
    const target = e.target as HTMLInputElement
    this.setSearchValue(target.value)

    if (!this.stateManager.getState().isOpen) {
      this.open()
    }
  }

  private handleInputFocus(_e: FocusEvent): void {
    if (!this.stateManager.getState().isFocused) {
      this.stateManager.setState({ isFocused: true })
      this.emit('focus')
    }

    if (this.config.openOnFocus) {
      this.open()
    }
  }

  private handleInputBlur(e: FocusEvent): void {
    // Check if focus moved to menu or another part of the select
    const relatedTarget = e.relatedTarget as HTMLElement | null
    if (containsElement(this.containerRef, relatedTarget)) {
      return
    }

    this.stateManager.setState({ isFocused: false })
    this.close()
    this.emit('blur')
  }

  private handleInputKeyDown(e: KeyboardEvent): void {
    handleKeyDown(this, e)
  }

  private handleCompositionStart(): void {
    this.stateManager.setState({ isComposing: true })
  }

  private handleCompositionEnd(): void {
    this.stateManager.setState({ isComposing: false })
  }

  private handleOptionClick(e: MouseEvent, option: SelectOption<T>): void {
    preventEvent(e)
    if (!option.disabled) {
      this.selectOption(option)
    }
  }

  private handleOptionMouseEnter(index: number): void {
    this.setHighlightedIndex(index)
  }

  private handleOptionMouseMove(index: number): void {
    const state = this.stateManager.getState()
    if (state.highlightedIndex !== index) {
      this.setHighlightedIndex(index)
    }
  }

  private handleClearClick(e: MouseEvent): void {
    preventEvent(e)
    this.clearValue()
  }

  private handleTagRemoveClick(e: MouseEvent, option: SelectOption<T>): void {
    preventEvent(e)
    this.deselectOption(option)
  }

  // ============ UTILS ============

  getNoOptionsMessage(): string {
    const state = this.stateManager.getState()
    const { noOptionsMessage } = this.config

    if (typeof noOptionsMessage === 'function') {
      return noOptionsMessage(state.searchValue)
    }

    return noOptionsMessage ?? 'No options'
  }

  getLoadingMessage(): string {
    return this.config.loadingMessage ?? 'Loading...'
  }
}

/**
 * Factory function to create a new Select instance
 */
export function createSelect<T = unknown>(config: SelectConfig<T>): Select<T> {
  return new Select(config)
}
