import { useMultiSelect } from '@oxog/selectkit/react'
import { X } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'
import Demo from '../components/Demo'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
]

function BasicMultiSelect() {
  const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps, getTagProps, getTagRemoveProps } =
    useMultiSelect({
      options: fruits,
      placeholder: 'Select fruits...',
    })

  return (
    <div {...getContainerProps()} className="relative w-80">
      <div
        {...getTriggerProps()}
        className="min-h-[42px] px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:border-gray-600 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 cursor-pointer transition-colors"
      >
        <div className="flex flex-wrap gap-1.5">
          {state.selectedOptions.map((option, index) => (
            <span
              key={option.value}
              {...getTagProps(option, index)}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded text-sm"
            >
              {option.label}
              <button
                {...getTagRemoveProps(option)}
                className="hover:text-primary-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {state.selectedOptions.length === 0 && (
            <span className="text-gray-500">Select fruits...</span>
          )}
        </div>
      </div>
      {state.isOpen && (
        <ul
          {...getMenuProps()}
          className="absolute z-50 w-full mt-1 py-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto"
        >
          {state.filteredOptions.map((option, index) => {
            const isSelected = state.selectedOptions.some((s) => s.value === option.value)
            return (
              <li
                key={option.value}
                {...getOptionProps(option, index)}
                className={`px-4 py-2.5 cursor-pointer flex items-center gap-2 transition-colors ${
                  index === state.highlightedIndex
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span
                  className={`w-4 h-4 border rounded flex items-center justify-center text-xs ${
                    isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-600'
                  }`}
                >
                  {isSelected && '✓'}
                </span>
                {option.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function LimitedMultiSelect() {
  const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps, getTagProps, getTagRemoveProps } =
    useMultiSelect({
      options: fruits,
      placeholder: 'Select up to 3 fruits...',
      maxSelected: 3,
    })

  return (
    <div {...getContainerProps()} className="relative w-80">
      <div
        {...getTriggerProps()}
        className="min-h-[42px] px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:border-gray-600 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 cursor-pointer transition-colors"
      >
        <div className="flex flex-wrap gap-1.5">
          {state.selectedOptions.map((option, index) => (
            <span
              key={option.value}
              {...getTagProps(option, index)}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded text-sm"
            >
              {option.label}
              <button
                {...getTagRemoveProps(option)}
                className="hover:text-primary-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {state.selectedOptions.length === 0 && (
            <span className="text-gray-500">Select up to 3 fruits...</span>
          )}
        </div>
      </div>
      {state.isOpen && (
        <ul
          {...getMenuProps()}
          className="absolute z-50 w-full mt-1 py-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto"
        >
          {state.filteredOptions.map((option, index) => {
            const isSelected = state.selectedOptions.some((s) => s.value === option.value)
            const isDisabled = !isSelected && state.selectedOptions.length >= 3
            return (
              <li
                key={option.value}
                {...getOptionProps(option, index)}
                className={`px-4 py-2.5 flex items-center gap-2 transition-colors ${
                  isDisabled
                    ? 'text-gray-600 cursor-not-allowed'
                    : index === state.highlightedIndex
                    ? 'bg-primary-500/20 text-primary-400 cursor-pointer'
                    : 'text-gray-300 hover:bg-gray-700 cursor-pointer'
                }`}
              >
                <span
                  className={`w-4 h-4 border rounded flex items-center justify-center text-xs ${
                    isSelected
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : isDisabled
                      ? 'border-gray-700'
                      : 'border-gray-600'
                  }`}
                >
                  {isSelected && '✓'}
                </span>
                {option.label}
              </li>
            )
          })}
        </ul>
      )}
      <p className="mt-2 text-sm text-gray-500">
        {state.selectedOptions.length}/3 selected
      </p>
    </div>
  )
}

const basicCode = `const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps, getTagProps, getTagRemoveProps } =
  useMultiSelect({
    options,
    placeholder: 'Select fruits...',
  })

return (
  <div {...getContainerProps()}>
    <div {...getTriggerProps()}>
      {state.selectedOptions.map((option, index) => (
        <span key={option.value} {...getTagProps(option, index)}>
          {option.label}
          <button {...getTagRemoveProps(option)}>×</button>
        </span>
      ))}
    </div>
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
)`

const limitedCode = `const { state, ... } = useMultiSelect({
  options,
  maxSelected: 3,  // Limit to 3 selections
})`

const searchableCode = `const { state, getInputProps, ... } = useMultiSelect({
  options,
  searchable: true,
})

// In your render:
<input {...getInputProps()} placeholder="Search..." />`

const clearableCode = `const { state, getClearProps, ... } = useMultiSelect({
  options,
  clearable: true,
})

// In your render:
{state.selectedOptions.length > 0 && (
  <button {...getClearProps()}>Clear all</button>
)}`

export default function MultiSelectPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">MultiSelect</h1>
        <p className="mt-4 text-lg text-gray-400">
          A multi-value select component for selecting multiple options from a list.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Basic Usage</h2>
        <Demo title="Basic MultiSelect" description="Click to select multiple options.">
          <BasicMultiSelect />
        </Demo>
        <div className="mt-4">
          <CodeBlock code={basicCode} language="tsx" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Maximum Selections</h2>
        <p className="text-gray-400 mb-4">
          Limit the number of selections with the <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">maxSelected</code> prop.
        </p>
        <Demo title="Limited MultiSelect" description="Maximum 3 selections allowed.">
          <LimitedMultiSelect />
        </Demo>
        <div className="mt-4">
          <CodeBlock code={limitedCode} language="tsx" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Searchable</h2>
        <p className="text-gray-400 mb-4">
          Enable search functionality with the <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">searchable</code> prop.
        </p>
        <CodeBlock code={searchableCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Clearable</h2>
        <p className="text-gray-400 mb-4">
          Add a clear all button with the <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">clearable</code> prop.
        </p>
        <CodeBlock code={clearableCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Tag Props</h2>
        <p className="text-gray-400 mb-4">
          The <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">getTagProps</code> function returns props for each selected tag:
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Prop</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-900/50">
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">onRemove</td>
                <td className="px-4 py-3 text-sm text-gray-400">() =&gt; void</td>
                <td className="px-4 py-3 text-sm text-gray-400">Remove this tag</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">onKeyDown</td>
                <td className="px-4 py-3 text-sm text-gray-400">KeyboardEventHandler</td>
                <td className="px-4 py-3 text-sm text-gray-400">Handle keyboard navigation between tags</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">tabIndex</td>
                <td className="px-4 py-3 text-sm text-gray-400">number</td>
                <td className="px-4 py-3 text-sm text-gray-400">Focus management for tags</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
