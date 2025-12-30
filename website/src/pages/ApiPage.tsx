import CodeBlock from '../components/CodeBlock'

const optionTypeCode = `interface Option {
  value: string | number
  label: string
  disabled?: boolean
  group?: string
  [key: string]: unknown  // Allow custom properties
}`

const useSelectCode = `interface UseSelectConfig {
  // Required
  options: Option[]

  // Value
  value?: Value
  defaultValue?: Value
  onChange?: (value: Value, option: Option | null) => void

  // Behavior
  disabled?: boolean
  clearable?: boolean
  searchable?: boolean
  placeholder?: string
  closeOnSelect?: boolean

  // Search
  filterOptions?: (options: Option[], search: string) => Option[]
  minSearchLength?: number
  searchDebounce?: number

  // Async
  loadOptions?: (search: string, signal: AbortSignal) => Promise<Option[]>
  loadingMessage?: string

  // Create
  creatable?: boolean
  onCreate?: (inputValue: string) => Promise<Option>

  // Callbacks
  onOpen?: () => void
  onClose?: () => void
  onFocus?: () => void
  onBlur?: () => void
  onError?: (error: Error) => void
}

interface UseSelectReturn {
  state: SelectState
  select: Select

  // Props getters
  getContainerProps: () => ContainerProps
  getTriggerProps: () => TriggerProps
  getMenuProps: () => MenuProps
  getOptionProps: (option: Option, index: number) => OptionProps
  getClearProps: () => ClearProps

  // Helpers
  isLoading: boolean
  isCreating: boolean
}`

const useMultiSelectCode = `interface UseMultiSelectConfig extends UseSelectConfig {
  value?: Value[]
  defaultValue?: Value[]
  onChange?: (value: Value[], options: Option[]) => void
  maxSelected?: number
  hideSelectedOptions?: boolean
}

interface UseMultiSelectReturn extends UseSelectReturn {
  getTagProps: (option: Option, index: number) => TagProps
}`

const useComboboxCode = `interface UseComboboxConfig extends UseSelectConfig {
  openOnFocus?: boolean
  selectOnBlur?: boolean
}

interface UseComboboxReturn extends UseSelectReturn {
  getInputProps: () => InputProps
}`

const coreApiCode = `import { createSelect } from '@oxog/selectkit'

const select = createSelect({
  options: [...],
  // ... config
})

// State
select.getState()        // Get current state
select.getValue()        // Get selected value
select.getSelectedOption() // Get selected option

// Actions
select.open()            // Open dropdown
select.close()           // Close dropdown
select.toggle()          // Toggle dropdown
select.selectOption(option)  // Select an option
select.clearValue()      // Clear selection
select.setSearchValue(value) // Set search input
select.setHighlightedIndex(index) // Set highlighted option

// Subscriptions
const unsubscribe = select.subscribe((state) => {
  console.log('State changed:', state)
})

// Events
select.on('change', (value, option) => {})
select.on('open', () => {})
select.on('close', () => {})
select.on('loading', (isLoading) => {})
select.on('error', (error) => {})`

const stateTypeCode = `interface SelectState {
  // Core
  isOpen: boolean
  value: Value | Value[] | null
  selectedOption: Option | null
  selectedOptions: Option[]  // For multi-select

  // Options
  options: Option[]
  filteredOptions: Option[]

  // Navigation
  highlightedIndex: number

  // Search
  searchValue: string
  isSearching: boolean

  // Async
  isLoading: boolean

  // Create
  isCreating: boolean

  // Input
  isComposing: boolean  // For IME support

  // Config
  placeholder: string
  disabled: boolean
}`

