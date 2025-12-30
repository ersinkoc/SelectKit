import { useCombobox, type SelectOption } from '@oxog/selectkit/react'
import CodeBlock from '../components/CodeBlock'
import Demo from '../components/Demo'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
]

function BasicCombobox() {
  const {
    isOpen,
    filteredOptions,
    highlightedIndex,
    inputValue,
    getInputProps,
    getMenuProps,
    getOptionProps,
  } = useCombobox<string>({
    options: fruits,
    placeholder: 'Search fruits...',
  })

  return (
    <div className="relative w-64">
      <input
        {...getInputProps()}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul
          {...getMenuProps()}
          className="absolute z-10 w-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.map((option: SelectOption<string>, index: number) => (
            <li
              key={option.value}
              {...getOptionProps(option, index)}
              className={`px-4 py-2 cursor-pointer ${
                index === highlightedIndex
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700'
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {isOpen && filteredOptions.length === 0 && inputValue && (
        <div className="absolute z-10 w-full mt-1 py-3 px-4 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-500 text-center">
          No results found
        </div>
      )}
    </div>
  )
}

function AutocompleteCombobox() {
  const {
    isOpen,
    filteredOptions,
    highlightedIndex,
    inputValue,
    getInputProps,
    getMenuProps,
    getOptionProps,
  } = useCombobox<string>({
    options: fruits,
    placeholder: 'Type to search...',
    openOnFocus: false,
  })

  return (
    <div className="relative w-64">
      <input
        {...getInputProps()}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul
          {...getMenuProps()}
          className="absolute z-10 w-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.map((option: SelectOption<string>, index: number) => (
            <li
              key={option.value}
              {...getOptionProps(option, index)}
              className={`px-4 py-2 cursor-pointer ${
                index === highlightedIndex
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700'
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {isOpen && filteredOptions.length === 0 && inputValue && (
        <div className="absolute z-10 w-full mt-1 py-3 px-4 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-500 text-center">
          No results found
        </div>
      )}
    </div>
  )
}

const basicCode = `const {
  isOpen,
  filteredOptions,
  highlightedIndex,
  getInputProps,
  getMenuProps,
  getOptionProps,
} = useCombobox({
  options,
  placeholder: 'Search fruits...',
})

return (
  <div className="relative">
    <input {...getInputProps()} />
    {isOpen && filteredOptions.length > 0 && (
      <ul {...getMenuProps()}>
        {filteredOptions.map((option, index) => (
          <li key={option.value} {...getOptionProps(option, index)}>
            {option.label}
          </li>
        ))}
      </ul>
    )}
  </div>
)`

const autocompleteCode = `const { ... } = useCombobox({
  options,
  openOnFocus: false,    // Don't open on focus
})`

const customFilterCode = `const { ... } = useCombobox({
  options,
  filterOptions: (options, search) => {
    // Custom filter logic
    return options.filter(option =>
      option.label.toLowerCase().startsWith(search.toLowerCase())
    )
  },
})`

const highlightMatchCode = `function HighlightedOption({ option, searchValue }: { option: SelectOption; searchValue: string }) {
  const label = option.label
  const index = label.toLowerCase().indexOf(searchValue.toLowerCase())

  if (index === -1 || !searchValue) {
    return <span>{label}</span>
  }

  return (
    <span>
      {label.slice(0, index)}
      <strong className="font-semibold text-primary-700">
        {label.slice(index, index + searchValue.length)}
      </strong>
      {label.slice(index + searchValue.length)}
    </span>
  )
}`

export default function ComboboxPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Combobox</h1>
        <p className="mt-4 text-lg text-gray-600">
          A searchable select component with text input for filtering options.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Usage</h2>
        <Demo title="Basic Combobox" description="Type to filter options.">
          <BasicCombobox />
        </Demo>
        <div className="mt-4">
          <CodeBlock code={basicCode} language="tsx" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Autocomplete Mode</h2>
        <p className="text-gray-600 mb-4">
          Configure the combobox to behave more like an autocomplete input.
        </p>
        <Demo title="Autocomplete" description="Options only show after typing.">
          <AutocompleteCombobox />
        </Demo>
        <div className="mt-4">
          <CodeBlock code={autocompleteCode} language="tsx" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Custom Filter</h2>
        <p className="text-gray-600 mb-4">
          Implement custom filtering logic with the <code className="inline-code">filterOptions</code> prop.
        </p>
        <CodeBlock code={customFilterCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlighting Matches</h2>
        <p className="text-gray-600 mb-4">
          You can highlight the matching portion of options using a custom render function.
        </p>
        <CodeBlock code={highlightMatchCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Input Props</h2>
        <p className="text-gray-600 mb-4">
          The <code className="inline-code">getInputProps</code> function returns all necessary props for the
          input element:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Prop</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">role</td>
                <td className="px-4 py-3 text-sm text-gray-600">"combobox" for accessibility</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">aria-expanded</td>
                <td className="px-4 py-3 text-sm text-gray-600">Whether the menu is open</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">aria-autocomplete</td>
                <td className="px-4 py-3 text-sm text-gray-600">"list" indicating autocomplete behavior</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">aria-activedescendant</td>
                <td className="px-4 py-3 text-sm text-gray-600">ID of the highlighted option</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">value</td>
                <td className="px-4 py-3 text-sm text-gray-600">Current search/input value</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">onChange</td>
                <td className="px-4 py-3 text-sm text-gray-600">Handler for input changes</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">onKeyDown</td>
                <td className="px-4 py-3 text-sm text-gray-600">Handler for keyboard navigation</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">onFocus</td>
                <td className="px-4 py-3 text-sm text-gray-600">Handler for focus events</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">onBlur</td>
                <td className="px-4 py-3 text-sm text-gray-600">Handler for blur events</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
