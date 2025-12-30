import { useState } from 'react'
import { useSelect } from '@oxog/selectkit/react'
import { ChevronDown } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'
import Demo from '../components/Demo'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
]

function BasicSelect() {
  const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps } = useSelect({
    options: fruits,
    placeholder: 'Select a fruit...',
  })

  return (
    <div {...getContainerProps()} className="relative w-64">
      <button
        {...getTriggerProps()}
        className="w-full px-4 py-2.5 text-left bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
      >
        <span className={state.selectedOptions[0] ? 'text-gray-100' : 'text-gray-500'}>
          {state.selectedOptions[0]?.label || 'Select a fruit...'}
        </span>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-transform ${state.isOpen ? 'rotate-180' : ''}`} />
      </button>
      {state.isOpen && (
        <ul
          {...getMenuProps()}
          className="absolute z-50 w-full mt-1 py-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto"
        >
          {state.filteredOptions.map((option, index) => (
            <li
              key={option.value}
              {...getOptionProps(option, index)}
              className={`px-4 py-2.5 cursor-pointer transition-colors ${
                index === state.highlightedIndex ? 'bg-primary-500/20 text-primary-400' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ControlledSelect() {
  const [value, setValue] = useState<string | null>(null)

  const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps } = useSelect({
    options: fruits,
    value,
    onChange: (newValue) => setValue(newValue as string),
    placeholder: 'Select a fruit...',
  })

  return (
    <div className="space-y-4">
      <div {...getContainerProps()} className="relative w-64">
        <button
          {...getTriggerProps()}
          className="w-full px-4 py-2.5 text-left bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        >
          <span className={state.selectedOptions[0] ? 'text-gray-100' : 'text-gray-500'}>
            {state.selectedOptions[0]?.label || 'Select a fruit...'}
          </span>
          <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-transform ${state.isOpen ? 'rotate-180' : ''}`} />
        </button>
        {state.isOpen && (
          <ul
            {...getMenuProps()}
            className="absolute z-50 w-full mt-1 py-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto"
          >
            {state.filteredOptions.map((option, index) => (
              <li
                key={option.value}
                {...getOptionProps(option, index)}
                className={`px-4 py-2.5 cursor-pointer transition-colors ${
                  index === state.highlightedIndex ? 'bg-primary-500/20 text-primary-400' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setValue('cherry')}
          className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Select Cherry
        </button>
        <button
          onClick={() => setValue(null)}
          className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Clear
        </button>
      </div>
      <p className="text-sm text-gray-400">Current value: <code className="text-primary-400">{value || 'null'}</code></p>
    </div>
  )
}

const basicCode = `const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps } = useSelect({
  options: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ],
  placeholder: 'Select a fruit...',
})`

const controlledCode = `const [value, setValue] = useState<string | null>(null)

const { state, ... } = useSelect({
  options,
  value,
  onChange: (newValue) => setValue(newValue),
})`

const disabledCode = `const { state, ... } = useSelect({
  options: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana', disabled: true },
    { value: 'cherry', label: 'Cherry' },
  ],
})`

const groupedCode = `const { state, ... } = useSelect({
  options: [
    { value: 'apple', label: 'Apple', group: 'Fruits' },
    { value: 'banana', label: 'Banana', group: 'Fruits' },
    { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
    { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
  ],
})`

export default function SelectPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Select</h1>
        <p className="mt-4 text-lg text-gray-400">
          A single-value select component with full keyboard navigation and accessibility support.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Basic Usage</h2>
        <Demo title="Basic Select" description="Click to open the dropdown and select an option.">
          <BasicSelect />
        </Demo>
        <div className="mt-4">
          <CodeBlock code={basicCode} language="tsx" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Controlled Mode</h2>
        <p className="text-gray-400 mb-4">
          Control the value externally by passing <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">value</code> and{' '}
          <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">onChange</code> props.
        </p>
        <Demo title="Controlled Select" description="Value is controlled externally.">
          <ControlledSelect />
        </Demo>
        <div className="mt-4">
          <CodeBlock code={controlledCode} language="tsx" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Disabled Options</h2>
        <p className="text-gray-400 mb-4">
          Options can be individually disabled by setting <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">disabled: true</code>.
        </p>
        <CodeBlock code={disabledCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Grouped Options</h2>
        <p className="text-gray-400 mb-4">
          Group options by adding a <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">group</code> property to each option.
        </p>
        <CodeBlock code={groupedCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Keyboard Navigation</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Key</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-900/50">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-100">
                  <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">Enter</kbd> /{' '}
                  <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">Space</kbd>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">Open menu / Select highlighted option</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-100">
                  <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">↓</kbd> /{' '}
                  <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">↑</kbd>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">Navigate through options</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-100">
                  <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">Home</kbd> /{' '}
                  <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">End</kbd>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">Jump to first / last option</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-100">
                  <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">Escape</kbd>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">Close menu</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-100">
                  <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">Tab</kbd>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">Close menu and move focus</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
