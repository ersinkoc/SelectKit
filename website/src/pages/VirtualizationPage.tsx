import CodeBlock from '../components/CodeBlock'

const basicVirtualCode = `import { useRef } from 'react'
import { useSelect } from '@oxog/selectkit/react'
import { useVirtualList } from '@oxog/scrollex'

function VirtualizedSelect() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps } = useSelect({
    options: largeOptionsList, // 10,000+ options
  })

  const { virtualItems, totalSize } = useVirtualList({
    count: state.filteredOptions.length,
    containerRef,
    estimatedItemHeight: 40,
    overscan: 5,
  })

  return (
    <div {...getContainerProps()}>
      <button {...getTriggerProps()}>
        {state.selectedOption?.label || 'Select...'}
      </button>

      {state.isOpen && (
        <div
          ref={containerRef}
          {...getMenuProps()}
          style={{ height: 300, overflow: 'auto' }}
        >
          <div style={{ height: totalSize, position: 'relative' }}>
            {virtualItems.map((virtualItem) => {
              const option = state.filteredOptions[virtualItem.index]!
              return (
                <div
                  key={option.value}
                  {...getOptionProps(option, virtualItem.index)}
                  style={{
                    position: 'absolute',
                    top: virtualItem.start,
                    height: virtualItem.size,
                    width: '100%',
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

const virtualListComponentCode = `import { useSelect } from '@oxog/selectkit/react'
import { VirtualList } from '@oxog/scrollex'

function VirtualizedSelect() {
  const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps } = useSelect({
    options: largeOptionsList,
  })

  return (
    <div {...getContainerProps()}>
      <button {...getTriggerProps()}>
        {state.selectedOption?.label || 'Select...'}
      </button>

      {state.isOpen && (
        <VirtualList
          {...getMenuProps()}
          data={state.filteredOptions}
          height={300}
          itemHeight={40}
          renderItem={({ item, index, style }) => (
            <div {...getOptionProps(item, index)} style={style}>
              {item.label}
            </div>
          )}
        />
      )}
    </div>
  )
}`

const scrollToHighlightCode = `import { useRef, useEffect } from 'react'
import { useSelect } from '@oxog/selectkit/react'
import { useVirtualList } from '@oxog/scrollex'

function VirtualizedSelect() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { state, ... } = useSelect({ options: largeOptionsList })

  const { virtualItems, totalSize, scrollToIndex } = useVirtualList({
    count: state.filteredOptions.length,
    containerRef,
    estimatedItemHeight: 40,
  })

  // Scroll to highlighted option when it changes
  useEffect(() => {
    if (state.highlightedIndex >= 0) {
      scrollToIndex(state.highlightedIndex, { align: 'auto' })
    }
  }, [state.highlightedIndex, scrollToIndex])

  // ... rest of component
}`

const dynamicHeightCode = `const { virtualItems, totalSize, measureElement } = useVirtualList({
  count: state.filteredOptions.length,
  containerRef,
  estimatedItemHeight: 50,
  // Dynamic heights - items with descriptions are taller
  getItemHeight: (index) => {
    const option = state.filteredOptions[index]
    return option?.description ? 72 : 40
  },
})

// For auto-measurement of dynamic content
{virtualItems.map((virtualItem) => {
  const option = state.filteredOptions[virtualItem.index]
  return (
    <div
      key={option.value}
      ref={(el) => measureElement(virtualItem.index, el)}
      style={{
        position: 'absolute',
        top: virtualItem.start,
        width: '100%',
      }}
    >
      <div>{option.label}</div>
      {option.description && (
        <div className="text-sm text-gray-500">{option.description}</div>
      )}
    </div>
  )
})}`

const pluginsCode = `import { useVirtualList } from '@oxog/scrollex'
import { stickyHeadersPlugin } from '@oxog/scrollex/plugins'

