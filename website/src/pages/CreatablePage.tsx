import { useState } from 'react'
import { useSelect, type SelectOption } from '@oxog/selectkit/react'
import { ChevronDown, Plus, Search } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'
import Demo from '../components/Demo'

function CreatableSelect() {
  const [options, setOptions] = useState<SelectOption<string>[]>([
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ])

  const handleCreate = (inputValue: string): SelectOption<string> => {
    const newOption = {
      value: inputValue.toLowerCase().replace(/\s+/g, '-'),
      label: inputValue,
    }
    setOptions((prev) => [...prev, newOption])
    return newOption
  }

  const { state, getContainerProps, getTriggerProps, getInputProps, getMenuProps, getOptionProps } =
    useSelect<string>({
      options,
      searchable: true,
      creatable: true,
      placeholder: 'Search or create...',
      onCreate: handleCreate,
    })

  const showCreateOption =
    state.searchValue &&
    !options.some((o) => o.label.toLowerCase() === state.searchValue.toLowerCase())

  return (
    <div {...getContainerProps()} className="relative w-64">
      <button
        {...getTriggerProps()}
        className="w-full px-4 py-2.5 text-left bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
      >
        <span className={state.selectedOptions[0] ? 'text-gray-100' : 'text-gray-500'}>
          {state.selectedOptions[0]?.label || 'Search or create...'}
        </span>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-transform ${state.isOpen ? 'rotate-180' : ''}`} />
      </button>
      {state.isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
          <div className="p-2 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                {...getInputProps()}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Type to search or create..."
              />
            </div>
          </div>
          <ul {...getMenuProps()} className="max-h-60 overflow-auto py-1">
            {state.filteredOptions.map((option: SelectOption<string>, index: number) => (
              <li
                key={option.value}
                {...getOptionProps(option, index)}
                className={`px-4 py-2.5 cursor-pointer transition-colors ${
                  index === state.highlightedIndex
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {option.label}
              </li>
            ))}
            {showCreateOption && (
              <li
                className="px-4 py-2.5 cursor-pointer flex items-center gap-2 text-gray-300 hover:bg-gray-700 transition-colors"
                onClick={() => handleCreate(state.searchValue)}
              >
                <Plus className="w-4 h-4 text-primary-400" />
                Create "<span className="text-primary-400">{state.searchValue}</span>"
              </li>
            )}
            {state.filteredOptions.length === 0 && !showCreateOption && (
              <li className="px-4 py-3 text-center text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

const basicCreatableCode = `const [options, setOptions] = useState<SelectOption<string>[]>([
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
])

const handleCreate = (inputValue: string): SelectOption<string> => {
  const newOption = {
    value: inputValue.toLowerCase().replace(/\\s+/g, '-'),
    label: inputValue,
  }
  setOptions((prev) => [...prev, newOption])
  return newOption
}

const { state, ... } = useSelect({
  options,
  searchable: true,
  creatable: true,
  onCreate: handleCreate,
})`

const customValidationCode = `const handleCreate = (inputValue: string): SelectOption<string> | null => {
  // Validate the input
  if (inputValue.length < 2) {
    alert('Value must be at least 2 characters')
    return null
  }

  return {
    value: inputValue.toLowerCase().replace(/\\s+/g, '-'),
    label: inputValue,
  }
}

const { state, ... } = useSelect({
  options,
  creatable: true,
  onCreate: handleCreate,
})`

const formatCreateLabelCode = `// Custom "Create" option label in your render
{showCreateOption && (
  <li className="create-option" onClick={() => handleCreate(searchValue)}>
    <span className="icon">+</span>
    Add <strong>"{searchValue}"</strong> as a new tag
  </li>
)}`

const multiCreatableCode = `import { useMultiSelect } from '@oxog/selectkit/react'

const { state, ... } = useMultiSelect({
  options,
  creatable: true,
  onCreate: (inputValue) => {
    const newOption = {
      value: inputValue.toLowerCase(),
      label: inputValue,
    }
    setOptions(prev => [...prev, newOption])
    return newOption
  },
})`

export default function CreatablePage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Creatable</h1>
        <p className="mt-4 text-lg text-gray-400">
          Allow users to create new options on the fly when their search doesn't match existing options.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Basic Creatable</h2>
        <Demo
          title="Creatable Select"
          description="Type something that doesn't exist to see the create option."
        >
          <CreatableSelect />
        </Demo>
        <div className="mt-4">
          <CodeBlock code={basicCreatableCode} language="tsx" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Validation</h2>
        <p className="text-gray-400 mb-4">
          Validate input in the <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">onCreate</code> handler and return null to
          prevent creation.
        </p>
        <CodeBlock code={customValidationCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Custom Create Label</h2>
        <p className="text-gray-400 mb-4">
          Customize how the "Create" option appears in the dropdown.
        </p>
        <CodeBlock code={formatCreateLabelCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Multi-Select with Create</h2>
        <p className="text-gray-400 mb-4">
          Combine creatable with multi-select for tag-like behavior.
        </p>
        <CodeBlock code={multiCreatableCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">onCreate Callback</h2>
        <p className="text-gray-400 mb-4">
          The <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">onCreate</code> function receives the input value and should return
          the created option:
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Parameter</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-900/50">
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">inputValue</td>
                <td className="px-4 py-3 text-sm text-gray-400">string</td>
                <td className="px-4 py-3 text-sm text-gray-400">The text entered by the user</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">returns</td>
                <td className="px-4 py-3 text-sm text-gray-400">SelectOption | null</td>
                <td className="px-4 py-3 text-sm text-gray-400">The created option to add and select</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
