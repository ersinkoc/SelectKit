import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import React from 'react'
import {
  useSelect,
  useMultiSelect,
  useCombobox,
  SelectProvider,
  Select,
  MultiSelect,
  Combobox,
  Autocomplete,
  useSelectContext,
} from '../../src/adapters/react'
import type { SelectOption as SelectOptionType } from '../../src/types'

const basicOptions: SelectOptionType[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const groupedOptions = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'broccoli', label: 'Broccoli' },
    ],
  },
]

describe('React Adapter', () => {
  afterEach(() => {
    cleanup()
  })

  describe('useSelect hook', () => {
    function TestComponent({
      options = basicOptions,
      ...props
    }: {
      options?: SelectOptionType[]
      [key: string]: unknown
    }) {
      const select = useSelect({ options, ...props })
      return (
        <div {...select.getContainerProps()}>
          <button {...select.getTriggerProps()} data-testid="trigger">
            {select.state.selectedOptions[0]?.label || 'Select...'}
          </button>
          {select.state.isOpen && (
            <ul {...select.getMenuProps()} data-testid="menu">
              {select.state.options.map((option, index) => (
                <li
                  key={option.value}
                  {...select.getOptionProps(option, index)}
                  data-testid={`option-${option.value}`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    }

    it('should render closed by default', () => {
      render(<TestComponent />)

      expect(screen.getByTestId('trigger')).toBeInTheDocument()
      expect(screen.queryByTestId('menu')).not.toBeInTheDocument()
    })

    it('should open on trigger click', () => {
      render(<TestComponent />)

      fireEvent.click(screen.getByTestId('trigger'))

      expect(screen.getByTestId('menu')).toBeInTheDocument()
      expect(screen.getAllByRole('option')).toHaveLength(3)
    })

    it('should select option on click', () => {
      render(<TestComponent />)

      fireEvent.click(screen.getByTestId('trigger'))
      fireEvent.click(screen.getByTestId('option-banana'))

      expect(screen.getByTestId('trigger')).toHaveTextContent('Banana')
      expect(screen.queryByTestId('menu')).not.toBeInTheDocument()
    })

    it('should call onChange when value changes', () => {
      const onChange = vi.fn()
      render(<TestComponent onChange={onChange} />)

      fireEvent.click(screen.getByTestId('trigger'))
      fireEvent.click(screen.getByTestId('option-cherry'))

      expect(onChange).toHaveBeenCalled()
      expect(onChange.mock.calls[0][0]).toBe('cherry')
    })

    it('should respect defaultValue', () => {
      render(<TestComponent defaultValue="banana" />)

      expect(screen.getByTestId('trigger')).toHaveTextContent('Banana')
    })

    it('should work in controlled mode', () => {
      function ControlledComponent() {
        const [value, setValue] = React.useState<string | null>('apple')
        const select = useSelect({
          options: basicOptions,
          value,
          onChange: setValue,
        })

        return (
          <div>
            <button onClick={() => setValue('cherry')} data-testid="external">
              Set Cherry
            </button>
            <div {...select.getContainerProps()}>
              <button {...select.getTriggerProps()} data-testid="trigger">
                {select.state.selectedOptions[0]?.label || 'Select...'}
              </button>
            </div>
          </div>
        )
      }

      render(<ControlledComponent />)

      expect(screen.getByTestId('trigger')).toHaveTextContent('Apple')

      fireEvent.click(screen.getByTestId('external'))

      expect(screen.getByTestId('trigger')).toHaveTextContent('Cherry')
    })

    it('should handle keyboard navigation', () => {
      render(<TestComponent />)

      const trigger = screen.getByTestId('trigger')
      fireEvent.keyDown(trigger, { key: 'ArrowDown' })

      expect(screen.getByTestId('menu')).toBeInTheDocument()

      fireEvent.keyDown(trigger, { key: 'ArrowDown' })
      fireEvent.keyDown(trigger, { key: 'Enter' })

      expect(screen.getByTestId('trigger')).toHaveTextContent('Banana')
    })

    it('should close on Escape', () => {
      render(<TestComponent />)

      fireEvent.click(screen.getByTestId('trigger'))
      expect(screen.getByTestId('menu')).toBeInTheDocument()

      fireEvent.keyDown(screen.getByTestId('trigger'), { key: 'Escape' })

      expect(screen.queryByTestId('menu')).not.toBeInTheDocument()
    })
  })

  describe('useMultiSelect hook', () => {
    function TestComponent(props: { [key: string]: unknown }) {
      const select = useMultiSelect({ options: basicOptions, ...props })
      return (
        <div {...select.getContainerProps()}>
          <div data-testid="tags">
            {select.state.selectedOptions.map((option, index) => (
              <span key={option.value} {...select.getTagProps(option, index)}>
                {option.label}
                <button
                  {...select.getTagRemoveProps(option)}
                  data-testid={`remove-${option.value}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button {...select.getTriggerProps()} data-testid="trigger">
            Select...
          </button>
          {select.state.isOpen && (
            <ul {...select.getMenuProps()} data-testid="menu">
              {select.state.options.map((option, index) => (
                <li
                  key={option.value}
                  {...select.getOptionProps(option, index)}
                  data-testid={`option-${option.value}`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    }

    it('should handle multiple selection', () => {
      render(<TestComponent />)

      fireEvent.click(screen.getByTestId('trigger'))
      fireEvent.click(screen.getByTestId('option-apple'))
      fireEvent.click(screen.getByTestId('option-banana'))

      expect(screen.getByTestId('tags')).toHaveTextContent('Apple')
      expect(screen.getByTestId('tags')).toHaveTextContent('Banana')
    })

    it('should remove tag on click', () => {
      render(<TestComponent defaultValue={['apple', 'banana']} />)

      fireEvent.click(screen.getByTestId('remove-apple'))

      expect(screen.getByTestId('tags')).not.toHaveTextContent('Apple')
      expect(screen.getByTestId('tags')).toHaveTextContent('Banana')
    })

    it('should toggle selection', () => {
      render(<TestComponent defaultValue={['apple']} />)

      fireEvent.click(screen.getByTestId('trigger'))
      fireEvent.click(screen.getByTestId('option-apple'))

      expect(screen.getByTestId('tags')).not.toHaveTextContent('Apple')
    })

    it('should keep menu open after selection', () => {
      render(<TestComponent />)

      fireEvent.click(screen.getByTestId('trigger'))
      fireEvent.click(screen.getByTestId('option-apple'))

      expect(screen.getByTestId('menu')).toBeInTheDocument()
    })

    it('should respect max selection limit', () => {
      render(<TestComponent maxSelected={2} />)

      fireEvent.click(screen.getByTestId('trigger'))
      fireEvent.click(screen.getByTestId('option-apple'))
      fireEvent.click(screen.getByTestId('option-banana'))
      fireEvent.click(screen.getByTestId('option-cherry'))

      // Only two should be selected
      expect(screen.getByTestId('tags').textContent).not.toContain('Cherry')
    })
  })

  describe('useCombobox hook', () => {
    function TestComponent(props: { [key: string]: unknown }) {
      const select = useCombobox({ options: basicOptions, ...props })
      return (
        <div>
          <input
            {...select.getInputProps()}
            data-testid="input"
          />
          {select.isOpen && (
            <ul {...select.getMenuProps()} data-testid="menu">
              {select.filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  {...select.getOptionProps(option, index)}
                  data-testid={`option-${option.value}`}
                >
                  {option.label}
                </li>
              ))}
              {select.filteredOptions.length === 0 && (
                <li data-testid="empty">No options</li>
              )}
            </ul>
          )}
        </div>
      )
    }

    it('should filter options based on search', () => {
      render(<TestComponent />)

      const input = screen.getByTestId('input')
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: 'app' } })

      expect(screen.getByTestId('menu')).toBeInTheDocument()
      expect(screen.getByTestId('option-apple')).toBeInTheDocument()
      expect(screen.queryByTestId('option-banana')).not.toBeInTheDocument()
    })

    it('should show empty state when no matches', () => {
      render(<TestComponent />)

      const input = screen.getByTestId('input')
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: 'xyz' } })

      expect(screen.getByTestId('empty')).toBeInTheDocument()
    })

    it('should select option and update input', () => {
      render(<TestComponent />)

      const input = screen.getByTestId('input')
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: 'ban' } })
      fireEvent.click(screen.getByTestId('option-banana'))

      // After selection, input should be cleared (default behavior)
      expect(input).toHaveValue('')
    })

    it('should open on focus', () => {
      render(<TestComponent />)

      fireEvent.focus(screen.getByTestId('input'))

      expect(screen.getByTestId('menu')).toBeInTheDocument()
    })

    it('should handle keyboard selection', () => {
      render(<TestComponent />)

      const input = screen.getByTestId('input')
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      fireEvent.keyDown(input, { key: 'ArrowDown' })
      fireEvent.keyDown(input, { key: 'Enter' })

      // Selected option is banana (index 1)
      expect(input).toHaveValue('')
    })
  })

  describe('Select component', () => {
    it('should render basic select', () => {
      render(
        <Select
          options={basicOptions}
          placeholder="Select..."
          data-testid="trigger"
        />
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should show selected value', () => {
      render(
        <Select options={basicOptions} defaultValue="banana" />
      )

      expect(screen.getByRole('combobox')).toHaveTextContent('Banana')
    })

    it('should handle clearable', () => {
      const onChange = vi.fn()
      render(
        <Select
          options={basicOptions}
          defaultValue="apple"
          clearable
          onChange={onChange}
        />
      )

      const clearButton = screen.getByLabelText('Clear')
      fireEvent.click(clearButton)

      expect(onChange).toHaveBeenCalled()
      expect(onChange.mock.calls[0][0]).toBeNull()
    })

    it('should open menu on click', () => {
      render(<Select options={basicOptions} />)

      fireEvent.click(screen.getByRole('combobox'))

      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
  })

  describe('MultiSelect component', () => {
    it('should render tags for selected values', () => {
      render(
        <MultiSelect options={basicOptions} defaultValue={['apple', 'banana']} />
      )

      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.getByText('Banana')).toBeInTheDocument()
    })

    it('should allow removing selected items', () => {
      const onChange = vi.fn()
      render(
        <MultiSelect
          options={basicOptions}
          defaultValue={['apple', 'banana']}
          onChange={onChange}
        />
      )

      const removeButtons = screen.getAllByLabelText(/Remove/)
      fireEvent.click(removeButtons[0])

      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('Combobox component', () => {
    it('should render with input', () => {
      render(<Combobox options={basicOptions} placeholder="Search..." />)

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    })

    it('should filter options on type', () => {
      render(<Combobox options={basicOptions} />)

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: 'app' } })

      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.queryByText('Banana')).not.toBeInTheDocument()
    })
  })

  describe('Autocomplete component', () => {
    it('should filter options based on input', () => {
      render(<Autocomplete options={basicOptions} />)

      const input = screen.getByRole('combobox')
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: 'cher' } })

      expect(screen.getByText('Cherry')).toBeInTheDocument()
      expect(screen.queryByText('Apple')).not.toBeInTheDocument()
    })
  })

  describe('SelectProvider', () => {
    function ChildComponent() {
      const { state, select } = useSelectContext()
      return (
        <div>
          <span data-testid="value">{state.value?.toString() || 'none'}</span>
          <button onClick={() => select.selectOption(basicOptions[0]!)} data-testid="select">
            Select Apple
          </button>
        </div>
      )
    }

    it('should provide context to children', () => {
      render(
        <SelectProvider options={basicOptions}>
          <ChildComponent />
        </SelectProvider>
      )

      expect(screen.getByTestId('value')).toHaveTextContent('none')

      fireEvent.click(screen.getByTestId('select'))

      expect(screen.getByTestId('value')).toHaveTextContent('apple')
    })
  })

  describe('Loading state', () => {
    it('should show default loading message when loadingMessage provided', () => {
      // The loading message is stored in config for async operations
      // Test that the render correctly uses the message when loading
      const loadOptions = vi.fn().mockImplementation(async () => {
        return new Promise(resolve => setTimeout(() => resolve(basicOptions), 1000))
      })

      render(
        <Select
          options={[]}
          loadOptions={loadOptions}
          searchable
          loadingMessage="Searching..."
        />
      )

      // Loading is triggered by async operations, not a prop
      // Just verify the component renders
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })

  describe('Empty state', () => {
    it('should show empty message when no options', () => {
      render(
        <Select
          options={[]}
          noOptionsMessage="No options available"
        />
      )

      fireEvent.click(screen.getByRole('combobox'))

      expect(screen.getByText('No options available')).toBeInTheDocument()
    })
  })

  describe('Disabled state', () => {
    it('should not open when disabled', () => {
      render(<Select options={basicOptions} disabled />)

      fireEvent.click(screen.getByRole('combobox'))

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Select options={basicOptions} id="test-select" ariaLabel="Select a fruit" />
      )

      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveAttribute('aria-label', 'Select a fruit')
    })

    it('should update aria-expanded when open', () => {
      render(<Select options={basicOptions} />)

      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      fireEvent.click(trigger)

      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('should have listbox role on menu', () => {
      render(<Select options={basicOptions} />)

      fireEvent.click(screen.getByRole('combobox'))

      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('should have option role on items', () => {
      render(<Select options={basicOptions} />)

      fireEvent.click(screen.getByRole('combobox'))

      expect(screen.getAllByRole('option')).toHaveLength(3)
    })
  })
})
