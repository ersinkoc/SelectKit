import { useCombobox, type SelectOption } from '@oxog/selectkit/react'
import { Search } from 'lucide-react'
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          {...getInputProps()}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        />
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <ul
          {...getMenuProps()}
          className="absolute z-50 w-full mt-1 py-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto"
        >
          {filteredOptions.map((option: SelectOption<string>, index: number) => (
            <li
              key={option.value}
              {...getOptionProps(option, index)}
              className={`px-4 py-2.5 cursor-pointer transition-colors ${
                index === highlightedIndex
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {isOpen && filteredOptions.length === 0 && inputValue && (
        <div className="absolute z-50 w-full mt-1 py-3 px-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl text-gray-500 text-center">
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          {...getInputProps()}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        />
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <ul
          {...getMenuProps()}
          className="absolute z-50 w-full mt-1 py-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto"
        >
          {filteredOptions.map((option: SelectOption<string>, index: number) => (
            <li
              key={option.value}
              {...getOptionProps(option, index)}
              className={`px-4 py-2.5 cursor-pointer transition-colors ${
                index === highlightedIndex
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {isOpen && filteredOptions.length === 0 && inputValue && (
        <div className="absolute z-50 w-full mt-1 py-3 px-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl text-gray-500 text-center">
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
      <strong className="font-semibold text-primary-400">
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
        <h1 className="text-3xl font-bold text-gray-100">Combobox</h1>
        <p className="mt-4 text-lg text-gray-400">
          A searchable select component with text input for filtering options.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Basic Usage</h2>
        <Demo title="Basic Combobox" description="Type to filter options.">
          <BasicCombobox />
        </Demo>
        <div className="mt-4">
          <CodeBlock code={basicCode} language="tsx" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Autocomplete Mode</h2>
        <p className="text-gray-400 mb-4">
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
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Custom Filter</h2>
        <p className="text-gray-400 mb-4">
          Implement custom filtering logic with the <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">filterOptions</code> prop.
        </p>
        <CodeBlock code={customFilterCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Highlighting Matches</h2>
        <p className="text-gray-400 mb-4">
          You can highlight the matching portion of options using a custom render function.
        </p>
        <CodeBlock code={highlightMatchCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Input Props</h2>
        <p className="text-gray-400 mb-4">
          The <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">getInputProps</code> function returns all necessary props for the
          input element:
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Prop</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-900/50">
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">role</td>
                <td className="px-4 py-3 text-sm text-gray-400">"combobox" for accessibility</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">aria-expanded</td>
                <td className="px-4 py-3 text-sm text-gray-400">Whether the menu is open</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">aria-autocomplete</td>
                <td className="px-4 py-3 text-sm text-gray-400">"list" indicating autocomplete behavior</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">aria-activedescendant</td>
                <td className="px-4 py-3 text-sm text-gray-400">ID of the highlighted option</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">value</td>
                <td className="px-4 py-3 text-sm text-gray-400">Current search/input value</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">onChange</td>
                <td className="px-4 py-3 text-sm text-gray-400">Handler for input changes</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">onKeyDown</td>
                <td className="px-4 py-3 text-sm text-gray-400">Handler for keyboard navigation</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">onFocus</td>
                <td className="px-4 py-3 text-sm text-gray-400">Handler for focus events</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">onBlur</td>
                <td className="px-4 py-3 text-sm text-gray-400">Handler for blur events</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
