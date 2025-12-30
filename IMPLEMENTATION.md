# SelectKit - Implementation Guide

## Architecture Overview

SelectKit follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│                   React Adapter                      │
│  (hooks, components, context)                        │
├─────────────────────────────────────────────────────┤
│                   Props Getters                      │
│  (container, trigger, input, menu, option, tag)     │
├─────────────────────────────────────────────────────┤
│                     Features                         │
│  (search, multi, create, async, virtualize, kb)     │
├─────────────────────────────────────────────────────┤
│                       Core                           │
│  (select, state, options, events)                   │
├─────────────────────────────────────────────────────┤
│                     Utilities                        │
│  (dom, id, scroll, debounce)                        │
└─────────────────────────────────────────────────────┘
```

---

## Design Decisions

### 1. State Management

**Decision**: Custom observable state with immutable updates.

**Rationale**:
- Zero dependencies requirement
- Predictable state updates
- Easy subscription model
- Framework agnostic

**Implementation**:
```typescript
class StateManager<T> {
  private state: SelectState<T>
  private listeners: Set<(state: SelectState<T>) => void>

  getState(): SelectState<T> {
    return this.state
  }

  setState(partial: Partial<SelectState<T>>): void {
    this.state = { ...this.state, ...partial }
    this.notify()
  }

  subscribe(listener: (state: SelectState<T>) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.state))
  }
}
```

### 2. Event System

**Decision**: Custom event emitter with typed events.

**Rationale**:
- Type safety for event handlers
- Memory-safe with unsubscribe
- Simple API

**Implementation**:
```typescript
class EventEmitter<Events extends Record<string, unknown[]>> {
  private handlers = new Map<keyof Events, Set<Function>>()

  on<E extends keyof Events>(
    event: E,
    handler: (...args: Events[E]) => void
  ): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler)
    return () => this.off(event, handler)
  }

  off<E extends keyof Events>(
    event: E,
    handler: (...args: Events[E]) => void
  ): void {
    this.handlers.get(event)?.delete(handler)
  }

  emit<E extends keyof Events>(event: E, ...args: Events[E]): void {
    this.handlers.get(event)?.forEach(handler => handler(...args))
  }
}
```

### 3. Props Getters Pattern

**Decision**: Functions that return props objects for spreading.

**Rationale**:
- Headless architecture
- Maximum flexibility
- Automatic event wiring
- ARIA attribute management

**Implementation**:
```typescript
getOptionProps(option: SelectOption<T>, index: number): OptionProps {
  const isSelected = this.isSelected(option)
  const isHighlighted = this.state.highlightedIndex === index
  const isDisabled = option.disabled ?? false

  return {
    ref: (el) => this.setOptionRef(index, el),
    id: this.getOptionId(index),
    role: 'option',
    'aria-selected': isSelected,
    'aria-disabled': isDisabled,
    'data-highlighted': String(isHighlighted),
    'data-selected': String(isSelected),
    'data-disabled': String(isDisabled),
    'data-index': index,
    tabIndex: -1,
    onClick: (e) => this.handleOptionClick(e, option),
    onMouseEnter: () => this.handleOptionMouseEnter(index),
    onMouseMove: () => this.handleOptionMouseMove(index),
  }
}
```

### 4. Options Processing

**Decision**: Normalize all input formats to flat array internally.

**Rationale**:
- Consistent internal representation
- Simplified filtering and navigation
- Group information preserved

**Implementation**:
```typescript
function normalizeOptions<T>(
  options: Options<T>
): { flat: SelectOption<T>[]; grouped: GroupedOptions<T>[] } {
  // Handle grouped array format
  if (isGroupedArray(options)) {
    const grouped = options as GroupedOptions<T>[]
    const flat = grouped.flatMap(g => g.options)
    return { flat, grouped }
  }

  // Handle flat array with group property
  const flat = options as SelectOption<T>[]
  const grouped = groupByProperty(flat)
  return { flat, grouped }
}
```

### 5. Keyboard Navigation

**Decision**: Centralized keyboard handler with action mapping.

**Rationale**:
- Consistent behavior
- Easy to extend
- Testable

**Implementation**:
```typescript
const keyActions: Record<string, (select: Select) => void> = {
  ArrowDown: (s) => s.isOpen() ? s.highlightNext() : s.open(),
  ArrowUp: (s) => s.isOpen() ? s.highlightPrev() : s.open(),
  Enter: (s) => s.isOpen() ? s.selectHighlighted() : s.open(),
  Escape: (s) => s.close(),
  Home: (s) => s.highlightFirst(),
  End: (s) => s.highlightLast(),
  PageDown: (s) => s.highlightNextPage(),
  PageUp: (s) => s.highlightPrevPage(),
}