// Grouped options with sticky category headers
const { virtualItems, totalSize } = useVirtualList({
  count: state.filteredOptions.length,
  containerRef,
  estimatedItemHeight: 40,
  plugins: [
    stickyHeadersPlugin({
      getGroupKey: (index) => state.filteredOptions[index]?.group || '',
      renderHeader: (groupKey) => (
        <div className="sticky top-0 bg-gray-900 px-4 py-2 font-semibold">
          {groupKey}
        </div>
      ),
    }),
  ],
})`

const performanceTipsCode = `// 1. Memoize options to prevent unnecessary re-renders
const memoizedOptions = useMemo(() => options, [options])

// 2. Use stable references for event handlers
const handleChange = useCallback((value, option) => {
  setValue(value)
}, [])

// 3. Invalidate measurements when options change
const { invalidateAllMeasurements } = useVirtualList({
  count: state.filteredOptions.length,
  containerRef,
  estimatedItemHeight: 40,
})

useEffect(() => {
  invalidateAllMeasurements()
}, [state.filteredOptions, invalidateAllMeasurements])`

export default function VirtualizationPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Virtualization</h1>
        <p className="mt-4 text-lg text-gray-400">
          Efficiently render large lists with thousands of options using virtual scrolling.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Why Virtualization?</h2>
        <p className="text-gray-400 mb-4">
          When dealing with large datasets (1,000+ options), rendering all items at once can cause:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          <li>Slow initial render times</li>
          <li>Janky scrolling performance</li>
          <li>High memory usage</li>
          <li>Poor user experience</li>
        </ul>
        <p className="text-gray-400 mt-4">
          Virtual scrolling solves this by only rendering the items currently visible in the viewport,
          plus a small buffer (overscan).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">With Scrollex</h2>
        <p className="text-gray-400 mb-4">
          We recommend using{' '}
          <a
            href="https://scrollex.oxog.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:text-primary-300 hover:underline"
          >
            @oxog/scrollex
          </a>{' '}
          for the best virtual scrolling experience. It's our lightweight, plugin-based virtualization
          library designed to work seamlessly with SelectKit:
        </p>
        <CodeBlock code={basicVirtualCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">VirtualList Component</h2>
        <p className="text-gray-400 mb-4">
          For a simpler API, use the{' '}
          <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">VirtualList</code>{' '}
          component:
        </p>
        <CodeBlock code={virtualListComponentCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Scroll to Highlighted</h2>
        <p className="text-gray-400 mb-4">
          Ensure the highlighted option is always visible when using keyboard navigation:
        </p>
        <CodeBlock code={scrollToHighlightCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Dynamic Heights</h2>
        <p className="text-gray-400 mb-4">
          For options with varying heights, use{' '}
          <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">getItemHeight</code>{' '}
          or auto-measurement with{' '}
          <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">measureElement</code>:
        </p>
        <CodeBlock code={dynamicHeightCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Plugins</h2>
        <p className="text-gray-400 mb-4">
          Scrollex supports plugins for advanced features like sticky headers, infinite loading, and more:
        </p>
        <CodeBlock code={pluginsCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Performance Tips</h2>
        <CodeBlock code={performanceTipsCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">When to Use Virtualization</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Option Count</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-900/50">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-100">&lt; 100</td>
                <td className="px-4 py-3 text-sm text-gray-400">No virtualization needed</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-100">100 - 500</td>
                <td className="px-4 py-3 text-sm text-gray-400">Optional - test performance first</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-100">500 - 5,000</td>
                <td className="px-4 py-3 text-sm text-gray-400">Recommended</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-100">&gt; 5,000</td>
                <td className="px-4 py-3 text-sm text-gray-400">Required + consider pagination/search</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Installation</h2>
        <p className="text-gray-400 mb-4">
          Install Scrollex alongside SelectKit:
        </p>
        <CodeBlock code={`npm install @oxog/scrollex`} language="bash" />
        <p className="text-gray-400 mt-4">
          For more details, visit the{' '}
          <a
            href="https://scrollex.oxog.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:text-primary-300 hover:underline"
          >
            Scrollex documentation
          </a>.
        </p>
      </section>
    </div>
  )
}
