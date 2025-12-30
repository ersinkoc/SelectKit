import { useCombobox, type SelectOption } from '@oxog/selectkit/react'
import { Loader2, Search } from 'lucide-react'
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          {...getInputProps()}
          className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
          </div>
        )}
      </div>
      {isOpen && (
        <ul
          {...getMenuProps()}
          className="absolute z-50 w-full mt-1 py-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto"
        >
          {isLoading ? (
            <li className="px-4 py-3 text-center text-gray-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </li>
          ) : filteredOptions.length === 0 ? (
            <li className="px-4 py-3 text-center text-gray-500">
              {inputValue ? 'No results found' : 'Type to search'}
            </li>
          ) : (
            filteredOptions.map((option: SelectOption<string>, index: number) => (
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
        <h1 className="text-3xl font-bold text-gray-100">Async Loading</h1>
        <p className="mt-4 text-lg text-gray-400">
          Load options asynchronously from an API with debouncing and caching support.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Basic Async</h2>
        <Demo title="Async Combobox" description="Type to search. Results are loaded from a simulated API.">
          <AsyncCombobox />
        </Demo>
        <div className="mt-4">
          <CodeBlock code={basicAsyncCode} language="tsx" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Debouncing</h2>
        <p className="text-gray-400 mb-4">
          Prevent excessive API calls by debouncing the search input.
        </p>
        <CodeBlock code={debounceCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Minimum Search Length</h2>
        <p className="text-gray-400 mb-4">
          Only trigger the search after a minimum number of characters.
        </p>
        <CodeBlock code={minLengthCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Caching</h2>
        <p className="text-gray-400 mb-4">
          Cache search results to avoid redundant API calls.
        </p>
        <CodeBlock code={cacheCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Error Handling</h2>
        <p className="text-gray-400 mb-4">
          Handle loading errors gracefully in your loadOptions function.
        </p>
        <CodeBlock code={errorHandlingCode} language="tsx" />
      </section>
    </div>
  )
}
