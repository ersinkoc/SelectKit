# SelectKit - Headless, Accessible Select and Combobox

## Package Identity

- **NPM Package**: `@oxog/selectkit`
- **GitHub Repository**: `https://github.com/ersinkoc/selectkit`
- **Documentation Site**: `https://selectkit.oxog.dev`
- **License**: MIT
- **Author**: Ersin KOÇ
- **Created**: 2025-12-30

**NO social media, Discord, email, or external links.**

## Package Description

Zero-dependency headless select and combobox with search, multi-select, and full accessibility.

SelectKit is a lightweight, framework-agnostic library for building accessible select components. Features single select dropdown with customizable trigger, multi-select with tag management, searchable and filterable options, creatable mode for adding new options, async options loading with debounce, grouped options with headers, virtualized rendering for large lists, full keyboard navigation, complete WAI-ARIA accessibility, headless architecture with props getters for custom rendering, clearable selections, disabled states for options and component, and comprehensive React integration with useSelect, useMultiSelect, useCombobox hooks and Select, MultiSelect, Combobox, Autocomplete components—all under 4KB with zero runtime dependencies.

---

## NON-NEGOTIABLE RULES

These rules are ABSOLUTE and must be followed without exception:

### 1. ZERO DEPENDENCIES
```json
{
  "dependencies": {}  // MUST BE EMPTY - NO EXCEPTIONS
}
```
Implement EVERYTHING from scratch. No runtime dependencies allowed.

### 2. 100% TEST COVERAGE & 100% SUCCESS RATE
- Every line of code must be tested
- Every branch must be tested
- All tests must pass (100% success rate)
- Use Vitest for testing
- Coverage report must show 100%

### 3. DEVELOPMENT WORKFLOW
Create these documents FIRST, before any code:
1. **SPECIFICATION.md** - Complete package specification
2. **IMPLEMENTATION.md** - Architecture and design decisions
3. **TASKS.md** - Ordered task list with dependencies

Only after these documents are complete, implement the code following TASKS.md sequentially.

### 4. TYPESCRIPT STRICT MODE
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

### 5. NO EXTERNAL LINKS
- ❌ No social media (Twitter, LinkedIn, etc.)
- ❌ No Discord/Slack links
- ❌ No email addresses
- ❌ No donation/sponsor links
- ✅ Only GitHub repo and documentation site allowed

### 6. BUNDLE SIZE TARGET
- Core package: < 4KB minified + gzipped
- With React adapter: < 6KB
- Tree-shakeable

---

## CORE TYPES

```typescript
// ============ OPTION TYPES ============

interface SelectOption<T = unknown> {
  value: T
  label: string
  disabled?: boolean
  group?: string
  data?: Record<string, unknown>
  icon?: string
  description?: string
}

interface GroupedOptions<T = unknown> {
  label: string
  options: SelectOption<T>[]
}

type Options<T> = SelectOption<T>[] | GroupedOptions<T>[]

// ============ SELECT CONFIG ============

interface SelectConfig<T = unknown> {
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
  onChange?: (value: T | T[] | null, option: SelectOption<T> | SelectOption<T>[] | null, action: ChangeAction) => void
  onSearch?: (search: string) => void
  onOpen?: () => void
  onClose?: () => void
  onFocus?: () => void
  onBlur?: () => void
  onCreate?: (inputValue: string) => SelectOption<T> | Promise<SelectOption<T>>
  onHighlight?: (option: SelectOption<T> | null, index: number) => void
  
  // Accessibility
  id?: string
  name?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
}

interface FormatContext {
  context: 'menu' | 'value'
  isSelected: boolean
  isHighlighted: boolean
  isDisabled: boolean
  searchValue: string
}

type ChangeAction = 
  | { type: 'select'; option: SelectOption }
  | { type: 'deselect'; option: SelectOption }
  | { type: 'clear' }
  | { type: 'create'; option: SelectOption }
  | { type: 'remove-last' }

// ============ SELECT STATE ============

interface SelectState<T = unknown> {
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
}

// ============ SELECT INSTANCE ============

interface Select<T = unknown> {
  // Mount/unmount
  mount(container: HTMLElement): void
  unmount(): void
  isMounted(): boolean
  
  // State
  getState(): SelectState<T>
  subscribe(callback: (state: SelectState<T>) => void): () => void
  
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
  
  // Events
  on<E extends SelectEvent>(event: E, handler: SelectEventHandler<E>): () => void
  off<E extends SelectEvent>(event: E, handler: SelectEventHandler<E>): void
  emit<E extends SelectEvent>(event: E, ...args: SelectEventArgs<E>): void
  
  // Props getters
  getContainerProps(): ContainerProps
  getTriggerProps(): TriggerProps
  getInputProps(): InputProps
  getMenuProps(): MenuProps
  getOptionProps(option: SelectOption<T>, index: number): OptionProps
  getGroupProps(group: GroupedOptions<T>): GroupProps
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

// ============ EVENTS ============

type SelectEvent = 
  | 'change'
  | 'search'
  | 'open'
  | 'close'
  | 'focus'
  | 'blur'
  | 'create'
  | 'highlight'
  | 'loading'

type SelectEventHandler<E extends SelectEvent> = 
  E extends 'change' ? (value: unknown, option: SelectOption | SelectOption[] | null, action: ChangeAction) => void :
  E extends 'search' ? (search: string) => void :
  E extends 'highlight' ? (option: SelectOption | null, index: number) => void :
  E extends 'loading' ? (isLoading: boolean) => void :
  () => void

// ============ PROPS GETTERS ============

interface ContainerProps {
  ref: (el: HTMLElement | null) => void
  'data-selectkit': ''
  'data-open': string
  'data-disabled': string
  'data-focused': string
  'data-multiple': string
  'data-searchable': string
  'data-loading': string
}

interface TriggerProps {
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
  onClick: (e: MouseEvent) => void
  onKeyDown: (e: KeyboardEvent) => void
  onMouseDown: (e: MouseEvent) => void
}

interface InputProps {
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
  onChange: (e: Event) => void
  onFocus: (e: FocusEvent) => void
  onBlur: (e: FocusEvent) => void
  onKeyDown: (e: KeyboardEvent) => void
  onCompositionStart: (e: CompositionEvent) => void
  onCompositionEnd: (e: CompositionEvent) => void
}

interface MenuProps {
  ref: (el: HTMLElement | null) => void
  id: string
  role: 'listbox'
  'aria-label': string | undefined
  'aria-labelledby': string | undefined
  'aria-multiselectable': boolean | undefined
  tabIndex: -1
  onMouseDown: (e: MouseEvent) => void
}

interface OptionProps {
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
  onClick: (e: MouseEvent) => void
  onMouseEnter: (e: MouseEvent) => void
  onMouseMove: (e: MouseEvent) => void
}

interface GroupProps {
  role: 'group'
  'aria-labelledby': string
}

interface ClearButtonProps {
  type: 'button'
  'aria-label': string
  tabIndex: -1
  onClick: (e: MouseEvent) => void
  onMouseDown: (e: MouseEvent) => void
}

interface TagProps {
  'data-tag': ''
  'data-value': string
  'data-index': number
}

interface TagRemoveProps {
  type: 'button'
  'aria-label': string
  tabIndex: -1
  onClick: (e: MouseEvent) => void
  onMouseDown: (e: MouseEvent) => void
}
```

