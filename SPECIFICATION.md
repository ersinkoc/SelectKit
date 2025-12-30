# SelectKit - Complete Package Specification

## Overview

**SelectKit** is a headless, accessible select and combobox library for building custom select components with zero runtime dependencies.

| Property | Value |
|----------|-------|
| Package Name | `@oxog/selectkit` |
| Version | `1.0.0` |
| License | MIT |
| Author | Ersin KOÇ |
| Repository | https://github.com/ersinkoc/selectkit |
| Documentation | https://selectkit.oxog.dev |
| Bundle Size | < 4KB (core), < 6KB (with React) |
| Dependencies | Zero |
| Test Coverage | 100% |

---

## Core Concepts

### 1. Headless Architecture

SelectKit provides **no UI** out of the box. Instead, it provides:

- **State Management**: Centralized state for all select functionality
- **Props Getters**: Functions that return props to spread on your elements
- **Event Handlers**: Pre-configured event handlers for interactions
- **ARIA Attributes**: Accessibility attributes for screen readers

This allows complete control over styling and structure while handling complex logic internally.

### 2. Framework Agnostic

The core library works with vanilla JavaScript and any framework. React adapters are provided as a separate export.

### 3. Zero Dependencies

Everything is implemented from scratch:
- Event emitter
- Debounce utility
- Virtual scrolling
- ID generation
- DOM utilities

---

## Feature Specification

### 1. Single Select

**Description**: Basic dropdown select with single value selection.

**Capabilities**:
- Select one option from a list
- Display selected value in trigger
- Clear selection (if clearable)
- Disabled state support
- Required field support

**Configuration**:
```typescript
{
  multiple: false,  // Default
  clearable: boolean,
  disabled: boolean,
  required: boolean,
  defaultValue: T | null,
  onChange: (value: T | null, option: SelectOption<T> | null, action: ChangeAction) => void
}
```

### 2. Multi-Select

**Description**: Select multiple values with tag display.

**Capabilities**:
- Select multiple options
- Display as tags/chips
- Remove individual tags
- Clear all selections
- Min/max selection limits
- Backspace to remove last

**Configuration**:
```typescript
{
  multiple: true,
  maxSelected: number,
  minSelected: number,
  closeOnSelect: boolean,  // false for multi
  onChange: (values: T[], options: SelectOption<T>[], action: ChangeAction) => void
}
```

### 3. Searchable

**Description**: Filter options by typing.

**Capabilities**:
- Text input for filtering
- Custom filter function
- Highlight matching text
- Minimum search length
- Search debounce
- Clear search on close

**Configuration**:
```typescript
{
  searchable: true,
  filterFn: (option: SelectOption<T>, search: string) => boolean,
  searchDebounce: number,
  minSearchLength: number,
  onSearch: (search: string) => void
}
```

### 4. Creatable

**Description**: Allow creating new options from search input.

**Capabilities**:
- Create option from search value
- Async creation support
- Validation before creation
- Custom create message

**Configuration**:
```typescript
{
  creatable: true,
  onCreate: (inputValue: string) => SelectOption<T> | Promise<SelectOption<T>> | null,
  createMessage: string | ((search: string) => string)
}
```

### 5. Async Loading

**Description**: Load options from remote source.

**Capabilities**:
- Async option loading
- AbortController support
- Loading state
- Error handling
- Caching support (user-land)

**Configuration**:
```typescript
{
  loadOptions: (search: string, signal: AbortSignal) => Promise<SelectOption<T>[]>,
  loadingMessage: string
}
```

### 6. Grouped Options

**Description**: Organize options into groups.

**Capabilities**:
- Group headers
- Nested option structure
- Group property on options
- Search within groups

**Input Formats**:
```typescript
// Format 1: Array of groups
[
  { label: 'Group 1', options: [...] },
  { label: 'Group 2', options: [...] }
]

// Format 2: Options with group property
[
  { value: 1, label: 'A', group: 'Group 1' },
  { value: 2, label: 'B', group: 'Group 1' },
  { value: 3, label: 'C', group: 'Group 2' }
]
```

### 7. Virtualization

**Description**: Efficiently render large option lists.

**Capabilities**:
- Only render visible items
- Dynamic item heights
- Overscan for smooth scrolling
- Keyboard navigation support

**Configuration**:
```typescript
{
  virtualize: true,
  itemHeight: number | ((option: SelectOption<T>) => number),
  overscan: number,
  maxHeight: number
}
```

### 8. Keyboard Navigation

**Description**: Full keyboard support.

**Key Bindings** (when closed):
| Key | Action |
|-----|--------|
| Enter | Open menu |
| Space | Open menu |
| ArrowDown | Open menu |
| ArrowUp | Open menu |
| Character | Open and search (if searchable) |

