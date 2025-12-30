import CodeBlock from '../components/CodeBlock'

const installCode = `npm install @oxog/selectkit
# or
yarn add @oxog/selectkit
# or
pnpm add @oxog/selectkit`

const basicUsageCode = `import { useSelect } from '@oxog/selectkit/react'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

function MySelect() {
  const {
    state,
    getContainerProps,
    getTriggerProps,
    getMenuProps,
    getOptionProps,
  } = useSelect({
    options,
    placeholder: 'Select a fruit...',
    onChange: (value, option) => {
      console.log('Selected:', value, option)
    },
  })

  return (
    <div {...getContainerProps()} className="relative">
      <button {...getTriggerProps()} className="select-trigger">
        {state.selectedOption?.label || state.placeholder}
      </button>

      {state.isOpen && (
        <ul {...getMenuProps()} className="select-menu">
          {state.filteredOptions.map((option, index) => (
            <li
              key={option.value}
              {...getOptionProps(option, index)}
              className={\`select-option \${
                index === state.highlightedIndex ? 'highlighted' : ''
              }\`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}`

const multiSelectCode = `import { useMultiSelect } from '@oxog/selectkit/react'

function MyMultiSelect() {
  const {
    state,
    getContainerProps,
    getTriggerProps,
    getMenuProps,
    getOptionProps,
    getTagProps,
  } = useMultiSelect({
    options,
    placeholder: 'Select fruits...',
    maxSelected: 3,
  })

  return (
    <div {...getContainerProps()}>
      <div {...getTriggerProps()} className="multi-select-trigger">
        {state.selectedOptions.map((option, index) => (
          <span key={option.value} {...getTagProps(option, index)} className="tag">
            {option.label}
            <button className="tag-remove">×</button>
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
  )
}`

const comboboxCode = `import { useCombobox } from '@oxog/selectkit/react'

function MyCombobox() {
  const {
    state,
    getContainerProps,
    getInputProps,
    getMenuProps,
    getOptionProps,
  } = useCombobox({
    options,
    placeholder: 'Search fruits...',
  })

  return (
    <div {...getContainerProps()}>
      <input {...getInputProps()} className="combobox-input" />

      {state.isOpen && state.filteredOptions.length > 0 && (
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
}`

const coreOnlyCode = `import { createSelect } from '@oxog/selectkit'

const select = createSelect({
  options: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
  ],
})

// Subscribe to state changes
select.subscribe((state) => {
  console.log('State changed:', state)
})

// Programmatic control
select.open()
select.selectOption({ value: 'apple', label: 'Apple' })
select.close()

// Get current state
console.log(select.getState())
console.log(select.getValue())`

export default function GettingStartedPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Getting Started</h1>
        <p className="mt-4 text-lg text-gray-600">
          Learn how to install and use SelectKit in your React application.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Installation</h2>
        <CodeBlock code={installCode} language="bash" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Usage</h2>
        <p className="text-gray-600 mb-4">
          The <code className="inline-code">useSelect</code> hook provides everything you need to build a
          fully accessible select component.
        </p>
        <CodeBlock code={basicUsageCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Multi-Select</h2>
        <p className="text-gray-600 mb-4">
          Use <code className="inline-code">useMultiSelect</code> for selecting multiple options.
        </p>
        <CodeBlock code={multiSelectCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Combobox</h2>
        <p className="text-gray-600 mb-4">
          Use <code className="inline-code">useCombobox</code> for a searchable select with text input.
        </p>
        <CodeBlock code={comboboxCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Core Only (No React)</h2>
        <p className="text-gray-600 mb-4">
          You can use SelectKit without React by importing from the core module.
        </p>
        <CodeBlock code={coreOnlyCode} language="typescript" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
        <ul className="space-y-2 text-gray-600">
          <li>
            <a href="/select" className="text-primary-600 hover:underline">
              Learn about Select →
            </a>
          </li>
          <li>
            <a href="/multi-select" className="text-primary-600 hover:underline">
              Learn about MultiSelect →
            </a>
          </li>
          <li>
            <a href="/async" className="text-primary-600 hover:underline">
              Learn about async loading →
            </a>
          </li>
          <li>
            <a href="/styling" className="text-primary-600 hover:underline">
              Learn about styling →
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
