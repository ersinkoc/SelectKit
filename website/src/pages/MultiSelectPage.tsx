import { useMultiSelect } from '@oxog/selectkit/react'
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
        className="min-h-[42px] px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 cursor-pointer"
      >
        <div className="flex flex-wrap gap-1">
          {state.selectedOptions.map((option, index) => (
            <span
              key={option.value}
              {...getTagProps(option, index)}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-sm"
            >
              {option.label}
              <button
                {...getTagRemoveProps(option)}
                className="hover:text-primary-900"
              >
                ×
              </button>
            </span>
          ))}
          {state.selectedOptions.length === 0 && (
            <span className="text-gray-400">Select fruits...</span>
          )}
        </div>
      </div>
      {state.isOpen && (
        <ul
          {...getMenuProps()}
          className="absolute z-10 w-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {state.filteredOptions.map((option, index) => {
            const isSelected = state.selectedOptions.some((s) => s.value === option.value)
            return (
              <li
                key={option.value}
                {...getOptionProps(option, index)}
                className={`px-4 py-2 cursor-pointer flex items-center gap-2 ${
                  index === state.highlightedIndex
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700'
                }`}
              >
                <span
                  className={`w-4 h-4 border rounded flex items-center justify-center ${
                    isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300'
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
        className="min-h-[42px] px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 cursor-pointer"
      >
        <div className="flex flex-wrap gap-1">
          {state.selectedOptions.map((option, index) => (
            <span
              key={option.value}
              {...getTagProps(option, index)}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-sm"
            >
              {option.label}
              <button
                {...getTagRemoveProps(option)}
                className="hover:text-primary-900"
              >
                ×
              </button>
            </span>
          ))}
          {state.selectedOptions.length === 0 && (
            <span className="text-gray-400">Select up to 3 fruits...</span>
          )}
        </div>
      </div>
      {state.isOpen && (
        <ul
          {...getMenuProps()}
          className="absolute z-10 w-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {state.filteredOptions.map((option, index) => {
            const isSelected = state.selectedOptions.some((s) => s.value === option.value)
            const isDisabled =
              !isSelected && state.selectedOptions.length >= 3
            return (
              <li
                key={option.value}
                {...getOptionProps(option, index)}
                className={`px-4 py-2 flex items-center gap-2 ${
                  isDisabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : index === state.highlightedIndex
                    ? 'bg-primary-50 text-primary-700 cursor-pointer'
                    : 'text-gray-700 cursor-pointer'
                }`}
              >
                <span
                  className={`w-4 h-4 border rounded flex items-center justify-center ${
                    isSelected
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : isDisabled
                      ? 'border-gray-200'
                      : 'border-gray-300'
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
        <h1 className="text-3xl font-bold text-gray-900">MultiSelect</h1>
        <p className="mt-4 text-lg text-gray-600">
          A multi-value select component for selecting multiple options from a list.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Usage</h2>
        <Demo title="Basic MultiSelect" description="Click to select multiple options.">
          <BasicMultiSelect />
        </Demo>
        <div className="mt-4">
          <CodeBlock code={basicCode} language="tsx" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Maximum Selections</h2>
        <p className="text-gray-600 mb-4">
          Limit the number of selections with the <code className="inline-code">maxSelected</code> prop.
        </p>
        <Demo title="Limited MultiSelect" description="Maximum 3 selections allowed.">
          <LimitedMultiSelect />
        </Demo>
        <div className="mt-4">
          <CodeBlock code={limitedCode} language="tsx" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Searchable</h2>
        <p className="text-gray-600 mb-4">
          Enable search functionality with the <code className="inline-code">searchable</code> prop.
        </p>
        <CodeBlock code={searchableCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Clearable</h2>
        <p className="text-gray-600 mb-4">
          Add a clear all button with the <code className="inline-code">clearable</code> prop.
        </p>
        <CodeBlock code={clearableCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tag Props</h2>
        <p className="text-gray-600 mb-4">
          The <code className="inline-code">getTagProps</code> function returns props for each selected tag:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Prop</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">onRemove</td>
                <td className="px-4 py-3 text-sm text-gray-600">() =&gt; void</td>
                <td className="px-4 py-3 text-sm text-gray-600">Remove this tag</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">onKeyDown</td>
                <td className="px-4 py-3 text-sm text-gray-600">KeyboardEventHandler</td>
                <td className="px-4 py-3 text-sm text-gray-600">Handle keyboard navigation between tags</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">tabIndex</td>
                <td className="px-4 py-3 text-sm text-gray-600">number</td>
                <td className="px-4 py-3 text-sm text-gray-600">Focus management for tags</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
