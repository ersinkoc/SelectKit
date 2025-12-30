import { useState } from 'react'
import { useSelect } from '@oxog/selectkit/react'
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
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <span className={state.selectedOptions[0] ? 'text-gray-900' : 'text-gray-400'}>
          {state.selectedOptions[0]?.label || 'Select a fruit...'}
        </span>
      </button>
      {state.isOpen && (
        <ul
          {...getMenuProps()}
          className="absolute z-10 w-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          {state.filteredOptions.map((option, index) => (
            <li
              key={option.value}
              {...getOptionProps(option, index)}
              className={`px-4 py-2 cursor-pointer ${
                index === state.highlightedIndex ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
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
          className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <span className={state.selectedOptions[0] ? 'text-gray-900' : 'text-gray-400'}>
            {state.selectedOptions[0]?.label || 'Select a fruit...'}
          </span>
        </button>
        {state.isOpen && (
          <ul
            {...getMenuProps()}
            className="absolute z-10 w-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            {state.filteredOptions.map((option, index) => (
              <li
                key={option.value}
                {...getOptionProps(option, index)}
                className={`px-4 py-2 cursor-pointer ${
                  index === state.highlightedIndex ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
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
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Select Cherry
        </button>
        <button
          onClick={() => setValue(null)}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Clear
        </button>
      </div>
      <p className="text-sm text-gray-600">Current value: {value || 'null'}</p>
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
        <h1 className="text-3xl font-bold text-gray-900">Select</h1>
        <p className="mt-4 text-lg text-gray-600">
          A single-value select component with full keyboard navigation and accessibility support.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Usage</h2>
        <Demo title="Basic Select" description="Click to open the dropdown and select an option.">
          <BasicSelect />
        </Demo>
        <div className="mt-4">
          <CodeBlock code={basicCode} language="tsx" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Controlled Mode</h2>
        <p className="text-gray-600 mb-4">
          Control the value externally by passing <code className="inline-code">value</code> and{' '}
          <code className="inline-code">onChange</code> props.
        </p>
        <Demo title="Controlled Select" description="Value is controlled externally.">
          <ControlledSelect />
        </Demo>
        <div className="mt-4">
          <CodeBlock code={controlledCode} language="tsx" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Disabled Options</h2>
        <p className="text-gray-600 mb-4">
          Options can be individually disabled by setting <code className="inline-code">disabled: true</code>.
        </p>
        <CodeBlock code={disabledCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Grouped Options</h2>
        <p className="text-gray-600 mb-4">
          Group options by adding a <code className="inline-code">group</code> property to each option.
        </p>
        <CodeBlock code={groupedCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Keyboard Navigation</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Key</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> /{' '}
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Space</kbd>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">Open menu / Select highlighted option</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">↓</kbd> /{' '}
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">↑</kbd>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">Navigate through options</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Home</kbd> /{' '}
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">End</kbd>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">Jump to first / last option</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Escape</kbd>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">Close menu</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Tab</kbd>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">Close menu and move focus</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