function handleKeyDown(select: Select, event: KeyboardEvent): void {
  const action = keyActions[event.key]
  if (action) {
    event.preventDefault()
    action(select)
  }
}
```

### 6. Virtualization

**Decision**: Simple windowing based on scroll position.

**Rationale**:
- No dependencies
- Handles large lists
- Supports variable heights

**Implementation**:
```typescript
interface VirtualState {
  startIndex: number
  endIndex: number
  offsetTop: number
  totalHeight: number
}

function calculateVirtualWindow(
  scrollTop: number,
  containerHeight: number,
  items: unknown[],
  itemHeight: number | ((index: number) => number),
  overscan: number
): VirtualState {
  // Calculate visible range
  // Apply overscan
  // Return indices and offsets
}
```

### 7. Async Loading

**Decision**: AbortController for cancellation, internal loading state.

**Rationale**:
- Native cancellation
- Prevents race conditions
- Clean API

**Implementation**:
```typescript
class AsyncLoader<T> {
  private controller: AbortController | null = null

  async load(
    loadFn: (search: string, signal: AbortSignal) => Promise<SelectOption<T>[]>,
    search: string
  ): Promise<SelectOption<T>[]> {
    // Cancel previous request
    this.controller?.abort()
    this.controller = new AbortController()

    try {
      return await loadFn(search, this.controller.signal)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return [] // Cancelled, ignore
      }
      throw error
    }
  }
}
```

### 8. React Integration

**Decision**: Sync external library state with React state via useSyncExternalStore.

**Rationale**:
- Proper React 18 concurrent mode support
- Automatic re-renders on state change
- SSR compatible

**Implementation**:
```typescript
function useSelect<T>(config: SelectConfig<T>) {
  const selectRef = useRef<Select<T>>()

  if (!selectRef.current) {
    selectRef.current = createSelect(config)
  }

  const state = useSyncExternalStore(
    selectRef.current.subscribe,
    selectRef.current.getState,
    selectRef.current.getState // SSR
  )

  // Update config on change
  useEffect(() => {
    selectRef.current?.updateConfig(config)
  }, [config])

  // Cleanup
  useEffect(() => {
    return () => selectRef.current?.destroy()
  }, [])

  return {
    state,
    ...selectRef.current
  }
}
```

---

## Module Structure

### Core Modules

#### `src/core/select.ts`
Main Select class that orchestrates all functionality.

```typescript
export class Select<T = unknown> {
  private config: SelectConfig<T>
  private state: StateManager<T>
  private events: EventEmitter<SelectEvents<T>>
  private refs: RefManager

  constructor(config: SelectConfig<T>) { }

  // Lifecycle
  mount(container: HTMLElement): void { }
  unmount(): void { }
  destroy(): void { }

  // State access
  getState(): SelectState<T> { }
  subscribe(cb: (state: SelectState<T>) => void): () => void { }

