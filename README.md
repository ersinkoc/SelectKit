# SelectKit

A zero-dependency, fully accessible, headless select/combobox library for React.

[![npm version](https://img.shields.io/npm/v/@oxog/selectkit.svg)](https://www.npmjs.com/package/@oxog/selectkit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@oxog/selectkit)](https://bundlephobia.com/package/@oxog/selectkit)
[![license](https://img.shields.io/npm/l/@oxog/selectkit.svg)](https://github.com/oxog/selectkit/blob/main/LICENSE)

## Features

- **Zero Dependencies** - Pure TypeScript, no runtime dependencies
- **Fully Accessible** - WAI-ARIA compliant with keyboard navigation and screen reader support
- **Headless Architecture** - Complete control over styling and rendering
- **TypeScript First** - Full type safety with excellent IDE support
- **Tiny Bundle** - ~4KB core, ~6KB with React (gzipped)
- **Single & Multi Select** - Both modes with all features
- **Searchable** - Built-in filtering with custom filter support
- **Async Loading** - Load options from APIs with debouncing
- **Creatable** - Allow users to create new options
- **Virtual Scrolling** - Efficiently render thousands of options
- **Grouped Options** - Organize options into groups

## Installation

```bash
npm install @oxog/selectkit
```

## Quick Start

```tsx
import { useSelect } from '@oxog/selectkit/react'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

function MySelect() {
  const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps } = useSelect({
    options,
    placeholder: 'Select a fruit...',
  })

  return (
    <div {...getContainerProps()}>
      <button {...getTriggerProps()}>
        {state.selectedOptions[0]?.label || 'Select...'}
      </button>
      {state.isOpen && (
        <ul {...getMenuProps()}>
          {state.filteredOptions.map((option, index) => (
            <li key={option.value} {...getOptionProps(option, index)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

## Hooks

### useSelect

Single-value select with full keyboard navigation.

```tsx
const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps } = useSelect({
  options,
  value,
  onChange,
  placeholder: 'Select...',
  searchable: true,
  clearable: true,
  disabled: false,
})
```

### useMultiSelect

Multi-value select with tag management.

```tsx
const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps, getTagProps, getTagRemoveProps } = useMultiSelect({
  options,
  value,
  onChange,
  maxSelected: 5,
  placeholder: 'Select options...',
})
```

### useCombobox

Combobox with text input for filtering.

```tsx
const { isOpen, filteredOptions, highlightedIndex, getInputProps, getMenuProps, getOptionProps } = useCombobox({
  options,
  placeholder: 'Search...',
  onSelect: (option) => console.log(option),
})
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `options` | `SelectOption[]` | `[]` | Array of options |
| `value` | `T \| T[] \| null` | `null` | Controlled value |
| `onChange` | `(value, option, action) => void` | - | Change handler |
| `multiple` | `boolean` | `false` | Enable multi-select |
| `searchable` | `boolean` | `false` | Enable search/filter |
| `clearable` | `boolean` | `false` | Show clear button |
| `creatable` | `boolean` | `false` | Allow creating options |
| `disabled` | `boolean` | `false` | Disable the select |
| `closeOnSelect` | `boolean` | `true` | Close on selection |
| `openOnFocus` | `boolean` | `true` | Open on focus |
| `placeholder` | `string` | `'Select...'` | Placeholder text |
| `filterOptions` | `(options, search) => options` | - | Custom filter |
| `loadOptions` | `(search) => Promise<options>` | - | Async loading |
| `onCreate` | `(input) => option` | - | Create option handler |
| `maxSelected` | `number` | - | Max selections (multi) |
| `minSelected` | `number` | - | Min selections (multi) |

## Async Loading

```tsx
const { isOpen, isLoading, filteredOptions, getInputProps, getMenuProps, getOptionProps } = useCombobox({
  options: [],
  loadOptions: async (search) => {
    const response = await fetch(`/api/search?q=${search}`)
    return response.json()
  },
  searchDebounce: 300,
  minSearchLength: 2,
})
```

## Creatable

```tsx
const [options, setOptions] = useState(initialOptions)

const { state, ... } = useSelect({
  options,
  creatable: true,
  onCreate: (inputValue) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue }
    setOptions(prev => [...prev, newOption])
    return newOption
  },
})
```

## Styling

SelectKit is completely unstyled - you have full control over the appearance. Use any CSS framework or custom styles.

### With Tailwind CSS

```tsx
<button
  {...getTriggerProps()}
  className="w-full px-4 py-2 text-left bg-white border rounded-lg shadow-sm
             hover:border-gray-400 focus:ring-2 focus:ring-blue-500"
>
  {state.selectedOptions[0]?.label || 'Select...'}
</button>
```

### Styling States

Access these state properties to style different states:

| State | Property | Use For |
|-------|----------|---------|
| Open/Closed | `state.isOpen` | Show/hide menu, rotate chevron |
| Highlighted | `state.highlightedIndex` | Highlight current option |
| Selected | `state.selectedOptions` | Show checkmark, bold text |
| Disabled | `option.disabled` | Gray out, prevent interaction |
| Loading | `isLoading` | Show spinner |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open menu / Select option |
| `↓` / `↑` | Navigate through options |
| `Home` / `End` | Jump to first / last option |
| `Escape` | Close menu |
| `Tab` | Close menu and move focus |
| `Backspace` | Remove last tag (multi-select) |

## Accessibility

SelectKit follows WAI-ARIA guidelines:

- Proper ARIA roles (`listbox`, `option`, `combobox`)
- `aria-expanded`, `aria-selected`, `aria-activedescendant`
- Keyboard navigation
- Focus management
- Screen reader announcements

## Browser Support

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- No IE11 support

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.
