import { Link } from 'react-router-dom'
import { useSelect } from '@oxog/selectkit/react'
import CodeBlock from '../components/CodeBlock'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
]

function HeroSelect() {
  const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps } = useSelect({
    options: fruits,
    placeholder: 'Select a fruit...',
  })

  return (
    <div {...getContainerProps()} className="relative w-72">
      <button
        {...getTriggerProps()}
        className="w-full px-4 py-3 text-left bg-white border-2 border-primary-200 rounded-xl shadow-sm hover:border-primary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
      >
        <span className={state.selectedOptions[0] ? 'text-gray-900' : 'text-gray-400'}>
          {state.selectedOptions[0]?.label || 'Select a fruit...'}
        </span>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {state.isOpen && (
        <ul
          {...getMenuProps()}
          className="absolute z-10 w-full mt-2 py-2 bg-white border border-gray-200 rounded-xl shadow-xl"
        >
          {state.filteredOptions.map((option, index) => (
            <li
              key={option.value}
              {...getOptionProps(option, index)}
              className={`px-4 py-2 cursor-pointer transition-colors ${
                index === state.highlightedIndex
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50'
              } ${state.value === option.value ? 'font-medium' : ''}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const installCode = `npm install @oxog/selectkit`

const basicCode = `import { useSelect } from '@oxog/selectkit/react'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

function MySelect() {
  const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps } = useSelect({
    options,
    placeholder: 'Select a fruit...',
  })

  return (
    <div {...getContainerProps()}>
      <button {...getTriggerProps()}>
        {state.selectedOptions[0]?.label || 'Select...'}
      </button>
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

const features = [
  {
    title: 'Zero Dependencies',
    description: 'No runtime dependencies. Just pure TypeScript code that works everywhere.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: 'Fully Accessible',
    description: 'WAI-ARIA compliant with keyboard navigation, screen reader support, and focus management.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: 'Headless Architecture',
    description: 'Complete control over styling and rendering. Use any CSS framework or custom styles.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    title: 'TypeScript First',
    description: 'Written in TypeScript with full type safety and excellent IDE integration.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'Async Support',
    description: 'Load options asynchronously with debouncing, caching, and abort controller support.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: 'Virtual Scrolling',
    description: 'Efficiently render thousands of options with virtual scrolling support.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero section */}
      <div className="text-center py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          Headless Select & Combobox
          <br />
          <span className="text-primary-600">for React</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          Zero-dependency, fully accessible, and completely customizable.
          Build beautiful select components with complete control over styling.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/getting-started" className="btn btn-primary px-6 py-3 text-lg">
            Get Started
          </Link>
          <a
            href="https://github.com/oxog/selectkit"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary px-6 py-3 text-lg"
          >
            View on GitHub
          </a>
        </div>
      </div>

      {/* Live demo */}
      <div className="flex justify-center py-8">
        <HeroSelect />
      </div>

      {/* Install */}
      <div className="mt-12">
        <CodeBlock code={installCode} language="bash" />
      </div>

      {/* Quick example */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Example</h2>
        <CodeBlock code={basicCode} language="tsx" />
      </div>

      {/* Features */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="p-6 border border-gray-200 rounded-xl">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bundle size */}
      <div className="mt-16 p-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tiny Bundle Size</h2>
        <div className="flex flex-wrap gap-8">
          <div>
            <div className="text-4xl font-bold text-primary-600">&lt;4KB</div>
            <div className="text-gray-600">Core (gzipped)</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600">&lt;6KB</div>
            <div className="text-gray-600">With React (gzipped)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