  // ... all other methods
}
```

#### `src/core/state.ts`
State management with immutable updates.

```typescript
export function createInitialState<T>(config: SelectConfig<T>): SelectState<T>
export function updateState<T>(state: SelectState<T>, updates: Partial<SelectState<T>>): SelectState<T>
```

#### `src/core/options.ts`
Options normalization and processing.

```typescript
export function normalizeOptions<T>(options: Options<T>): NormalizedOptions<T>
export function flattenOptions<T>(grouped: GroupedOptions<T>[]): SelectOption<T>[]
export function groupOptions<T>(options: SelectOption<T>[]): GroupedOptions<T>[]
export function findOptionByValue<T>(options: SelectOption<T>[], value: T): SelectOption<T> | undefined
```

#### `src/core/events.ts`
Type-safe event emitter.

```typescript
export class EventEmitter<Events extends Record<string, unknown[]>> {
  on<E extends keyof Events>(event: E, handler: (...args: Events[E]) => void): () => void
  off<E extends keyof Events>(event: E, handler: (...args: Events[E]) => void): void
  emit<E extends keyof Events>(event: E, ...args: Events[E]): void
}
```

### Feature Modules

#### `src/features/search.ts`
Search and filtering functionality.

```typescript
export function defaultFilter<T>(option: SelectOption<T>, search: string): boolean
export function filterOptions<T>(
  options: SelectOption<T>[],
  search: string,
  filterFn: FilterFn<T>
): SelectOption<T>[]
```

#### `src/features/multi.ts`
Multi-select logic.

```typescript
export function toggleSelection<T>(
  selected: SelectOption<T>[],
  option: SelectOption<T>,
  config: MultiConfig
): SelectOption<T>[]
export function canSelect<T>(selected: SelectOption<T>[], max?: number): boolean
export function canDeselect<T>(selected: SelectOption<T>[], min?: number): boolean
```

#### `src/features/create.ts`
Creatable mode logic.

```typescript
export function shouldShowCreate(
  search: string,
  options: SelectOption[],
  config: CreateConfig
): boolean
export async function createOption<T>(
  inputValue: string,
  onCreate: CreateFn<T>
): Promise<SelectOption<T> | null>
```

#### `src/features/async.ts`
Async loading with AbortController.

```typescript
export class AsyncLoader<T> {
  load(loadFn: LoadFn<T>, search: string): Promise<SelectOption<T>[]>
  cancel(): void
}
```

#### `src/features/virtualize.ts`
Virtual scrolling implementation.

```typescript
export function calculateVirtualWindow(config: VirtualConfig): VirtualState
export function getItemOffset(index: number, itemHeight: ItemHeight): number
export function getTotalHeight(count: number, itemHeight: ItemHeight): number
```

#### `src/features/keyboard.ts`
Keyboard navigation handler.

```typescript
export function handleKeyDown<T>(select: Select<T>, event: KeyboardEvent): boolean
export const keyBindings: Record<string, KeyAction>
```

### Props Modules

Each props getter in its own file for tree-shaking:

- `src/props/container.ts`
- `src/props/trigger.ts`
- `src/props/input.ts`
- `src/props/menu.ts`
- `src/props/option.ts`
- `src/props/group.ts`
- `src/props/clear.ts`
- `src/props/tag.ts`

### Utility Modules

#### `src/utils/dom.ts`
```typescript
export function scrollIntoView(element: HTMLElement, container: HTMLElement): void
export function isElementVisible(element: HTMLElement, container: HTMLElement): boolean
export function getScrollParent(element: HTMLElement): HTMLElement
```

#### `src/utils/id.ts`
```typescript
export function generateId(prefix?: string): string
export function getOptionId(baseId: string, index: number): string
export function getMenuId(baseId: string): string
```

#### `src/utils/scroll.ts`
```typescript
export function scrollToIndex(
  container: HTMLElement,
  index: number,
  itemHeight: number
): void
```

#### `src/utils/debounce.ts`
```typescript
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): T & { cancel: () => void }
```

---

## React Adapter Structure

### Hooks

#### `src/adapters/react/hooks/useSelect.ts`
```typescript
export function useSelect<T>(config: SelectConfig<T>): UseSelectReturn<T>
```

#### `src/adapters/react/hooks/useMultiSelect.ts`
```typescript
export function useMultiSelect<T>(config: MultiSelectConfig<T>): UseMultiSelectReturn<T>
```

#### `src/adapters/react/hooks/useCombobox.ts`
```typescript
export function useCombobox<T>(config: ComboboxConfig<T>): UseComboboxReturn<T>
```

### Components

Pre-built components with default styles:

- `Select.tsx`
- `MultiSelect.tsx`
- `Combobox.tsx`
- `Autocomplete.tsx`

### Composable Parts

Context-based parts for custom composition:

- `SelectProvider.tsx` - Context provider
- `SelectTrigger.tsx` - Trigger wrapper
- `SelectValue.tsx` - Value display
- `SelectInput.tsx` - Search input
- `SelectClear.tsx` - Clear button
- `SelectMenu.tsx` - Menu wrapper
- `SelectOption.tsx` - Option item
- `SelectGroup.tsx` - Group container
- `SelectGroupLabel.tsx` - Group label
- `SelectTag.tsx` - Multi-select tag
- `SelectTagRemove.tsx` - Tag remove button
- `SelectEmpty.tsx` - Empty state
- `SelectLoading.tsx` - Loading state
- `SelectCreate.tsx` - Create prompt

---

## Build Configuration

### tsup.config.ts

```typescript
import { defineConfig } from 'tsup'

