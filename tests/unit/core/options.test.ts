import { describe, it, expect } from 'vitest'
import {
  normalizeOptions,
  flattenOptions,
  groupOptionsByProperty,
  findOptionByValue,
  findOptionsByValue,
  isOptionSelected,
  addToSelection,
  removeFromSelection,
  toggleSelection,
  getValuesFromOptions,
  areOptionsEqual,
  getOptionIndex,
} from '../../../src/core/options'
import { basicOptions, groupedOptions, optionsWithGroups } from '../../fixtures/options'

describe('options', () => {
  describe('normalizeOptions', () => {
    it('should handle flat options', () => {
      const result = normalizeOptions(basicOptions)

      expect(result.flat).toEqual(basicOptions)
      expect(result.hasGroups).toBe(false)
    })

    it('should handle grouped options', () => {
      const result = normalizeOptions(groupedOptions)

      expect(result.grouped).toEqual(groupedOptions)
      expect(result.hasGroups).toBe(true)
      expect(result.flat).toHaveLength(6)
    })

    it('should handle options with group property', () => {
      const result = normalizeOptions(optionsWithGroups)

      expect(result.flat).toEqual(optionsWithGroups)
      expect(result.hasGroups).toBe(true)
      expect(result.grouped.length).toBeGreaterThan(0)
    })

    it('should handle empty array', () => {
      const result = normalizeOptions([])

      expect(result.flat).toEqual([])
      expect(result.grouped).toEqual([])
      expect(result.hasGroups).toBe(false)
    })
  })

  describe('flattenOptions', () => {
    it('should flatten grouped options', () => {
      const flat = flattenOptions(groupedOptions)

      expect(flat).toHaveLength(6)
      expect(flat[0]?.value).toBe('apple')
      expect(flat[3]?.value).toBe('carrot')
    })

    it('should handle empty groups', () => {
      const flat = flattenOptions([])
      expect(flat).toEqual([])
    })
  })

  describe('groupOptionsByProperty', () => {
    it('should group options by group property', () => {
      const grouped = groupOptionsByProperty(optionsWithGroups)

      expect(grouped.length).toBe(3) // Fruits, Vegetables, ungrouped

      const fruits = grouped.find(g => g.label === 'Fruits')
      expect(fruits?.options).toHaveLength(2)
    })

    it('should handle options without group', () => {
      const grouped = groupOptionsByProperty(optionsWithGroups)
      const ungrouped = grouped.find(g => g.label === '')

      expect(ungrouped?.options).toHaveLength(1)
      expect(ungrouped?.options[0]?.value).toBe('other')
    })
  })

  describe('findOptionByValue', () => {
    it('should find option by value', () => {
      const option = findOptionByValue(basicOptions, 'banana')

      expect(option).toBeDefined()
      expect(option?.label).toBe('Banana')
    })

    it('should return undefined if not found', () => {
      const option = findOptionByValue(basicOptions, 'notexist')

      expect(option).toBeUndefined()
    })
  })

  describe('findOptionsByValue', () => {
    it('should find single option', () => {
      const options = findOptionsByValue(basicOptions, 'apple')

      expect(options).toHaveLength(1)
      expect(options[0]?.value).toBe('apple')
    })

    it('should find multiple options', () => {
      const options = findOptionsByValue(basicOptions, ['apple', 'banana'])

      expect(options).toHaveLength(2)
    })

    it('should return empty array for null', () => {
      const options = findOptionsByValue(basicOptions, null)

      expect(options).toEqual([])
    })

    it('should skip options not found', () => {
      const options = findOptionsByValue(basicOptions, ['apple', 'notexist'])

      expect(options).toHaveLength(1)
    })
  })

  describe('isOptionSelected', () => {
    it('should return true if selected', () => {
      const selected = [basicOptions[0]!]
      expect(isOptionSelected(basicOptions[0]!, selected)).toBe(true)
    })

    it('should return false if not selected', () => {
      const selected = [basicOptions[0]!]
      expect(isOptionSelected(basicOptions[1]!, selected)).toBe(false)
    })
  })

  describe('addToSelection', () => {
    it('should add option to selection', () => {
      const selected = [basicOptions[0]!]
      const result = addToSelection(selected, basicOptions[1]!)

      expect(result).toHaveLength(2)
    })

    it('should not add duplicate', () => {
      const selected = [basicOptions[0]!]
      const result = addToSelection(selected, basicOptions[0]!)

      expect(result).toHaveLength(1)
    })

    it('should respect maxSelected', () => {
      const selected = [basicOptions[0]!, basicOptions[1]!]
      const result = addToSelection(selected, basicOptions[2]!, 2)

      expect(result).toHaveLength(2)
      expect(result).not.toContain(basicOptions[2])
    })
  })

  describe('removeFromSelection', () => {
    it('should remove option from selection', () => {
      const selected = [basicOptions[0]!, basicOptions[1]!]
      const result = removeFromSelection(selected, basicOptions[0]!)

      expect(result).toHaveLength(1)
      expect(result[0]).toBe(basicOptions[1])
    })

    it('should respect minSelected', () => {
      const selected = [basicOptions[0]!]
      const result = removeFromSelection(selected, basicOptions[0]!, 1)

      expect(result).toHaveLength(1)
    })
  })

  describe('toggleSelection', () => {
    it('should add if not selected', () => {
      const selected: typeof basicOptions = []
      const result = toggleSelection(selected, basicOptions[0]!)

      expect(result).toHaveLength(1)
    })

    it('should remove if selected', () => {
      const selected = [basicOptions[0]!]
      const result = toggleSelection(selected, basicOptions[0]!)

      expect(result).toHaveLength(0)
    })

    it('should respect maxSelected when adding', () => {
      const selected = [basicOptions[0]!]
      const result = toggleSelection(selected, basicOptions[1]!, { maxSelected: 1 })

      expect(result).toHaveLength(1)
      expect(result[0]).toBe(basicOptions[0])
    })
  })

  describe('getValuesFromOptions', () => {
    it('should get single value', () => {
      const value = getValuesFromOptions([basicOptions[0]!], false)

      expect(value).toBe('apple')
    })

    it('should get array of values for multiple', () => {
      const values = getValuesFromOptions([basicOptions[0]!, basicOptions[1]!], true)

      expect(values).toEqual(['apple', 'banana'])
    })

    it('should return null for empty single', () => {
      const value = getValuesFromOptions([], false)

      expect(value).toBeNull()
    })

    it('should return empty array for empty multiple', () => {
      const value = getValuesFromOptions([], true)

      expect(value).toEqual([])
    })
  })

  describe('areOptionsEqual', () => {
    it('should return true for same value', () => {
      expect(areOptionsEqual(basicOptions[0]!, basicOptions[0]!)).toBe(true)
    })

    it('should return false for different values', () => {
      expect(areOptionsEqual(basicOptions[0]!, basicOptions[1]!)).toBe(false)
    })
  })

  describe('getOptionIndex', () => {
    it('should return index of option', () => {
      expect(getOptionIndex(basicOptions, basicOptions[2]!)).toBe(2)
    })

    it('should return -1 if not found', () => {
      const notInList = { value: 'notexist', label: 'Not Exist' }
      expect(getOptionIndex(basicOptions, notInList)).toBe(-1)
    })
  })
})