export default function ApiPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">API Reference</h1>
        <p className="mt-4 text-lg text-gray-600">
          Complete API documentation for SelectKit hooks and core functions.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Option Type</h2>
        <p className="text-gray-600 mb-4">
          Options are objects with at least <code className="inline-code">value</code> and{' '}
          <code className="inline-code">label</code> properties:
        </p>
        <CodeBlock code={optionTypeCode} language="typescript" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">useSelect</h2>
        <p className="text-gray-600 mb-4">The main hook for single-value select components.</p>
        <CodeBlock code={useSelectCode} language="typescript" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">useMultiSelect</h2>
        <p className="text-gray-600 mb-4">
          Hook for multi-value select. Extends <code className="inline-code">useSelect</code> with
          multi-select specific features.
        </p>
        <CodeBlock code={useMultiSelectCode} language="typescript" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">useCombobox</h2>
        <p className="text-gray-600 mb-4">
          Hook for searchable select with text input. Extends <code className="inline-code">useSelect</code>.
        </p>
        <CodeBlock code={useComboboxCode} language="typescript" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Core API</h2>
        <p className="text-gray-600 mb-4">Use the core API for framework-agnostic usage:</p>
        <CodeBlock code={coreApiCode} language="typescript" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">State</h2>
        <p className="text-gray-600 mb-4">The state object contains all current values:</p>
        <CodeBlock code={stateTypeCode} language="typescript" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Props Getters</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">getContainerProps()</h3>
            <p className="text-gray-600 mb-2">
              Returns props for the container element. Handles click-outside detection.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Prop</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2 font-mono">ref</td>
                    <td className="px-3 py-2">RefCallback</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">getTriggerProps()</h3>
            <p className="text-gray-600 mb-2">Returns props for the trigger button element.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Prop</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2 font-mono">role</td>
                    <td className="px-3 py-2">"combobox"</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">aria-expanded</td>
                    <td className="px-3 py-2">boolean</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">aria-haspopup</td>
                    <td className="px-3 py-2">"listbox"</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">aria-controls</td>
                    <td className="px-3 py-2">string</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">onClick</td>
                    <td className="px-3 py-2">() =&gt; void</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">onKeyDown</td>
                    <td className="px-3 py-2">KeyboardEventHandler</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">getMenuProps()</h3>
            <p className="text-gray-600 mb-2">Returns props for the menu/listbox element.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Prop</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2 font-mono">role</td>
                    <td className="px-3 py-2">"listbox"</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">id</td>
                    <td className="px-3 py-2">string</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">aria-labelledby</td>
                    <td className="px-3 py-2">string</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">tabIndex</td>
                    <td className="px-3 py-2">-1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              getOptionProps(option, index)
            </h3>
            <p className="text-gray-600 mb-2">Returns props for each option element.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Prop</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2 font-mono">role</td>
                    <td className="px-3 py-2">"option"</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">id</td>
                    <td className="px-3 py-2">string</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">aria-selected</td>
                    <td className="px-3 py-2">boolean</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">aria-disabled</td>
                    <td className="px-3 py-2">boolean</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">onClick</td>
                    <td className="px-3 py-2">() =&gt; void</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">onMouseEnter</td>
                    <td className="px-3 py-2">() =&gt; void</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Utility Functions</h2>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900">createCachedLoader</h3>
            <p className="text-sm text-gray-600 mt-1">
              Wraps a loader function with caching support.
            </p>
            <code className="text-xs mt-2 block">
              createCachedLoader(loader, {'{'} ttlMs, maxCacheSize {'}'})
            </code>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900">withRetry</h3>
            <p className="text-sm text-gray-600 mt-1">
              Wraps a loader function with retry and backoff support.
            </p>
            <code className="text-xs mt-2 block">
              withRetry(loader, {'{'} maxRetries, delayMs, backoff {'}'})
            </code>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900">combineLoaders</h3>
            <p className="text-sm text-gray-600 mt-1">
              Combines multiple loaders into one, merging their results.
            </p>
            <code className="text-xs mt-2 block">combineLoaders([loader1, loader2])</code>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900">createFetchLoader</h3>
            <p className="text-sm text-gray-600 mt-1">
              Creates a loader that fetches from a URL.
            </p>
            <code className="text-xs mt-2 block">
              createFetchLoader(url, {'{'} transformResponse {'}'})
            </code>
          </div>
        </div>
      </section>
    </div>
  )
}