export default defineConfig([
  // Core bundle
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    minify: true,
    treeshake: true,
    splitting: false,
  },
  // React bundle
  {
    entry: ['src/adapters/react/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'dist/react',
    external: ['react', 'react-dom'],
    minify: true,
    treeshake: true,
  },
])
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'tests', 'dist'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
})
```

---

## Testing Strategy

### Unit Tests

Test each module in isolation:

```typescript
// tests/unit/core/state.test.ts
describe('StateManager', () => {
  it('should initialize with default state', () => {})
  it('should update state immutably', () => {})
  it('should notify subscribers', () => {})
  it('should return unsubscribe function', () => {})
})
```

### Integration Tests

Test complete workflows:

```typescript
// tests/integration/select.test.ts
describe('Select', () => {
  it('should select option on click', () => {})
  it('should navigate with keyboard', () => {})
  it('should filter options on search', () => {})
  it('should handle async loading', () => {})
})
```

### Accessibility Tests

Verify ARIA compliance:

```typescript
// tests/integration/a11y.test.ts
describe('Accessibility', () => {
  it('should have correct ARIA roles', () => {})
  it('should update aria-expanded on toggle', () => {})
  it('should manage aria-activedescendant', () => {})
  it('should support screen readers', () => {})
})
```

### React Tests

Test React-specific behavior:

```typescript
// tests/integration/react.test.tsx
describe('useSelect', () => {
  it('should sync state with React', () => {})
  it('should re-render on state change', () => {})
  it('should cleanup on unmount', () => {})
})
```

---

## Performance Optimizations

### 1. Lazy Initialization

```typescript
// Don't create DOM elements until needed
private menuElement: HTMLElement | null = null

private getMenuElement(): HTMLElement {
  if (!this.menuElement) {
    this.menuElement = this.createMenuElement()
  }
  return this.menuElement
}
```

### 2. Event Delegation

```typescript
// Single listener on container
container.addEventListener('click', (e) => {
  const option = (e.target as HTMLElement).closest('[role="option"]')
  if (option) {
    this.handleOptionClick(option)
  }
})
```

### 3. Memoized Callbacks

```typescript
// In React hooks
const handleChange = useCallback((value: T) => {
  onChange?.(value)
}, [onChange])
```

### 4. Batch Updates

```typescript
// Update multiple state properties at once
this.state.setState({
  isOpen: true,
  highlightedIndex: 0,
  searchValue: '',
})
```

---

## Error Handling

### Validation

```typescript
function validateConfig<T>(config: SelectConfig<T>): void {
  if (!Array.isArray(config.options)) {
    throw new Error('SelectKit: options must be an array')
  }
}
```

### Graceful Degradation

```typescript
async function loadOptions(): Promise<void> {
  try {
    const options = await this.config.loadOptions(search, signal)
    this.setOptions(options)
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('SelectKit: Failed to load options', error)
      this.emit('error', error)
    }
  }
}
```

---

*Implementation Guide Version: 1.0.0*
*Last Updated: 2025-12-30*