---

## FACTORY FUNCTION

```typescript
import { createSelect } from '@oxog/selectkit'

// ===== BASIC USAGE =====

const select = createSelect({
  options: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ],
  onChange: (value) => console.log('Selected:', value),
})

select.mount(document.getElementById('select-container'))


// ===== FULL CONFIGURATION =====

const select = createSelect({
  // Options
  options: [
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2', disabled: true },
    { value: 3, label: 'Option 3', description: 'With description' },
  ],
  
  // Value
  defaultValue: 1,
  
  // Mode
  multiple: false,
  searchable: true,
  creatable: false,
  clearable: true,
  
  // Search
  filterFn: (option, search) => {
    return option.label.toLowerCase().includes(search.toLowerCase())
  },
  searchDebounce: 0,
  minSearchLength: 0,
  
  // Display
  placeholder: 'Select an option...',
  noOptionsMessage: 'No options available',
  loadingMessage: 'Loading...',
  
  // Behavior
  closeOnSelect: true,
  blurOnSelect: false,
  openOnFocus: false,
  openOnClick: true,
  disabled: false,
  required: false,
  
  // Virtualization
  virtualize: false,
  itemHeight: 40,
  maxHeight: 300,
  
  // Positioning
  placement: 'bottom',
  flip: true,
  
  // Callbacks
  onChange: (value, option, action) => {
    console.log('Changed:', value, action.type)
  },
  onSearch: (search) => {
    console.log('Searching:', search)
  },
  onOpen: () => console.log('Opened'),
  onClose: () => console.log('Closed'),
  
  // Accessibility
  id: 'my-select',
  name: 'mySelect',
  ariaLabel: 'Select an option',
})
```

---

## BASIC SELECT

```typescript
import { createSelect } from '@oxog/selectkit'


// ============ SIMPLE SELECT ============

const select = createSelect({
  options: [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
  ],
  placeholder: 'Select a color...',
  onChange: (value, option) => {
    console.log('Selected:', value)
    console.log('Option:', option)
  },
})

select.mount(document.getElementById('container'))


// ============ WITH DEFAULT VALUE ============

const select = createSelect({
  options: countries,
  defaultValue: 'us',
})


// ============ CONTROLLED VALUE ============

const select = createSelect({
  options: users,
})

// Set value programmatically
select.setValue('user-123')

// Get current value
const currentValue = select.getValue()

// Clear value
select.clearValue()


// ============ DISABLED OPTIONS ============

const select = createSelect({
  options: [
    { value: 'free', label: 'Free Plan' },
    { value: 'pro', label: 'Pro Plan' },
    { value: 'enterprise', label: 'Enterprise', disabled: true },
  ],
})


// ============ WITH ICONS ============

const select = createSelect({
  options: [
    { value: 'home', label: 'Home', icon: '🏠' },
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'travel', label: 'Travel', icon: '✈️' },
  ],
})


// ============ WITH DESCRIPTIONS ============

const select = createSelect({
  options: [
    { 
      value: 'standard', 
      label: 'Standard Shipping',
      description: '5-7 business days'
    },
    { 
      value: 'express', 
      label: 'Express Shipping',
      description: '2-3 business days'
    },
    { 
      value: 'overnight', 
      label: 'Overnight Shipping',
      description: 'Next business day'
    },
  ],
})
```

---

## SEARCHABLE SELECT

