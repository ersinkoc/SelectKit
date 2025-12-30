import { describe, it, expect, vi } from 'vitest'
import { createSelect } from '../../src/core/select'
import { basicOptions } from '../fixtures/options'

describe('Multi-Select Integration', () => {
  describe('basic multi-select', () => {
    it('should select multiple options', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
      })

      select.selectOption(basicOptions[0]!)
      select.selectOption(basicOptions[1]!)

      const value = select.getValue() as string[]
      expect(value).toEqual(['apple', 'banana'])
      expect(select.getSelectedOptions()).toHaveLength(2)
    })

    it('should toggle selection', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
      })

      select.toggleOption(basicOptions[0]!)
      expect(select.isSelected(basicOptions[0]!)).toBe(true)

      select.toggleOption(basicOptions[0]!)
      expect(select.isSelected(basicOptions[0]!)).toBe(false)
    })

    it('should deselect option', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        defaultValue: ['apple', 'banana'],
      })

      select.deselectOption(basicOptions[0]!)

      const value = select.getValue() as string[]
      expect(value).toEqual(['banana'])
    })

    it('should clear all selections', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        defaultValue: ['apple', 'banana', 'cherry'],
      })

      select.clearValue()

      expect(select.getValue()).toEqual([])
      expect(select.getSelectedOptions()).toHaveLength(0)
    })
  })

  describe('default value', () => {
    it('should initialize with multiple default values', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        defaultValue: ['apple', 'cherry'],
      })

      const value = select.getValue() as string[]
      expect(value).toEqual(['apple', 'cherry'])
      expect(select.getSelectedOptions()).toHaveLength(2)
    })
  })

  describe('maxSelected', () => {
    it('should respect maxSelected limit', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        maxSelected: 2,
      })

      select.selectOption(basicOptions[0]!)
      select.selectOption(basicOptions[1]!)
      select.selectOption(basicOptions[2]!) // Should not add

      const value = select.getValue() as string[]
      expect(value).toHaveLength(2)
      expect(value).not.toContain('cherry')
    })
  })

  describe('minSelected', () => {
    it('should respect minSelected limit', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        defaultValue: ['apple', 'banana'],
        minSelected: 1,
      })

      select.deselectOption(basicOptions[0]!)
      select.deselectOption(basicOptions[1]!) // Should not remove

      const value = select.getValue() as string[]
      expect(value).toHaveLength(1)
    })
  })

  describe('closeOnSelect', () => {
    it('should stay open after selection by default', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
      })

      select.open()
      select.selectOption(basicOptions[0]!)

      expect(select.isOpen()).toBe(true)
    })

    it('should close on select when configured', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        closeOnSelect: true,
      })

      select.open()
      select.selectOption(basicOptions[0]!)

      expect(select.isOpen()).toBe(false)
    })
  })

  describe('onChange', () => {
    it('should emit with array values', () => {
      const onChange = vi.fn()
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        onChange,
      })

      select.selectOption(basicOptions[0]!)

      expect(onChange).toHaveBeenCalledWith(
        ['apple'],
        [basicOptions[0]],
        { type: 'select', option: basicOptions[0] }
      )
    })

    it('should emit on deselect', () => {
      const onChange = vi.fn()
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        defaultValue: ['apple', 'banana'],
        onChange,
      })

      select.deselectOption(basicOptions[0]!)

      expect(onChange).toHaveBeenCalledWith(
        ['banana'],
        [basicOptions[1]],
        { type: 'deselect', option: basicOptions[0] }
      )
    })
  })

  describe('isSelected', () => {
    it('should check if option is selected', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        defaultValue: ['apple'],
      })

      expect(select.isSelected(basicOptions[0]!)).toBe(true)
      expect(select.isSelected(basicOptions[1]!)).toBe(false)
    })
  })

  describe('getSelectedOptions', () => {
    it('should return all selected options', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        defaultValue: ['apple', 'cherry'],
      })

      const selected = select.getSelectedOptions()

      expect(selected).toHaveLength(2)
      expect(selected[0]?.value).toBe('apple')
      expect(selected[1]?.value).toBe('cherry')
    })
  })

  describe('programmatic value', () => {
    it('should set multiple values', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
      })

      select.setValue(['banana', 'date'])

      const value = select.getValue() as string[]
      expect(value).toEqual(['banana', 'date'])
    })

    it('should handle invalid values gracefully', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
      })

      select.setValue(['apple', 'nonexistent'])

      const value = select.getValue() as string[]
      expect(value).toEqual(['apple', 'nonexistent'])
      // Only apple should be in selectedOptions
      expect(select.getSelectedOptions()).toHaveLength(1)
    })
  })

  describe('highlight with multi-select', () => {
    it('should show selected state in highlight', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        defaultValue: ['banana'],
      })

      select.open()
      select.setHighlightedIndex(1) // banana

      const highlighted = select.getHighlightedOption()
      expect(highlighted?.value).toBe('banana')
      expect(select.isSelected(highlighted!)).toBe(true)
    })
  })
})
