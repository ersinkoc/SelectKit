import { useCombobox, type SelectOption } from '@oxog/selectkit/react'
import CodeBlock from '../components/CodeBlock'
import Demo from '../components/Demo'

// Simulated API call
const searchFruits = async (query: string): Promise<SelectOption<string>[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const allFruits = [
    { value: 'apple', label: 'Apple' },
    { value: 'apricot', label: 'Apricot' },
    { value: 'banana', label: 'Banana' },
    { value: 'blackberry', label: 'Blackberry' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'coconut', label: 'Coconut' },
    { value: 'cranberry', label: 'Cranberry' },
    { value: 'date', label: 'Date' },
    { value: 'elderberry', label: 'Elderberry' },
    { value: 'fig', label: 'Fig' },
    { value: 'grape', label: 'Grape' },
    { value: 'grapefruit', label: 'Grapefruit' },
    { value: 'guava', label: 'Guava' },
  ]

  return allFruits.filter((f) =>
    f.label.toLowerCase().includes(query.toLowerCase())
  )
}

function AsyncCombobox() {
  const {
    isOpen,
    isLoading,
    filteredOptions,
    highlightedIndex,
    inputValue,
    getInputProps,
    getMenuProps,
    getOptionProps,
  } = useCombobox<string>({
    options: [],
    placeholder: 'Search fruits...',
    loadOptions: searchFruits,
    searchDebounce: 300,
    minSearchLength: 1,
  })

  return (
    <div className="relative w-64">
      <div className="relative">
        <input
          {...getInputProps()}
          className="w-full px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-4 w-4 text-primary-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>
      {isOpen && (
        <ul
          {...getMenuProps()}
          className="absolute z-10 w-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {isLoading ? (
            <li className="px-4 py-3 text-center text-gray-500">Loading...</li>
          ) : filteredOptions.length === 0 ? (
            <li className="px-4 py-3 text-center text-gray-500">
              {inputValue ? 'No results found' : 'Type to search'}
            </li>
          ) : (
            filteredOptions.map((option: SelectOption<string>, index: number) => (
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
            ))
          )}
        </ul>
      )}
    </div>
  )
}

const basicAsyncCode = `const { isOpen, isLoading, filteredOptions, ... } = useCombobox({
  options: [],
  loadOptions: async (search) => {
    const response = await fetch(\`/api/search?q=\${search}\`)
    return response.json()
  },
})

// Show loading state
{isLoading && <Spinner />}`

const debounceCode = `const { ... } = useCombobox({
  options: [],
  loadOptions: searchFn,
  searchDebounce: 300,  // Wait 300ms after typing stops
})`

const minLengthCode = `const { ... } = useCombobox({
  options: [],
  loadOptions: searchFn,
  minSearchLength: 2,  // Only search when >= 2 characters
})`

const cacheCode = `// Implement caching in your loadOptions function
const cache = new Map()

const cachedSearch = async (search) => {
  if (cache.has(search)) {
    return cache.get(search)
  }
  const response = await fetch(\`/api/search?q=\${search}\`)
  const data = await response.json()
  cache.set(search, data)
  return data
}

const { ... } = useCombobox({
  options: [],
  loadOptions: cachedSearch,
})`

const errorHandlingCode = `// Handle errors in your loadOptions function
const { ... } = useCombobox({
  options: [],
  loadOptions: async (search) => {
    try {
      const response = await fetch(\`/api/search?q=\${search}\`)
      if (!response.ok) throw new Error('Failed')
      return response.json()
    } catch (error) {
      console.error('Search failed:', error)
      return []
    }
  },
})`

export default function AsyncPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Async Loading</h1>
        <p className="mt-4 text-lg text-gray-600">
          Load options asynchronously from an API with debouncing and caching support.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Async</h2>
        <Demo title="Async Combobox" description="Type to search. Results are loaded from a simulated API.">
          <AsyncCombobox />
        </Demo>
        <div className="mt-4">
          <CodeBlock code={basicAsyncCode} language="tsx" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Debouncing</h2>
        <p className="text-gray-600 mb-4">
          Prevent excessive API calls by debouncing the search input.
        </p>
        <CodeBlock code={debounceCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Minimum Search Length</h2>
        <p className="text-gray-600 mb-4">
          Only trigger the search after a minimum number of characters.
        </p>
        <CodeBlock code={minLengthCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Caching</h2>
        <p className="text-gray-600 mb-4">
          Cache search results to avoid redundant API calls.
        </p>
        <CodeBlock code={cacheCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Handling</h2>
        <p className="text-gray-600 mb-4">
          Handle loading errors gracefully in your loadOptions function.
        </p>
        <CodeBlock code={errorHandlingCode} language="tsx" />
      </section>
    </div>
  )
}
