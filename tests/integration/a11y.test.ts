import { describe, it, expect } from 'vitest'
import { createSelect } from '../../src/core/select'
import { basicOptions, groupedOptions } from '../fixtures/options'

describe('Accessibility Integration', () => {
  describe('container props', () => {
    it('should have data-selectkit attribute', () => {
      const select = createSelect({ options: basicOptions })
      const props = select.getContainerProps()

      expect(props['data-selectkit']).toBe('')
    })

    it('should reflect open state', () => {
      const select = createSelect({ options: basicOptions })

      expect(select.getContainerProps()['data-open']).toBe('false')

      select.open()
      expect(select.getContainerProps()['data-open']).toBe('true')
    })

    it('should reflect disabled state', () => {
      const select = createSelect({ options: basicOptions, disabled: true })
      const props = select.getContainerProps()

      expect(props['data-disabled']).toBe('true')
    })

    it('should reflect multiple state', () => {
      const select = createSelect({ options: basicOptions, multiple: true })
      const props = select.getContainerProps()

      expect(props['data-multiple']).toBe('true')
    })
  })

  describe('trigger props', () => {
    it('should have combobox role', () => {
      const select = createSelect({ options: basicOptions })
      const props = select.getTriggerProps()

      expect(props.role).toBe('combobox')
    })

    it('should have aria-haspopup', () => {
      const select = createSelect({ options: basicOptions })
      const props = select.getTriggerProps()

      expect(props['aria-haspopup']).toBe('listbox')
    })

    it('should have aria-expanded', () => {
      const select = createSelect({ options: basicOptions })

      expect(select.getTriggerProps()['aria-expanded']).toBe(false)

      select.open()
      expect(select.getTriggerProps()['aria-expanded']).toBe(true)
    })

    it('should have aria-controls', () => {
      const select = createSelect({ options: basicOptions, id: 'test' })
      const props = select.getTriggerProps()

      expect(props['aria-controls']).toBe('test-menu')
    })

    it('should have aria-disabled', () => {
      const select = createSelect({ options: basicOptions, disabled: true })
      const props = select.getTriggerProps()

      expect(props['aria-disabled']).toBe(true)
    })

    it('should have aria-required', () => {
      const select = createSelect({ options: basicOptions, required: true })
      const props = select.getTriggerProps()

      expect(props['aria-required']).toBe(true)
    })

    it('should have aria-label when provided', () => {
      const select = createSelect({
        options: basicOptions,
        ariaLabel: 'Select a fruit',
      })
      const props = select.getTriggerProps()

      expect(props['aria-label']).toBe('Select a fruit')
    })

    it('should have tabIndex', () => {
      const select = createSelect({ options: basicOptions })
      const props = select.getTriggerProps()

      expect(props.tabIndex).toBe(0)
    })

    it('should have tabIndex -1 when disabled', () => {
      const select = createSelect({ options: basicOptions, disabled: true })
      const props = select.getTriggerProps()

      expect(props.tabIndex).toBe(-1)
    })
  })

  describe('input props', () => {
    it('should have combobox role', () => {
      const select = createSelect({ options: basicOptions, searchable: true })
      const props = select.getInputProps()

      expect(props.role).toBe('combobox')
    })

    it('should have aria-autocomplete', () => {
      const select = createSelect({ options: basicOptions, searchable: true })
      const props = select.getInputProps()

      expect(props['aria-autocomplete']).toBe('list')
    })

    it('should have aria-activedescendant when highlighted', () => {
      const select = createSelect({ options: basicOptions, id: 'test' })
      select.open()
      select.setHighlightedIndex(2)

      const props = select.getInputProps()

      expect(props['aria-activedescendant']).toBe('test-option-2')
    })

    it('should have autocomplete off', () => {
      const select = createSelect({ options: basicOptions })
      const props = select.getInputProps()

      expect(props.autoComplete).toBe('off')
      expect(props.autoCorrect).toBe('off')
      expect(props.autoCapitalize).toBe('off')
      expect(props.spellCheck).toBe(false)
    })
  })

  describe('menu props', () => {
    it('should have listbox role', () => {
      const select = createSelect({ options: basicOptions })
      const props = select.getMenuProps()

      expect(props.role).toBe('listbox')
    })

    it('should have aria-multiselectable for multiple', () => {
      const select = createSelect({ options: basicOptions, multiple: true })
      const props = select.getMenuProps()

      expect(props['aria-multiselectable']).toBe(true)
    })

    it('should not have aria-multiselectable for single', () => {
      const select = createSelect({ options: basicOptions })
      const props = select.getMenuProps()

      expect(props['aria-multiselectable']).toBeUndefined()
    })

    it('should have tabIndex -1', () => {
      const select = createSelect({ options: basicOptions })
      const props = select.getMenuProps()

      expect(props.tabIndex).toBe(-1)
    })
  })

  describe('option props', () => {
    it('should have option role', () => {
      const select = createSelect({ options: basicOptions })
      const props = select.getOptionProps(basicOptions[0]!, 0)

      expect(props.role).toBe('option')
    })

    it('should have aria-selected', () => {
      const select = createSelect({
        options: basicOptions,
        defaultValue: 'apple',
      })

      const selectedProps = select.getOptionProps(basicOptions[0]!, 0)
      const unselectedProps = select.getOptionProps(basicOptions[1]!, 1)

      expect(selectedProps['aria-selected']).toBe(true)
      expect(unselectedProps['aria-selected']).toBe(false)
    })

    it('should have aria-disabled', () => {
      const disabledOption = { value: 'disabled', label: 'Disabled', disabled: true }
      const select = createSelect({ options: [disabledOption] })

      const props = select.getOptionProps(disabledOption, 0)

      expect(props['aria-disabled']).toBe(true)
    })

    it('should have data-highlighted', () => {
      const select = createSelect({ options: basicOptions })
      select.open()
      select.setHighlightedIndex(1)

      const highlightedProps = select.getOptionProps(basicOptions[1]!, 1)
      const notHighlightedProps = select.getOptionProps(basicOptions[0]!, 0)

      expect(highlightedProps['data-highlighted']).toBe('true')
      expect(notHighlightedProps['data-highlighted']).toBe('false')
    })

    it('should have unique id', () => {
      const select = createSelect({ options: basicOptions, id: 'test' })

      const props0 = select.getOptionProps(basicOptions[0]!, 0)
      const props1 = select.getOptionProps(basicOptions[1]!, 1)

      expect(props0.id).toBe('test-option-0')
      expect(props1.id).toBe('test-option-1')
    })

    it('should have tabIndex -1', () => {
      const select = createSelect({ options: basicOptions })
      const props = select.getOptionProps(basicOptions[0]!, 0)

      expect(props.tabIndex).toBe(-1)
    })
  })

  describe('group props', () => {
    it('should have group role', () => {
      const select = createSelect({ options: groupedOptions })
      const props = select.getGroupProps(groupedOptions[0]!, 0)

      expect(props.role).toBe('group')
    })

    it('should have aria-labelledby', () => {
      const select = createSelect({ options: groupedOptions, id: 'test' })
      const props = select.getGroupProps(groupedOptions[0]!, 0)

      expect(props['aria-labelledby']).toBe('test-group-0')
    })
  })

  describe('group label props', () => {
    it('should have presentation role', () => {
      const select = createSelect({ options: groupedOptions })
      const props = select.getGroupLabelProps(groupedOptions[0]!, 0)

      expect(props.role).toBe('presentation')
    })

    it('should have matching id', () => {
      const select = createSelect({ options: groupedOptions, id: 'test' })
      const props = select.getGroupLabelProps(groupedOptions[0]!, 0)

      expect(props.id).toBe('test-group-0')
    })
  })

  describe('clear button props', () => {
    it('should have button type', () => {
      const select = createSelect({ options: basicOptions })
      const props = select.getClearButtonProps()

      expect(props.type).toBe('button')
    })

    it('should have aria-label', () => {
      const select = createSelect({ options: basicOptions })
      const props = select.getClearButtonProps()

      expect(props['aria-label']).toBe('Clear selection')
    })

    it('should have tabIndex -1', () => {
      const select = createSelect({ options: basicOptions })
      const props = select.getClearButtonProps()

      expect(props.tabIndex).toBe(-1)
    })
  })

  describe('tag props', () => {
    it('should have data-tag attribute', () => {
      const select = createSelect({ options: basicOptions, multiple: true })
      const props = select.getTagProps(basicOptions[0]!, 0)

      expect(props['data-tag']).toBe('')
    })

    it('should have data-value', () => {
      const select = createSelect({ options: basicOptions, multiple: true })
      const props = select.getTagProps(basicOptions[0]!, 0)

      expect(props['data-value']).toBe('apple')
    })

    it('should have data-index', () => {
      const select = createSelect({ options: basicOptions, multiple: true })
      const props = select.getTagProps(basicOptions[0]!, 2)

      expect(props['data-index']).toBe(2)
    })
  })

  describe('tag remove props', () => {
    it('should have button type', () => {
      const select = createSelect({ options: basicOptions, multiple: true })
      const props = select.getTagRemoveProps(basicOptions[0]!)

      expect(props.type).toBe('button')
    })

    it('should have aria-label with option name', () => {
      const select = createSelect({ options: basicOptions, multiple: true })
      const props = select.getTagRemoveProps(basicOptions[0]!)

      expect(props['aria-label']).toBe('Remove Apple')
    })
  })
})