**Key Bindings** (when open):
| Key | Action |
|-----|--------|
| ArrowDown | Highlight next |
| ArrowUp | Highlight previous |
| Home | Highlight first |
| End | Highlight last |
| PageDown | Move down 10 |
| PageUp | Move up 10 |
| Enter | Select highlighted |
| Space | Select (non-searchable) |
| Escape | Close / Clear search |
| Tab | Close and move focus |
| Backspace | Remove last tag (multi) |

### 9. Accessibility

**ARIA Roles**:
| Element | Role |
|---------|------|
| Trigger/Input | combobox |
| Menu | listbox |
| Option | option |
| Group | group |

**ARIA Attributes**:
- `aria-expanded`: Menu open state
- `aria-haspopup`: "listbox"
- `aria-controls`: Links trigger to menu
- `aria-activedescendant`: Highlighted option ID
- `aria-selected`: Selection state
- `aria-disabled`: Disabled state
- `aria-multiselectable`: Multi-select mode
- `aria-label` / `aria-labelledby`: Accessible name
- `aria-describedby`: Additional description
- `aria-required`: Required field
- `aria-invalid`: Validation state

---

## State Structure

```typescript
interface SelectState<T = unknown> {
  // Open state
  isOpen: boolean

  // Value state
  value: T | T[] | null
  selectedOptions: SelectOption<T>[]

  // Search state
  searchValue: string

  // Options state
  options: SelectOption<T>[]
  filteredOptions: SelectOption<T>[]
  flatOptions: SelectOption<T>[]  // Flattened from groups

  // Highlight state
  highlightedIndex: number
  highlightedOption: SelectOption<T> | null

  // Loading state
  isLoading: boolean

  // Focus state
  isFocused: boolean

  // Disabled state
  isDisabled: boolean
}
```

---

## Props Getters Specification

### getContainerProps()

Returns props for the root container element.

```typescript
interface ContainerProps {
  ref: (el: HTMLElement | null) => void
  'data-selectkit': ''
  'data-open': 'true' | 'false'
  'data-disabled': 'true' | 'false'
  'data-focused': 'true' | 'false'
  'data-multiple': 'true' | 'false'
  'data-searchable': 'true' | 'false'
  'data-loading': 'true' | 'false'
}
```

### getTriggerProps()

Returns props for the trigger button (non-searchable mode).

```typescript
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
```

### getInputProps()

Returns props for the search input element.

```typescript
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
```

### getMenuProps()

Returns props for the dropdown menu container.

```typescript
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
```

### getOptionProps(option, index)

Returns props for each option element.

```typescript
interface OptionProps {
  ref: (el: HTMLElement | null) => void
  id: string
  role: 'option'
  'aria-selected': boolean
  'aria-disabled': boolean
  'data-highlighted': 'true' | 'false'
  'data-selected': 'true' | 'false'
  'data-disabled': 'true' | 'false'
  'data-index': number
  tabIndex: -1
  onClick: (e: MouseEvent) => void
  onMouseEnter: (e: MouseEvent) => void
  onMouseMove: (e: MouseEvent) => void
}
```

### getGroupProps(group)

Returns props for option group containers.

```typescript
interface GroupProps {
  role: 'group'
  'aria-labelledby': string
}
```

### getClearButtonProps()

Returns props for the clear button.

```typescript
interface ClearButtonProps {
  type: 'button'
  'aria-label': string
  tabIndex: -1
  onClick: (e: MouseEvent) => void
  onMouseDown: (e: MouseEvent) => void
}
```

### getTagProps(option, index)

Returns props for tag elements in multi-select.

```typescript
interface TagProps {
  'data-tag': ''
  'data-value': string
  'data-index': number
}
```

### getTagRemoveProps(option)

Returns props for tag remove buttons.

```typescript
interface TagRemoveProps {
  type: 'button'
  'aria-label': string
  tabIndex: -1
  onClick: (e: MouseEvent) => void
  onMouseDown: (e: MouseEvent) => void
}
```

---

## Event System

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `(value, option, action)` | Value changed |
| `search` | `(searchValue)` | Search input changed |
| `open` | `()` | Menu opened |
| `close` | `()` | Menu closed |
| `focus` | `()` | Component focused |
| `blur` | `()` | Component blurred |
| `create` | `(option)` | New option created |
| `highlight` | `(option, index)` | Highlight changed |
| `loading` | `(isLoading)` | Loading state changed |

### Usage

```typescript
const select = createSelect({ options })

// Subscribe
const unsubscribe = select.on('change', (value, option, action) => {
  console.log('Changed:', value)
})

// Unsubscribe
unsubscribe()
// or
select.off('change', handler)
```

---

## React Adapter Specification

### Hooks

#### useSelect

