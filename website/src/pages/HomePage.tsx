import { Link } from 'react-router-dom'
import { useSelect } from '@oxog/selectkit/react'
import { motion } from 'framer-motion'
import { Package, Accessibility, Palette, Code2, RefreshCw, List, ChevronDown } from 'lucide-react'
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
        className="w-full px-4 py-3 text-left bg-gray-800 border-2 border-gray-700 rounded-xl shadow-lg hover:border-primary-500/50 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
      >
        <span className={state.selectedOptions[0] ? 'text-gray-100' : 'text-gray-500'}>
          {state.selectedOptions[0]?.label || 'Select a fruit...'}
        </span>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
          <ChevronDown className={`w-5 h-5 transition-transform ${state.isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {state.isOpen && (
        <ul
          {...getMenuProps()}
          className="absolute z-50 w-full mt-2 py-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl"
        >
          {state.filteredOptions.map((option, index) => (
            <li
              key={option.value}
              {...getOptionProps(option, index)}
              className={`px-4 py-2.5 cursor-pointer transition-colors ${
                index === state.highlightedIndex
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'text-gray-300 hover:bg-gray-700'
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
    icon: Package,
  },
  {
    title: 'Fully Accessible',
    description: 'WAI-ARIA compliant with keyboard navigation, screen reader support, and focus management.',
    icon: Accessibility,
  },
  {
    title: 'Headless Architecture',
    description: 'Complete control over styling and rendering. Use any CSS framework or custom styles.',
    icon: Palette,
  },
  {
    title: 'TypeScript First',
    description: 'Written in TypeScript with full type safety and excellent IDE integration.',
    icon: Code2,
  },
  {
    title: 'Async Support',
    description: 'Load options asynchronously with debouncing, caching, and abort controller support.',
    icon: RefreshCw,
  },
  {
    title: 'Virtual Scrolling',
    description: 'Efficiently render thousands of options with virtual scrolling support.',
    icon: List,
  },
]

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 tracking-tight">
          Headless Select & Combobox
          <br />
          <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">for React</span>
        </h1>
        <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto">
          Zero-dependency, fully accessible, and completely customizable.
          Build beautiful select components with complete control over styling.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/getting-started"
            className="px-6 py-3 text-lg font-medium bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-colors"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/ersinkoc/selectkit"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 text-lg font-medium bg-gray-800 text-gray-100 rounded-xl hover:bg-gray-700 transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </motion.div>

      {/* Live demo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center py-8"
      >
        <HeroSelect />
      </motion.div>

      {/* Install */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <CodeBlock code={installCode} language="bash" />
      </motion.div>

      {/* Quick example */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Quick Example</h2>
        <CodeBlock code={basicCode} language="tsx" />
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-100 mb-8">Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors"
            >
              <div className="w-12 h-12 bg-primary-500/10 text-primary-400 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100">{feature.title}</h3>
              <p className="mt-2 text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bundle size */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="p-8 bg-gradient-to-r from-primary-900/50 to-primary-800/50 border border-primary-700/50 rounded-2xl"
      >
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Tiny Bundle Size</h2>
        <div className="flex flex-wrap gap-8">
          <div>
            <div className="text-4xl font-bold text-primary-400">&lt;4KB</div>
            <div className="text-gray-400">Core (gzipped)</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-400">&lt;6KB</div>
            <div className="text-gray-400">With React (gzipped)</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
