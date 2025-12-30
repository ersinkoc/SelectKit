import CodeBlock from '../components/CodeBlock'

const tailwindCode = `function TailwindSelect() {
  const { state, getContainerProps, getTriggerProps, getMenuProps, getOptionProps } = useSelect({
    options,
  })

  return (
    <div {...getContainerProps()} className="relative">
      <button
        {...getTriggerProps()}
        className="w-full px-4 py-2.5 text-left bg-white border border-gray-300 rounded-lg shadow-sm
                   hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <span className={state.selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {state.selectedOption?.label || 'Select an option...'}
        </span>
        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </button>

      {state.isOpen && (
        <ul
          {...getMenuProps()}
          className="absolute z-10 w-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg
                     max-h-60 overflow-auto focus:outline-none"
        >
          {state.filteredOptions.map((option, index) => (
            <li
              key={option.value}
              {...getOptionProps(option, index)}
              className={\`px-4 py-2 cursor-pointer transition-colors
                \${index === state.highlightedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                \${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                \${state.value === option.value ? 'font-medium' : ''}\`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}`

const cssModulesCode = `// Select.module.css
.container {
  position: relative;
}

.trigger {
  width: 100%;
  padding: 0.625rem 1rem;
  text-align: left;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
}

.trigger:hover {
  border-color: #9ca3af;
}

.trigger:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6;
}

.menu {
  position: absolute;
  z-index: 10;
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.25rem 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

.option {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.option:hover {
  background: #f9fafb;
}

.optionHighlighted {
  background: #eff6ff;
  color: #1d4ed8;
}

// Component
import styles from './Select.module.css'

<div {...getContainerProps()} className={styles.container}>
  <button {...getTriggerProps()} className={styles.trigger}>
    {state.selectedOption?.label || 'Select...'}
  </button>
  {state.isOpen && (
    <ul {...getMenuProps()} className={styles.menu}>
      {state.filteredOptions.map((option, index) => (
        <li
          key={option.value}
          {...getOptionProps(option, index)}
          className={\`\${styles.option} \${
            index === state.highlightedIndex ? styles.optionHighlighted : ''
          }\`}
        >
          {option.label}
        </li>
      ))}
    </ul>
  )}
</div>`

const cssInJsCode = `import styled from 'styled-components'

const Container = styled.div\`
  position: relative;
\`

const Trigger = styled.button<{ isOpen: boolean }>\`
  width: 100%;
  padding: 0.625rem 1rem;
  text-align: left;
  background: white;
  border: 1px solid \${props => props.isOpen ? '#3b82f6' : '#d1d5db'};
  border-radius: 0.5rem;
  transition: border-color 0.15s;

  &:hover {
    border-color: \${props => props.isOpen ? '#3b82f6' : '#9ca3af'};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
\`

const Menu = styled.ul\`
  position: absolute;
  z-index: 10;
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.25rem 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  max-height: 15rem;
  overflow: auto;
\`

const Option = styled.li<{ isHighlighted: boolean; isSelected: boolean }>\`
  padding: 0.5rem 1rem;
  cursor: pointer;
  background: \${props => props.isHighlighted ? '#eff6ff' : 'transparent'};
  color: \${props => props.isHighlighted ? '#1d4ed8' : '#374151'};
  font-weight: \${props => props.isSelected ? '500' : 'normal'};

  &:hover {
    background: \${props => props.isHighlighted ? '#eff6ff' : '#f9fafb'};
  }
\``

const animationCode = `// With Tailwind CSS
<ul
  {...getMenuProps()}
  className={\`
    absolute z-10 w-full mt-1 py-1 bg-white border rounded-lg shadow-lg
    transform transition-all duration-150 origin-top
    \${state.isOpen
      ? 'opacity-100 scale-100'
      : 'opacity-0 scale-95 pointer-events-none'}
  \`}
>

// Or with Framer Motion
import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence>
  {state.isOpen && (
    <motion.ul
      {...getMenuProps()}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
      className="absolute z-10 w-full mt-1 py-1 bg-white border rounded-lg shadow-lg"
    >
      {/* options */}
    </motion.ul>
  )}
</AnimatePresence>`

const customIconsCode = `function SelectWithIcons() {
  return (
    <div {...getContainerProps()} className="relative">
      <button {...getTriggerProps()} className="...">
        {state.selectedOption && (
          <span className="flex items-center gap-2">
            <img
              src={state.selectedOption.icon}
              alt=""
              className="w-5 h-5 rounded-full"
            />
            {state.selectedOption.label}
          </span>
        )}
        {!state.selectedOption && 'Select...'}
      </button>

      {state.isOpen && (
        <ul {...getMenuProps()}>
          {state.filteredOptions.map((option, index) => (
            <li key={option.value} {...getOptionProps(option, index)}>
              <span className="flex items-center gap-2">
                <img src={option.icon} alt="" className="w-5 h-5 rounded-full" />
                {option.label}
              </span>
              {state.value === option.value && (
                <CheckIcon className="w-4 h-4 text-blue-600" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}`

export default function StylingPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Styling</h1>
        <p className="mt-4 text-lg text-gray-400">
          SelectKit is completely unstyled, giving you full control over the appearance. Use any styling
          approach you prefer.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Headless Architecture</h2>
        <p className="text-gray-400 mb-4">
          SelectKit follows the headless UI pattern. It handles all the complex logic (keyboard navigation,
          ARIA attributes, state management) while you provide the visual layer.
        </p>
        <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
          <p className="text-sm text-primary-300">
            <strong>Key principle:</strong> Props getter functions like{' '}
            <code className="px-1.5 py-0.5 bg-gray-800 rounded text-primary-400 text-sm">getTriggerProps()</code> return the necessary attributes and event
            handlers. You spread these onto your elements and add your own classes.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Tailwind CSS</h2>
        <p className="text-gray-400 mb-4">Perfect for utility-first styling with Tailwind CSS:</p>
        <CodeBlock code={tailwindCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">CSS Modules</h2>
        <p className="text-gray-400 mb-4">For scoped, modular CSS:</p>
        <CodeBlock code={cssModulesCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">CSS-in-JS</h2>
        <p className="text-gray-400 mb-4">
          Works great with styled-components, Emotion, or any CSS-in-JS library:
        </p>
        <CodeBlock code={cssInJsCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Animations</h2>
        <p className="text-gray-400 mb-4">Add smooth animations for opening/closing the dropdown:</p>
        <CodeBlock code={animationCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Custom Option Rendering</h2>
        <p className="text-gray-400 mb-4">
          Render options with icons, descriptions, or any custom content:
        </p>
        <CodeBlock code={customIconsCode} language="tsx" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Styling States</h2>
        <p className="text-gray-400 mb-4">Access these state properties to style different states:</p>
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">State</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Property</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Use For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-900/50">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-100">Open/Closed</td>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">state.isOpen</td>
                <td className="px-4 py-3 text-sm text-gray-400">Show/hide menu, rotate chevron</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-100">Highlighted</td>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">state.highlightedIndex</td>
                <td className="px-4 py-3 text-sm text-gray-400">Highlight current option</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-100">Selected</td>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">state.value</td>
                <td className="px-4 py-3 text-sm text-gray-400">Show checkmark, bold text</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-100">Disabled</td>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">option.disabled</td>
                <td className="px-4 py-3 text-sm text-gray-400">Gray out, prevent interaction</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-100">Loading</td>
                <td className="px-4 py-3 text-sm font-mono text-primary-400">isLoading</td>
                <td className="px-4 py-3 text-sm text-gray-400">Show spinner</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
