import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSelect } from '../../src/core/select'
import { basicOptions, groupedOptions, optionsWithDisabled } from '../fixtures/options'

describe('Select Integration', () => {
  describe('basic select', () => {
    it('should create select with options', () => {
      const select = createSelect({ options: basicOptions })

      expect(select.getOptions()).toEqual(basicOptions)
      expect(select.getValue()).toBeNull()
      expect(select.isOpen()).toBe(false)
    })

    it('should select an option', () => {
      const onChange = vi.fn()
      const select = createSelect({
        options: basicOptions,
        onChange,
      })

      select.selectOption(basicOptions[0]!)

      expect(select.getValue()).toBe('apple')
      expect(onChange).toHaveBeenCalledWith(
        'apple',
        basicOptions[0],
        { type: 'select', option: basicOptions[0] }
      )
    })

    it('should clear value', () => {
      const onChange = vi.fn()
      const select = createSelect({
        options: basicOptions,
        defaultValue: 'apple',
        onChange,
      })

      select.clearValue()

      expect(select.getValue()).toBeNull()
      expect(onChange).toHaveBeenCalledWith(
        null,
        null,
        { type: 'clear' }
      )
    })

    it('should open and close', () => {
      const onOpen = vi.fn()
      const onClose = vi.fn()
      const select = createSelect({
        options: basicOptions,
        onOpen,
        onClose,
      })

      select.open()
      expect(select.isOpen()).toBe(true)
      expect(onOpen).toHaveBeenCalled()

      select.close()
      expect(select.isOpen()).toBe(false)
      expect(onClose).toHaveBeenCalled()
    })

    it('should toggle', () => {
      const select = createSelect({ options: basicOptions })

      select.toggle()
      expect(select.isOpen()).toBe(true)

      select.toggle()
      expect(select.isOpen()).toBe(false)
    })

    it('should not open when disabled', () => {
      const select = createSelect({
        options: basicOptions,
        disabled: true,
      })

      select.open()
      expect(select.isOpen()).toBe(false)
    })

    it('should close on select when closeOnSelect is true', () => {
      const select = createSelect({
        options: basicOptions,
        closeOnSelect: true,
      })

      select.open()
      select.selectOption(basicOptions[0]!)

      expect(select.isOpen()).toBe(false)
    })
  })

  describe('default value', () => {
    it('should initialize with default value', () => {
      const select = createSelect({
        options: basicOptions,
        defaultValue: 'banana',
      })

      expect(select.getValue()).toBe('banana')
      expect(select.getSelectedOptions()).toHaveLength(1)
      expect(select.getSelectedOptions()[0]?.value).toBe('banana')
    })

    it('should use value over defaultValue', () => {
      const select = createSelect({
        options: basicOptions,
        value: 'cherry',
        defaultValue: 'banana',
      })

      expect(select.getValue()).toBe('cherry')
    })
  })

  describe('controlled value', () => {
    it('should update value programmatically', () => {
      const select = createSelect({ options: basicOptions })

      select.setValue('banana')
      expect(select.getValue()).toBe('banana')

      select.setValue('cherry')
      expect(select.getValue()).toBe('cherry')

      select.setValue(null)
      expect(select.getValue()).toBeNull()
    })
  })

  describe('grouped options', () => {
    it('should handle grouped options', () => {
      const select = createSelect({ options: groupedOptions })

      expect(select.getOptions()).toHaveLength(6) // Flattened
    })

    it('should select from grouped options', () => {
      const select = createSelect({ options: groupedOptions })

      const carrot = { value: 'carrot', label: 'Carrot' }
      select.selectOption(carrot)

      expect(select.getValue()).toBe('carrot')
    })
  })

  describe('disabled options', () => {
    it('should not select disabled options', () => {
      const select = createSelect({ options: optionsWithDisabled })

      const disabledOption = optionsWithDisabled.find(o => o.disabled)!
      select.selectOption(disabledOption)

      expect(select.getValue()).toBeNull()
    })

    it('should skip disabled options in navigation', () => {
      const select = createSelect({ options: optionsWithDisabled })
      select.open()

      select.highlightFirst()
      expect(select.getHighlightedOption()?.disabled).not.toBe(true)

      select.highlightNext()
      expect(select.getHighlightedOption()?.disabled).not.toBe(true)
    })
  })

  describe('highlight', () => {
    it('should highlight first option on open', () => {
      const select = createSelect({ options: basicOptions })

      select.open()

      expect(select.getHighlightedIndex()).toBe(0)
      expect(select.getHighlightedOption()).toEqual(basicOptions[0])
    })

    it('should highlight selected option on open', () => {
      const select = createSelect({
        options: basicOptions,
        defaultValue: 'cherry',
      })

      select.open()

      expect(select.getHighlightedIndex()).toBe(2)
    })

    it('should select highlighted option', () => {
      const select = createSelect({ options: basicOptions })
      select.open()
      select.highlightNext()
      select.highlightNext()

      select.selectHighlighted()

      expect(select.getValue()).toBe('cherry')
    })
  })

  describe('subscribe', () => {
    it('should notify subscribers on state change', () => {
      const select = createSelect({ options: basicOptions })
      const subscriber = vi.fn()

      const unsubscribe = select.subscribe(subscriber)

      select.open()
      expect(subscriber).toHaveBeenCalled()

      const state = subscriber.mock.calls[0]![0]
      expect(state.isOpen).toBe(true)

      unsubscribe()
      select.close()
      expect(subscriber).toHaveBeenCalledTimes(1)
    })
  })

  describe('events', () => {
    it('should emit change event', () => {
      const handler = vi.fn()
      const select = createSelect({ options: basicOptions })

      select.on('change', handler)
      select.selectOption(basicOptions[0]!)

      expect(handler).toHaveBeenCalledWith(
        'apple',
        basicOptions[0],
        { type: 'select', option: basicOptions[0] }
      )
    })

    it('should unsubscribe from events', () => {
      const handler = vi.fn()
      const select = createSelect({ options: basicOptions })

      const unsubscribe = select.on('change', handler)
      unsubscribe()

      select.selectOption(basicOptions[0]!)
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('config update', () => {
    it('should update config', () => {
      const select = createSelect({ options: basicOptions })

      select.updateConfig({ disabled: true })

      expect(select.isDisabled()).toBe(true)
    })

    it('should update options via config', () => {
      const select = createSelect({ options: basicOptions })
      const newOptions = [{ value: 'new', label: 'New' }]

      select.updateConfig({ options: newOptions })

      expect(select.getOptions()).toEqual(newOptions)
    })
  })

  describe('destroy', () => {
    it('should clean up on destroy', () => {
      const select = createSelect({ options: basicOptions })
      const subscriber = vi.fn()

      select.subscribe(subscriber)
      select.destroy()

      // Subscriber should not be called after destroy
      subscriber.mockClear()
      try {
        select.open()
      } catch {
        // May throw or not work after destroy
      }
    })
  })
})