```typescript
import { createSelect } from '@oxog/selectkit'


// ============ BASIC SEARCHABLE ============

const select = createSelect({
  options: countries,
  searchable: true,
  placeholder: 'Search countries...',
})


// ============ WITH SEARCH CALLBACK ============

const select = createSelect({
  options: countries,
  searchable: true,
  
  onSearch: (search) => {
    console.log('User is searching:', search)
    // Track analytics, etc.
  },
})


// ============ CUSTOM FILTER FUNCTION ============

const select = createSelect({
  options: users,
  searchable: true,
  
  filterFn: (option, search) => {
    const query = search.toLowerCase()
    const label = option.label.toLowerCase()
    const email = option.data?.email?.toLowerCase() || ''
    
    return label.includes(query) || email.includes(query)
  },
})


// ============ MINIMUM SEARCH LENGTH ============

const select = createSelect({
  options: largeDataset,
  searchable: true,
  minSearchLength: 2, // Only filter after 2 characters
  
  noOptionsMessage: (search) => {
    if (search.length < 2) {
      return 'Type at least 2 characters to search'
    }
    return 'No results found'
  },
})


// ============ DEBOUNCED SEARCH ============

const select = createSelect({
  options: [],
  searchable: true,
  searchDebounce: 300,
  
  onSearch: async (search) => {
    if (search.length < 2) return
    
    const results = await searchAPI(search)
    select.setOptions(results)
  },
})


// ============ HIGHLIGHT MATCHES ============

const select = createSelect({
  options: items,
  searchable: true,
  
  formatOptionLabel: (option, { searchValue }) => {
    if (!searchValue) return option.label
    
    // Highlight matching text (handled in render)
    return option.label
  },
})
```

---

## MULTI-SELECT

```typescript
import { createSelect } from '@oxog/selectkit'


// ============ BASIC MULTI-SELECT ============

const select = createSelect({
  options: tags,
  multiple: true,
  placeholder: 'Select tags...',
  
  onChange: (values, options, action) => {
    console.log('Selected values:', values) // T[]
    console.log('Selected options:', options) // SelectOption<T>[]
    console.log('Action:', action.type) // 'select' | 'deselect' | etc.
  },
})


// ============ WITH DEFAULT VALUES ============

const select = createSelect({
  options: skills,
  multiple: true,
  defaultValue: ['javascript', 'typescript', 'react'],
})


// ============ WITH LIMITS ============

const select = createSelect({
  options: categories,
  multiple: true,
  
  // Maximum selections
  maxSelected: 5,
  
  // Minimum selections (prevents deselect below this)
  minSelected: 1,
})


// ============ CLEARABLE ============

const select = createSelect({
  options: items,
  multiple: true,
  clearable: true,
})

// Clear all selections
select.clearValue()


// ============ CLOSE ON SELECT ============

const select = createSelect({
  options: items,
  multiple: true,
  
  // Keep open after selection (default for multi)
  closeOnSelect: false,
})


// ============ REMOVE INDIVIDUAL TAGS ============

const select = createSelect({
  options: items,
  multiple: true,
})

// Remove specific option
select.deselectOption({ value: 'item-1', label: 'Item 1' })

// Toggle option
select.toggleOption({ value: 'item-2', label: 'Item 2' })


// ============ GET SELECTED OPTIONS ============

const select = createSelect({
  options: users,
  multiple: true,
})

// Get all selected options with full data
const selectedOptions = select.getSelectedOptions()
// [{ value: 1, label: 'User 1', data: {...} }, ...]
```

---

## CREATABLE SELECT

```typescript
import { createSelect } from '@oxog/selectkit'


// ============ BASIC CREATABLE ============

const select = createSelect({
  options: existingTags,
  searchable: true,
  creatable: true,
  
  onCreate: (inputValue) => {
    // Return new option
    return {
      value: inputValue.toLowerCase().replace(/\s+/g, '-'),
      label: inputValue,
    }
  },
})


// ============ ASYNC CREATE ============

const select = createSelect({
  options: [],
  searchable: true,
  creatable: true,
  
  onCreate: async (inputValue) => {
    // Save to server first
    const newTag = await api.createTag({ name: inputValue })
    
    return {
      value: newTag.id,
      label: newTag.name,
      data: newTag,
    }
  },
})


// ============ MULTI + CREATABLE ============

const select = createSelect({
  options: tags,
  multiple: true,
  searchable: true,
  creatable: true,
  
  onCreate: (inputValue) => ({
    value: `new-${Date.now()}`,
    label: inputValue,
    data: { isNew: true },
  }),
  
  createMessage: (search) => `Create "${search}"`,
})


// ============ VALIDATION BEFORE CREATE ============

const select = createSelect({
  options: emails,
  searchable: true,
  creatable: true,
  
  onCreate: (inputValue) => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inputValue)) {
      // Return null to prevent creation
      return null
    }
    
    return {
      value: inputValue,
      label: inputValue,
    }
  },
})
```

---

## ASYNC OPTIONS

```typescript
import { createSelect } from '@oxog/selectkit'


// ============ BASIC ASYNC LOAD ============

const select = createSelect({
  options: [],
  searchable: true,
  
  loadOptions: async (search, signal) => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(search)}`, {
      signal, // Support cancellation
    })
    const data = await response.json()
    
    return data.results.map(item => ({
      value: item.id,
      label: item.name,
      data: item,
    }))
  },
  
  loadingMessage: 'Searching...',
  noOptionsMessage: 'No results found',
})


// ============ LOAD ON OPEN ============

const select = createSelect({
  options: [],
  
  loadOptions: async () => {
    const response = await fetch('/api/options')
    return response.json()
  },
  
  onOpen: () => {
    // Trigger load when menu opens
    if (select.getOptions().length === 0) {
      select.setSearchValue('') // Triggers loadOptions
    }
  },
})


// ============ WITH DEBOUNCE ============

const select = createSelect({
  options: [],
  searchable: true,
  searchDebounce: 300,
  
  loadOptions: async (search) => {
    if (search.length < 2) {
      return [] // Don't search for short queries
    }
    
    const results = await searchAPI(search)
    return results
  },
})


// ============ CACHING RESULTS ============

const cache = new Map()