```typescript
function useSelect<T>(config: SelectConfig<T>): {
  // State
  state: SelectState<T>
  isOpen: boolean
  isFocused: boolean
  isLoading: boolean
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
  clearValue: () => void
  setSearchValue: (value: string) => void
  highlightNext: () => void
  highlightPrev: () => void
  highlightFirst: () => void
  highlightLast: () => void
  setHighlightedIndex: (index: number) => void

  // Props getters
  getContainerProps: () => ContainerProps
  getTriggerProps: () => TriggerProps
  getInputProps: () => InputProps
  getMenuProps: () => MenuProps
  getOptionProps: (option: SelectOption<T>, index: number) => OptionProps
  getClearButtonProps: () => ClearButtonProps
  getTagProps: (option: SelectOption<T>, index: number) => TagProps
  getTagRemoveProps: (option: SelectOption<T>) => TagRemoveProps
}
```

#### useMultiSelect

Same as `useSelect` but with `multiple: true` forced.

#### useCombobox

Optimized for autocomplete/combobox patterns:

```typescript
function useCombobox<T>(config: ComboboxConfig<T>): {
  inputValue: string
  isOpen: boolean
  highlightedIndex: number
  filteredOptions: SelectOption<T>[]

  getInputProps: () => InputProps
  getMenuProps: () => MenuProps
  getOptionProps: (option: SelectOption<T>, index: number) => OptionProps
}
```

### Components

#### Select

Pre-built single select with default styling.

```tsx
<Select
  options={options}
  value={value}
  onChange={onChange}
  placeholder="Select..."
  searchable
  clearable
  disabled
  required
/>
```

#### MultiSelect

Pre-built multi-select with tag display.

```tsx
<MultiSelect
  options={options}
  value={values}
  onChange={setValues}
  placeholder="Select items..."
  searchable
  creatable
  maxSelected={5}
/>
```

#### Combobox

Pre-built combobox for autocomplete patterns.

```tsx
<Combobox
  options={suggestions}
  value={inputValue}
  onChange={setInputValue}
  onSelect={handleSelect}
  loadOptions={searchAPI}
/>
```

#### Autocomplete

Free-form input with suggestions.

```tsx
<Autocomplete
  options={cities}
  value={city}
  onChange={setCity}
  freeSolo
/>
```

### Composable Parts

For maximum customization:

- `SelectProvider` - Context provider
- `SelectTrigger` - Trigger button
- `SelectValue` - Selected value display
- `SelectInput` - Search input
- `SelectClear` - Clear button
- `SelectMenu` - Dropdown menu
- `SelectOption` - Option item
- `SelectGroup` - Option group
- `SelectGroupLabel` - Group label
- `SelectTag` - Selected tag
- `SelectTagRemove` - Tag remove button
- `SelectEmpty` - Empty state
- `SelectLoading` - Loading state
- `SelectCreate` - Create option prompt

---

## Bundle Specification

### Exports

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./react": {
      "import": "./dist/react/index.js",
      "require": "./dist/react/index.cjs",
      "types": "./dist/react/index.d.ts"
    }
  }
}
```

### Tree Shaking

All exports are tree-shakeable. Unused features are eliminated by bundlers.

### Bundle Size Targets

| Bundle | Target |
|--------|--------|
| Core (min+gzip) | < 4KB |
| React (min+gzip) | < 2KB additional |
| Total | < 6KB |

---

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

---

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

---

## Testing Requirements

### Coverage Target: 100%

- Statements: 100%
- Branches: 100%
- Functions: 100%
- Lines: 100%

### Test Categories

1. **Unit Tests**
   - State management
   - Options processing
   - Event emitter
   - Utilities
   - Filter functions

2. **Integration Tests**
   - Select lifecycle
   - Keyboard navigation
   - Multi-select behavior
   - Async loading
   - Creatable mode

3. **Accessibility Tests**
   - ARIA attributes
   - Keyboard support
   - Focus management

4. **React Tests**
   - Hook behavior
   - Component rendering
   - Event handling

---

## Error Handling

### Validation Errors

```typescript
// Invalid options format
throw new Error('SelectKit: Options must be an array')

// Missing required props
throw new Error('SelectKit: onChange is required when controlled')
```

### Runtime Errors

```typescript
// Graceful degradation for async errors
select.on('error', (error) => {
  console.error('SelectKit error:', error)
})
```

---

## Performance Considerations

1. **Virtualization**: Enable for lists > 100 items
2. **Debounce**: Use for async search (300ms recommended)
3. **Memoization**: React hooks memoize callbacks
4. **Event Delegation**: Single listener on container
5. **Lazy Initialization**: Defer menu creation until open

---

*Specification Version: 1.0.0*
*Last Updated: 2025-12-30*
