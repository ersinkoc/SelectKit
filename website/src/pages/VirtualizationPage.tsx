import CodeBlock from '../components/CodeBlock'

const basicVirtualCode = `import { useSelect } from '@oxog/selectkit/react'
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualizedSelect() {
  const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps } = useSelect({
    options: largeOptionsList, // 10,000+ options
  })

  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: state.filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36, // Estimated option height
    overscan: 5,
  })

  return (
    <div {...getContainerProps()}>
      <button {...getTriggerProps()}>
        {state.selectedOption?.label || 'Select...'}
      </button>

      {state.isOpen && (
        <div
          ref={parentRef}
          {...getMenuProps()}
          style={{ height: '300px', overflow: 'auto' }}
        >
          <div
            style={{
              height: \`\${virtualizer.getTotalSize()}px\`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const option = state.filteredOptions[virtualRow.index]!
              return (
                <div
                  key={option.value}
                  {...getOptionProps(option, virtualRow.index)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: \`\${virtualRow.size}px\`,
                    transform: \`translateY(\${virtualRow.start}px)\`,
                  }}
                >
                  {option.label}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}`

const builtInVirtualCode = `import { createSelect, VirtualScroller } from '@oxog/selectkit'

// Create a select with built-in virtualization
const select = createSelect({
  options: largeOptionsList,
})

// Use the VirtualScroller utility
const scroller = new VirtualScroller({
  itemHeight: 36,
  containerHeight: 300,
  overscan: 5,
})

// Get visible items
const { startIndex, endIndex, offsetTop, totalHeight } = scroller.getVisibleRange(
  scrollTop,
  state.filteredOptions.length
)

const visibleOptions = state.filteredOptions.slice(startIndex, endIndex + 1)`

const scrollToHighlightCode = `const virtualizer = useVirtualizer({
  count: state.filteredOptions.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 36,
})

// Scroll to highlighted option when it changes
useEffect(() => {
  if (state.highlightedIndex >= 0) {
    virtualizer.scrollToIndex(state.highlightedIndex, { align: 'auto' })
  }
}, [state.highlightedIndex, virtualizer])`

const dynamicHeightCode = `const virtualizer = useVirtualizer({
  count: state.filteredOptions.length,
  getScrollElement: () => parentRef.current,
  // Dynamic height based on option content
  estimateSize: (index) => {
    const option = state.filteredOptions[index]
    return option?.description ? 56 : 36
  },
})`

const performanceTipsCode = `// 1. Memoize options to prevent unnecessary re-renders
const memoizedOptions = useMemo(() => options, [options])

// 2. Use stable references for event handlers
const handleChange = useCallback((value, option) => {
  setValue(value)
}, [])

// 3. Consider windowed rendering for very large lists
const windowedOptions = useMemo(() => {
  if (state.filteredOptions.length > 1000) {
    return state.filteredOptions.slice(0, 1000)
  }
  return state.filteredOptions
}, [state.filteredOptions])`

export default function VirtualizationPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Virtualization</h1>
        <p className="mt-4 text-lg text-gray-600">
          Efficiently render large lists with thousands of options using virtual scrolling.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Virtualization?</h2>
        <p className="text-gray-600 mb-4">
          When dealing with large datasets (1,000+ options), rendering all items at once can cause:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Slow initial render times</li>
          <li>Janky scrolling performance</li>
          <li>High memory usage</li>
          <li>Poor user experience</li>
        </ul>
        <p className="text-gray-600 mt-4">
          Virtual scrolling solves this by only rendering the items currently visible in the viewport,
          plus a small buffer (overscan).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">With TanStack Virtual</h2>
        <p className="text-gray-600 mb-4">
          We recommend using{' '}
          <a
            href="https://tanstack.com/virtual"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            @tanstack/react-virtual
          </a>{' '}
          for the best virtual scrolling experience:
        </p>
        <CodeBlock code={basicVirtualCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Built-in VirtualScroller</h2>
        <p className="text-gray-600 mb-4">
          SelectKit includes a lightweight <code className="inline-code">VirtualScroller</code> utility
          for framework-agnostic virtualization:
        </p>
        <CodeBlock code={builtInVirtualCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Scroll to Highlighted</h2>
        <p className="text-gray-600 mb-4">
          Ensure the highlighted option is always visible when using keyboard navigation:
        </p>
        <CodeBlock code={scrollToHighlightCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dynamic Heights</h2>
        <p className="text-gray-600 mb-4">
          For options with varying heights, use the <code className="inline-code">estimateSize</code>{' '}
          function:
        </p>
        <CodeBlock code={dynamicHeightCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Tips</h2>
        <CodeBlock code={performanceTipsCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">When to Use Virtualization</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Option Count</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">&lt; 100</td>
                <td className="px-4 py-3 text-sm text-gray-600">No virtualization needed</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">100 - 500</td>
                <td className="px-4 py-3 text-sm text-gray-600">Optional - test performance first</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">500 - 5,000</td>
                <td className="px-4 py-3 text-sm text-gray-600">Recommended</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">&gt; 5,000</td>
                <td className="px-4 py-3 text-sm text-gray-600">Required + consider pagination/search</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