const select = createSelect({
  options: [],
  searchable: true,
  
  loadOptions: async (search) => {
    if (cache.has(search)) {
      return cache.get(search)
    }
    
    const results = await searchAPI(search)
    cache.set(search, results)
    return results
  },
})


// ============ ERROR HANDLING ============

const select = createSelect({
  options: [],
  searchable: true,
  
  loadOptions: async (search) => {
    try {
      return await searchAPI(search)
    } catch (error) {
      console.error('Failed to load options:', error)
      return [] // Return empty on error
    }
  },
})
```

---

## GROUPED OPTIONS

```typescript
import { createSelect } from '@oxog/selectkit'


// ============ ARRAY OF GROUPS ============

const select = createSelect({
  options: [
    {
      label: 'Fruits',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'orange', label: 'Orange' },
      ],
    },
    {
      label: 'Vegetables',
      options: [
        { value: 'carrot', label: 'Carrot' },
        { value: 'broccoli', label: 'Broccoli' },
        { value: 'spinach', label: 'Spinach' },
      ],
    },
  ],
})


// ============ USING GROUP PROPERTY ============

const select = createSelect({
  options: [
    { value: 'apple', label: 'Apple', group: 'Fruits' },
    { value: 'banana', label: 'Banana', group: 'Fruits' },
    { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
    { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
    { value: 'other', label: 'Other' }, // No group
  ],
})


// ============ SEARCHABLE GROUPED ============

const select = createSelect({
  options: groupedOptions,
  searchable: true,
  
  // Search filters within groups
  // Empty groups are hidden automatically
})


// ============ DYNAMIC GROUPS ============

const select = createSelect({
  options: [],
})

// Group options dynamically
const groupedByCategory = items.reduce((acc, item) => {
  const group = acc.find(g => g.label === item.category)
  if (group) {
    group.options.push({ value: item.id, label: item.name })
  } else {
    acc.push({
      label: item.category,
      options: [{ value: item.id, label: item.name }],
    })
  }
  return acc
}, [])

select.setOptions(groupedByCategory)
```

---

## VIRTUALIZED SELECT

```typescript
import { createSelect } from '@oxog/selectkit'


// ============ BASIC VIRTUALIZATION ============

const select = createSelect({
  options: largeDataset, // 10,000+ items
  
  virtualize: true,
  itemHeight: 40,
  maxHeight: 300,
})


// ============ WITH SEARCH ============

const select = createSelect({
  options: largeDataset,
  searchable: true,
  
  virtualize: true,
  itemHeight: 40,
  maxHeight: 400,
  overscan: 5, // Render 5 extra items above/below
})


// ============ DYNAMIC ITEM HEIGHT ============

const select = createSelect({
  options: itemsWithDescriptions,
  
  virtualize: true,
  maxHeight: 400,
  
  // Dynamic height based on option
  itemHeight: (option) => {
    if (option.description) {
      return 60 // Taller for items with description
    }
    return 40
  },
})


// ============ GROUPED + VIRTUALIZED ============

const select = createSelect({
  options: groupedLargeDataset,
  
  virtualize: true,
  itemHeight: 40,
  // Group headers have fixed height
})
```

---

## KEYBOARD NAVIGATION

```typescript
// Built-in keyboard support (automatic)

/*
KEYBOARD SHORTCUTS:

When closed:
- Enter / Space / ArrowDown / ArrowUp → Open menu
- Any character → Open and start searching (if searchable)

When open:
- ArrowDown → Highlight next option
- ArrowUp → Highlight previous option
- Home → Highlight first option
- End → Highlight last option
- PageDown → Move down 10 options
- PageUp → Move up 10 options
- Enter → Select highlighted option
- Space → Select highlighted (non-searchable) or type (searchable)
- Escape → Close menu
- Tab → Close menu and move focus

When multi-select:
- Backspace → Remove last selected tag (when input empty)

When searchable:
- Any character → Filter options
- Escape → Clear search (if has search), then close
*/


// ============ PROGRAMMATIC NAVIGATION ============

const select = createSelect({ options })

// Navigation
select.highlightNext()
select.highlightPrev()
select.highlightFirst()
select.highlightLast()
select.highlightNextPage()  // +10
select.highlightPrevPage()  // -10

// Set specific index
select.setHighlightedIndex(5)

// Highlight specific option
select.highlightOption({ value: 'target', label: 'Target' })

// Select highlighted
select.selectHighlighted()

// Get highlighted
const highlighted = select.getHighlightedOption()
const index = select.getHighlightedIndex()
```

---

## CUSTOM RENDERING (HEADLESS)

```typescript
import { createSelect } from '@oxog/selectkit'


// ============ PROPS GETTERS ============

const select = createSelect({
  options: users,
  searchable: true,
})

// Build completely custom UI
function render() {
  const state = select.getState()
  
  // Container
  const container = document.createElement('div')
  const containerProps = select.getContainerProps()
  container.className = 'custom-select'
  Object.entries(containerProps).forEach(([key, value]) => {
    if (key === 'ref') {
      value(container)
    } else if (typeof value === 'function') {
      container.addEventListener(key.replace('on', '').toLowerCase(), value)
    } else {
      container.setAttribute(key, String(value))
    }
  })
  
  // Trigger
  const trigger = document.createElement('button')
  const triggerProps = select.getTriggerProps()
  applyProps(trigger, triggerProps)
  trigger.innerHTML = state.selectedOptions[0]?.label || 'Select...'
  container.appendChild(trigger)
  
  // Menu (if open)
  if (state.isOpen) {
    const menu = document.createElement('ul')
    const menuProps = select.getMenuProps()
    applyProps(menu, menuProps)
    menu.className = 'custom-menu'
    
    // Search input
    if (select.config.searchable) {
      const input = document.createElement('input')
      const inputProps = select.getInputProps()
      applyProps(input, inputProps)
      menu.appendChild(input)
    }
    
    // Options
    state.filteredOptions.forEach((option, index) => {
      const li = document.createElement('li')
      const optionProps = select.getOptionProps(option, index)
      applyProps(li, optionProps)
      
      li.className = [
        'custom-option',
        state.highlightedIndex === index ? 'highlighted' : '',
        select.isSelected(option) ? 'selected' : '',
        option.disabled ? 'disabled' : '',
      ].filter(Boolean).join(' ')
      
      li.innerHTML = `
        <img src="${option.data?.avatar}" class="avatar" />
        <div class="option-content">
          <span class="name">${option.label}</span>
          <span class="email">${option.data?.email}</span>
        </div>
        ${select.isSelected(option) ? '<span class="check">✓</span>' : ''}
      `
      
      menu.appendChild(li)
    })
    
    container.appendChild(menu)
  }
  
  return container
}


// ============ WITH TAGS (MULTI-SELECT) ============

function renderTags() {
  const selectedOptions = select.getSelectedOptions()
  
  const tagsContainer = document.createElement('div')
  tagsContainer.className = 'tags'
  
  selectedOptions.forEach((option, index) => {
    const tag = document.createElement('span')
    const tagProps = select.getTagProps(option, index)
    applyProps(tag, tagProps)
    tag.className = 'tag'
    
    const label = document.createElement('span')
    label.textContent = option.label
    tag.appendChild(label)
    
    const removeBtn = document.createElement('button')
    const removeProps = select.getTagRemoveProps(option)
    applyProps(removeBtn, removeProps)
    removeBtn.textContent = '×'
    tag.appendChild(removeBtn)
    
    tagsContainer.appendChild(tag)
  })
  
  return tagsContainer
}


// ============ SUBSCRIBE TO STATE ============

const unsubscribe = select.subscribe((state) => {
  // Re-render on state change
  const newUI = render()
  container.replaceChildren(newUI)
})

// Cleanup
unsubscribe()
select.destroy()
```

---

## REACT INTEGRATION

```tsx
import {
  // Hooks
  useSelect,
  useMultiSelect,
  useCombobox,
  
  // Components
  Select,
  MultiSelect,
  Combobox,
  Autocomplete,
  
  // Parts
  SelectProvider,
  SelectTrigger,
  SelectValue,
  SelectInput,
  SelectClear,
  SelectMenu,
  SelectOption,
  SelectGroup,
  SelectGroupLabel,
  SelectTag,
  SelectTagRemove,
  SelectEmpty,
  SelectLoading,
  SelectCreate,
} from '@oxog/selectkit/react'


// ============ useSelect HOOK ============

function CustomSelect({ options, value, onChange }) {
  const {
    // State
    state,
    isOpen,
    isFocused,
    isLoading,
    highlightedIndex,
    highlightedOption,
    selectedOption,
    selectedOptions,
    searchValue,
    filteredOptions,
    
    // Actions
    open,
    close,
    toggle,
    selectOption,
    deselectOption,
    clearValue,
    setSearchValue,
    highlightNext,
    highlightPrev,
    
    // Props getters
    getContainerProps,
    getTriggerProps,
    getInputProps,
    getMenuProps,
    getOptionProps,
    getClearButtonProps,
  } = useSelect({
    options,
    value,
    onChange,
    searchable: true,
  })
  
  return (
    <div {...getContainerProps()} className="select-container">
      <button {...getTriggerProps()} className="select-trigger">
        {selectedOption?.label || 'Select...'}
        <ChevronIcon />
      </button>
      
      {isOpen && (
        <div {...getMenuProps()} className="select-menu">
          <input 
            {...getInputProps()} 
            className="select-input"
            placeholder="Search..."
          />
          
          {filteredOptions.length === 0 ? (
            <div className="select-empty">No options</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                {...getOptionProps(option, index)}
                className={`select-option ${
                  highlightedIndex === index ? 'highlighted' : ''
                } ${
                  selectedOption?.value === option.value ? 'selected' : ''
                }`}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}


// ============ useMultiSelect HOOK ============

function TagInput({ options, value, onChange }) {
  const {
    selectedOptions,
    filteredOptions,
    isOpen,
    highlightedIndex,
    searchValue,
    getContainerProps,
    getInputProps,
    getMenuProps,
    getOptionProps,
    getTagProps,
    getTagRemoveProps,
    deselectOption,
  } = useMultiSelect({
    options,
    value,
    onChange,
    searchable: true,
  })
  
  return (
    <div {...getContainerProps()} className="tag-input">
      <div className="tags-wrapper">
        {selectedOptions.map((option, index) => (
          <span key={option.value} {...getTagProps(option, index)} className="tag">
            {option.label}
            <button {...getTagRemoveProps(option)} className="tag-remove">
              ×
            </button>
          </span>
        ))}
        <input {...getInputProps()} placeholder="Add tags..." />
      </div>
      
      {isOpen && (
        <ul {...getMenuProps()} className="tag-menu">
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              {...getOptionProps(option, index)}
              className={highlightedIndex === index ? 'highlighted' : ''}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


// ============ useCombobox HOOK ============

function SearchCombobox({ options, onSelect }) {
  const {
    inputValue,
    isOpen,
    highlightedIndex,
    filteredOptions,
    getInputProps,
    getMenuProps,
    getOptionProps,
  } = useCombobox({
    options,
    onSelect,
    openOnFocus: true,
  })
  
  return (
    <div className="combobox">
      <input {...getInputProps()} placeholder="Type to search..." />
      
      {isOpen && filteredOptions.length > 0 && (
        <ul {...getMenuProps()}>
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              {...getOptionProps(option, index)}
              className={highlightedIndex === index ? 'highlighted' : ''}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

---

## REACT COMPONENTS

```tsx
// ============ Select COMPONENT ============

<Select
  options={countries}
  value={selectedCountry}
  onChange={setSelectedCountry}
  placeholder="Select a country..."
  searchable
  clearable
/>

// With all props
<Select
  options={users}
  value={selectedUser}
  onChange={setSelectedUser}
  defaultValue="user-1"
  placeholder="Select user..."
  searchable
  clearable
  disabled={isLoading}
  required
  closeOnSelect
  openOnFocus={false}
  filterFn={(option, search) => 
    option.label.toLowerCase().includes(search.toLowerCase())
  }
  noOptionsMessage="No users found"
  loadingMessage="Loading..."
  className="user-select"
  menuClassName="user-menu"
/>


// ============ MultiSelect COMPONENT ============

<MultiSelect
  options={skills}
  value={selectedSkills}
  onChange={setSelectedSkills}
  placeholder="Select skills..."
  searchable
  clearable
  maxSelected={10}
  minSelected={1}
/>

// Creatable multi-select
<MultiSelect
  options={tags}
  value={selectedTags}
  onChange={setSelectedTags}
  creatable
  onCreate={(value) => ({ value, label: value })}
  createMessage={(search) => `Create "${search}"`}
/>


// ============ Combobox COMPONENT ============

<Combobox
  options={suggestions}
  value={inputValue}
  onChange={setInputValue}
  onSelect={handleSelect}
  placeholder="Search..."
  loadOptions={searchAPI}
  debounce={300}
  minSearchLength={2}
/>


// ============ Autocomplete COMPONENT ============

<Autocomplete
  options={cities}
  value={selectedCity}
  onChange={setSelectedCity}
  placeholder="Enter city name..."
  freeSolo // Allow custom values not in options
/>


// ============ ASYNC SELECT ============

<Select
  options={[]}
  value={selected}
  onChange={setSelected}
  searchable
  loadOptions={async (search) => {
    const results = await searchUsers(search)
    return results.map(user => ({
      value: user.id,
      label: user.name,
      data: user,
    }))
  }}
  loadingMessage="Searching..."
  noOptionsMessage="No users found"
/>


// ============ GROUPED SELECT ============

<Select
  options={[
    {
      label: 'Popular',
      options: popularCountries,
    },
    {
      label: 'All Countries',
      options: allCountries,
    },
  ]}
  value={country}
  onChange={setCountry}
  searchable
/>


// ============ VIRTUALIZED SELECT ============

<Select
  options={tenThousandItems}
  value={selected}
  onChange={setSelected}
  virtualize
  itemHeight={40}
  maxHeight={300}
  searchable
/>
```

---

## COMPOSABLE REACT PARTS

```tsx
// ============ FULL COMPOSABLE EXAMPLE ============

<SelectProvider
  options={users}
  value={selectedUser}
  onChange={setSelectedUser}
  searchable
>
  <div className="custom-select">
    <SelectTrigger className="trigger">
      <SelectValue placeholder="Select user...">
        {(option) => (
          <div className="selected-user">
            <Avatar src={option.data.avatar} />
            <span>{option.label}</span>
          </div>
        )}
      </SelectValue>
      <SelectClear className="clear-btn" />
      <ChevronIcon />
    </SelectTrigger>
    
    <SelectMenu className="menu">
      <div className="search-wrapper">
        <SearchIcon />
        <SelectInput placeholder="Search users..." />
      </div>
      
      <SelectLoading>
        <Spinner /> Loading...
      </SelectLoading>
      
      <SelectEmpty>
        No users found
      </SelectEmpty>
      
      <div className="options">
        {(filteredOptions) => 
          filteredOptions.map((option, index) => (
            <SelectOption
              key={option.value}
              option={option}
              index={index}
              className="option"
            >
              {({ isSelected, isHighlighted }) => (
                <div className={`option-content ${isHighlighted ? 'hl' : ''}`}>
                  <Avatar src={option.data.avatar} />
                  <div className="info">
                    <span className="name">{option.label}</span>
                    <span className="email">{option.data.email}</span>
                  </div>
                  {isSelected && <CheckIcon />}
                </div>
              )}
            </SelectOption>
          ))
        }
      </div>
    </SelectMenu>
  </div>
</SelectProvider>


// ============ MULTI-SELECT WITH TAGS ============

<SelectProvider
  options={tags}
  value={selectedTags}
  onChange={setSelectedTags}
  multiple
  searchable
  creatable
>
  <div className="tag-select">
    <SelectTrigger className="trigger">
      <div className="tags">
        {(selectedOptions) =>
          selectedOptions.map((option, index) => (
            <SelectTag key={option.value} option={option} index={index}>
              {option.label}
              <SelectTagRemove option={option}>×</SelectTagRemove>
            </SelectTag>
          ))
        }
        <SelectInput placeholder="Add tags..." />
      </div>
    </SelectTrigger>
    
    <SelectMenu>
      <SelectCreate>
        {(inputValue) => `Create "${inputValue}"`}
      </SelectCreate>
      
      {(filteredOptions) =>
        filteredOptions.map((option, index) => (
          <SelectOption key={option.value} option={option} index={index}>
            {option.label}
          </SelectOption>
        ))
      }
    </SelectMenu>
  </div>
</SelectProvider>


// ============ GROUPED OPTIONS ============

<SelectProvider options={groupedOptions} value={value} onChange={onChange}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  
  <SelectMenu>
    {(groups) =>
      groups.map((group) => (
        <SelectGroup key={group.label} group={group}>
          <SelectGroupLabel>{group.label}</SelectGroupLabel>
          {group.options.map((option, index) => (
            <SelectOption key={option.value} option={option} index={index}>
              {option.label}
            </SelectOption>
          ))}
        </SelectGroup>
      ))
    }
  </SelectMenu>
</SelectProvider>
```

---

## ACCESSIBILITY

```typescript
// ============ BUILT-IN WAI-ARIA SUPPORT ============

/*
ROLES:
- combobox: Trigger/input element
- listbox: Menu/dropdown
- option: Each selectable option
- group: Option groups

ARIA ATTRIBUTES:
- aria-expanded: Menu open state
- aria-haspopup: "listbox"
- aria-controls: Links trigger to menu
- aria-activedescendant: Currently highlighted option
- aria-selected: Selection state
- aria-disabled: Disabled state
- aria-multiselectable: Multiple selection mode
- aria-label / aria-labelledby: Accessible name
- aria-describedby: Additional description
- aria-required: Required field
- aria-invalid: Validation state

KEYBOARD:
- Full arrow key navigation
- Home/End for first/last
- PageUp/PageDown for jumping
- Enter/Space for selection
- Escape to close
- Tab to move focus
- Type-ahead search
*/


// ============ CUSTOM ARIA LABELS ============

const select = createSelect({
  options: countries,
  
  ariaLabel: 'Select your country',
  // or
  ariaLabelledBy: 'country-label-id',
  ariaDescribedBy: 'country-help-id',
})


// ============ SCREEN READER ANNOUNCEMENTS ============

// SelectKit automatically announces:
// - Number of options available
// - Current position when navigating
// - Selected option
// - Search results count


// ============ FOCUS MANAGEMENT ============

// - Focus trap within menu
// - Focus returns to trigger on close
// - Roving tabindex for options
```

---

## TECHNICAL REQUIREMENTS

| Requirement | Value |
|-------------|-------|
| Runtime | Browser |
| Module | ESM + CJS |
| TypeScript | Strict mode |
| Dependencies | ZERO |
| Test Coverage | 100% |
| Bundle Size | < 4KB core |

---

## PROJECT STRUCTURE

```
selectkit/
├── src/
│   ├── index.ts                    # Main exports
│   ├── types.ts                    # Type definitions
│   │
│   ├── core/
│   │   ├── select.ts               # Main Select class
│   │   ├── state.ts                # State management
│   │   ├── options.ts              # Options processing
│   │   ├── filter.ts               # Filtering logic
│   │   └── events.ts               # Event emitter
│   │
│   ├── features/
│   │   ├── search.ts               # Search functionality
│   │   ├── multi.ts                # Multi-select logic
│   │   ├── create.ts               # Creatable logic
│   │   ├── async.ts                # Async loading
│   │   ├── virtualize.ts           # Virtualization
│   │   └── keyboard.ts             # Keyboard navigation
│   │
│   ├── props/
│   │   ├── container.ts            # Container props
│   │   ├── trigger.ts              # Trigger props
│   │   ├── input.ts                # Input props
│   │   ├── menu.ts                 # Menu props
│   │   ├── option.ts               # Option props
│   │   └── tag.ts                  # Tag props
│   │
│   ├── utils/
│   │   ├── dom.ts                  # DOM utilities
│   │   ├── id.ts                   # ID generation
│   │   ├── scroll.ts               # Scroll utilities
│   │   └── debounce.ts             # Debounce utility
│   │
│   ├── adapters/
│   │   └── react/
│   │       ├── index.ts
│   │       ├── context.ts
│   │       ├── hooks/
│   │       │   ├── useSelect.ts
│   │       │   ├── useMultiSelect.ts
│   │       │   └── useCombobox.ts
│   │       └── components/
│   │           ├── Select.tsx
│   │           ├── MultiSelect.tsx
│   │           ├── Combobox.tsx
│   │           ├── Autocomplete.tsx
│   │           ├── SelectProvider.tsx
│   │           ├── SelectTrigger.tsx
│   │           ├── SelectValue.tsx
│   │           ├── SelectInput.tsx
│   │           ├── SelectClear.tsx
│   │           ├── SelectMenu.tsx
│   │           ├── SelectOption.tsx
│   │           ├── SelectGroup.tsx
│   │           ├── SelectTag.tsx
│   │           ├── SelectEmpty.tsx
│   │           ├── SelectLoading.tsx
│   │           └── SelectCreate.tsx
│   │
│   └── accessibility.ts            # A11y utilities
│
├── tests/
│   ├── unit/
│   │   ├── core/
│   │   ├── features/
│   │   └── props/
│   ├── integration/
│   │   ├── select.test.ts
│   │   ├── multi.test.ts
│   │   ├── async.test.ts
│   │   ├── keyboard.test.ts
│   │   ├── a11y.test.ts
│   │   └── react.test.tsx
│   └── fixtures/
│
├── examples/
│   ├── basic/
│   ├── searchable/
│   ├── multi/
│   ├── creatable/
│   ├── async/
│   ├── grouped/
│   ├── virtualized/
│   └── react/
│
├── website/
│   └── [See WEBSITE section]
│
├── .github/
│   └── workflows/
│       └── deploy-website.yml
│
├── SPECIFICATION.md
├── IMPLEMENTATION.md
├── TASKS.md
├── README.md
├── CHANGELOG.md
├── LICENSE
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── vitest.config.ts
```

---

## DOCUMENTATION WEBSITE

Build a modern documentation site using React + Vite.

### Technology Stack (MANDATORY)

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18+ | UI framework |
| **Vite** | 5+ | Build tool |
| **TypeScript** | 5+ | Type safety |
| **Tailwind CSS** | 3+ | Styling (npm, NOT CDN) |
| **shadcn/ui** | Latest | UI components |
| **React Router** | 6+ | Routing |
| **Lucide React** | Latest | Icons |
| **Framer Motion** | Latest | Animations |
| **Prism.js** | Latest | Syntax highlighting |

### Fonts (MANDATORY)

- **JetBrains Mono** - ALL code
- **Inter** - Body text

### Required Pages

1. **Home** (`/`)
   - Hero with interactive select demo
   - Feature highlights
   - Install command
   - Quick examples

2. **Getting Started** (`/docs/getting-started`)
   - Installation
   - Quick start
   - Basic concepts

3. **Select Types** (`/docs/select/*`)
   - Basic select
   - Searchable
   - Multi-select
   - Creatable
   - Async

4. **Features** (`/docs/features/*`)
   - Grouped options
   - Virtualization
   - Keyboard navigation
   - Custom filtering

5. **Customization** (`/docs/customization`)
   - Props getters
   - Custom rendering
   - Styling

6. **Accessibility** (`/docs/accessibility`)
   - ARIA attributes
   - Keyboard support
   - Screen readers

7. **API Reference** (`/docs/api/*`)
   - createSelect
   - Select instance
   - Props getters
   - Types

8. **React Guide** (`/docs/react/*`)
   - Hooks
   - Components
   - Composable parts

9. **Examples** (`/examples`)
    - Country selector
    - User picker
    - Tag input
    - Async search

### Design Theme

- Indigo/violet accent (#6366f1) - Select/form theme
- Dark mode default
- Light mode support

### GitHub Actions

```yaml
# .github/workflows/deploy-website.yml
name: Deploy Website

on:
  push:
    branches: [main]
    paths:
      - 'website/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: website/package-lock.json
      - run: cd website && npm ci
      - run: cd website && npm run build
      - run: echo "selectkit.oxog.dev" > website/dist/CNAME
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: website/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

---

## README.md

````markdown
# SelectKit

<div align="center">
  <img src="website/public/logo.svg" alt="SelectKit" width="120" />
  <h3>Headless, accessible select and combobox</h3>
  <p>
    <a href="https://selectkit.oxog.dev">Documentation</a> •
    <a href="https://selectkit.oxog.dev/docs/getting-started">Getting Started</a> •
    <a href="https://selectkit.oxog.dev/examples">Examples</a>
  </p>
</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/@oxog/selectkit.svg)](https://www.npmjs.com/package/@oxog/selectkit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@oxog/selectkit)](https://bundlephobia.com/package/@oxog/selectkit)
[![license](https://img.shields.io/npm/l/@oxog/selectkit.svg)](LICENSE)

</div>

---

## Features

- 🎯 **Single Select** - Classic dropdown
- 🏷️ **Multi-Select** - With tags
- 🔍 **Searchable** - Filter options
- ➕ **Creatable** - Add new options
- ⚡ **Async** - Load options dynamically
- 📁 **Grouped** - Organize options
- 📜 **Virtualized** - Handle large lists
- ⌨️ **Keyboard** - Full navigation
- ♿ **Accessible** - WAI-ARIA compliant
- 🎨 **Headless** - Full customization
- ⚛️ **React** - Hooks & components
- 📦 **Zero Dependencies**
- ⚡ **< 4KB** - Tiny bundle

## Installation

```bash
npm install @oxog/selectkit
```

## Quick Start

```typescript
import { createSelect } from '@oxog/selectkit'

const select = createSelect({
  options: [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
  ],
  searchable: true,
  onChange: (value) => console.log(value),
})

select.mount(document.getElementById('container'))
```

## React

```tsx
import { Select, MultiSelect } from '@oxog/selectkit/react'

// Single select
<Select
  options={frameworks}
  value={selected}
  onChange={setSelected}
  searchable
/>

// Multi-select
<MultiSelect
  options={skills}
  value={selectedSkills}
  onChange={setSelectedSkills}
  creatable
/>
```

## Documentation

Visit [selectkit.oxog.dev](https://selectkit.oxog.dev) for full documentation.

## License

MIT © [Ersin KOÇ](https://github.com/ersinkoc)
````

---

## IMPLEMENTATION CHECKLIST

### Before Implementation
- [ ] Create SPECIFICATION.md
- [ ] Create IMPLEMENTATION.md
- [ ] Create TASKS.md

### Core
- [ ] Select class
- [ ] State management
- [ ] Options processing
- [ ] Event emitter

### Features
- [ ] Single select
- [ ] Multi-select
- [ ] Searchable
- [ ] Creatable
- [ ] Async loading
- [ ] Grouped options
- [ ] Virtualization
- [ ] Keyboard navigation

### Props Getters
- [ ] Container props
- [ ] Trigger props
- [ ] Input props
- [ ] Menu props
- [ ] Option props
- [ ] Tag props

### React Adapter
- [ ] useSelect
- [ ] useMultiSelect
- [ ] useCombobox
- [ ] Select component
- [ ] MultiSelect component
- [ ] Combobox component
- [ ] Composable parts

### Testing
- [ ] 100% coverage
- [ ] Accessibility tests
- [ ] All tests passing

### Website
- [ ] React + Vite setup
- [ ] All pages
- [ ] Interactive examples
- [ ] GitHub Actions

---

## BEGIN IMPLEMENTATION

Start by creating SPECIFICATION.md with the complete package specification. Then proceed with IMPLEMENTATION.md and TASKS.md before writing any actual code.

Remember: This package will be published to NPM. It must be production-ready, zero-dependency, fully tested, and professionally documented.

**Date: 2025-12-30**
**Author: Ersin KOÇ**
**Repository: github.com/ersinkoc/selectkit**
**Website: selectkit.oxog.dev**
