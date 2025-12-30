import { describe, it, expect } from 'vitest'
import {
  canAddSelection,
  canRemoveSelection,
  getRemainingSelections,
  selectMultiple,
  deselectMultiple,
  selectAll,
  deselectAll,
  toggleSelectAll,
  areAllSelected,
  areSomeSelected,
  getSelectionCountMessage,
} from '../../../src/features/multi'
import { basicOptions, optionsWithDisabled } from '../../fixtures/options'

describe('multi', () => {
  describe('canAddSelection', () => {
    it('should return true when no limit', () => {
      expect(canAddSelection([], undefined)).toBe(true)
      expect(canAddSelection([basicOptions[0]!], undefined)).toBe(true)
    })

    it('should return true when under limit', () => {
      expect(canAddSelection([], 2)).toBe(true)
      expect(canAddSelection([basicOptions[0]!], 2)).toBe(true)
    })

    it('should return false when at limit', () => {
      expect(canAddSelection([basicOptions[0]!, basicOptions[1]!], 2)).toBe(false)
    })
  })

  describe('canRemoveSelection', () => {
    it('should return true when no minimum', () => {
      expect(canRemoveSelection([basicOptions[0]!], undefined)).toBe(true)
    })

    it('should return true when above minimum', () => {
      expect(canRemoveSelection([basicOptions[0]!, basicOptions[1]!], 1)).toBe(true)
    })

    it('should return false when at minimum', () => {
      expect(canRemoveSelection([basicOptions[0]!], 1)).toBe(false)
    })
  })

  describe('getRemainingSelections', () => {
    it('should return Infinity when no limit', () => {
      expect(getRemainingSelections([], undefined)).toBe(Infinity)
    })

    it('should return remaining count', () => {
      expect(getRemainingSelections([], 3)).toBe(3)
      expect(getRemainingSelections([basicOptions[0]!], 3)).toBe(2)
      expect(getRemainingSelections([basicOptions[0]!, basicOptions[1]!], 3)).toBe(1)
    })

    it('should return 0 when at or over limit', () => {
      expect(getRemainingSelections([basicOptions[0]!, basicOptions[1]!], 2)).toBe(0)
    })
  })

  describe('selectMultiple', () => {
    it('should select multiple options', () => {
      const result = selectMultiple([], [basicOptions[0]!, basicOptions[1]!])

      expect(result).toHaveLength(2)
    })

    it('should not exceed maxSelected', () => {
      const result = selectMultiple(
        [],
        [basicOptions[0]!, basicOptions[1]!, basicOptions[2]!],
        { maxSelected: 2 }
      )

      expect(result).toHaveLength(2)
    })

    it('should not add duplicates', () => {
      const result = selectMultiple(
        [basicOptions[0]!],
        [basicOptions[0]!, basicOptions[1]!]
      )

      expect(result).toHaveLength(2)
    })
  })

  describe('deselectMultiple', () => {
    it('should deselect multiple options', () => {
      const selected = [basicOptions[0]!, basicOptions[1]!, basicOptions[2]!]
      const result = deselectMultiple(selected, [basicOptions[0]!, basicOptions[1]!])

      expect(result).toHaveLength(1)
      expect(result[0]).toBe(basicOptions[2])
    })

    it('should respect minSelected', () => {
      const selected = [basicOptions[0]!, basicOptions[1]!]
      const result = deselectMultiple(
        selected,
        [basicOptions[0]!, basicOptions[1]!],
        { minSelected: 1 }
      )

      expect(result).toHaveLength(1)
    })
  })

  describe('selectAll', () => {
    it('should select all options', () => {
      const result = selectAll(basicOptions, [])

      expect(result).toHaveLength(basicOptions.length)
    })

    it('should skip disabled options', () => {
      const result = selectAll(optionsWithDisabled, [])

      // 2 disabled options should be skipped
      expect(result).toHaveLength(optionsWithDisabled.length - 2)
    })

    it('should respect maxSelected', () => {
      const result = selectAll(basicOptions, [], { maxSelected: 2 })

      expect(result).toHaveLength(2)
    })
  })

  describe('deselectAll', () => {
    it('should deselect all options', () => {
      const selected = [basicOptions[0]!, basicOptions[1]!]
      const result = deselectAll(selected)

      expect(result).toEqual([])
    })

    it('should keep minimum required', () => {
      const selected = [basicOptions[0]!, basicOptions[1]!, basicOptions[2]!]
      const result = deselectAll(selected, { minSelected: 2 })

      expect(result).toHaveLength(2)
    })
  })

  describe('toggleSelectAll', () => {
    it('should select all when none selected', () => {
      const result = toggleSelectAll(basicOptions, [])

      expect(result).toHaveLength(basicOptions.length)
    })

    it('should select all when some selected', () => {
      const result = toggleSelectAll(basicOptions, [basicOptions[0]!])

      expect(result).toHaveLength(basicOptions.length)
    })

    it('should deselect all when all selected', () => {
      const result = toggleSelectAll(basicOptions, [...basicOptions])

      expect(result).toHaveLength(0)
    })
  })

  describe('areAllSelected', () => {
    it('should return true when all selected', () => {
      expect(areAllSelected(basicOptions, [...basicOptions])).toBe(true)
    })

    it('should return false when some not selected', () => {
      expect(areAllSelected(basicOptions, [basicOptions[0]!])).toBe(false)
    })

    it('should ignore disabled options', () => {
      const enabledOptions = optionsWithDisabled.filter(o => !o.disabled)
      expect(areAllSelected(optionsWithDisabled, enabledOptions)).toBe(true)
    })

    it('should return false for empty options', () => {
      expect(areAllSelected([], [])).toBe(false)
    })
  })

  describe('areSomeSelected', () => {
    it('should return true when some selected', () => {
      expect(areSomeSelected(basicOptions, [basicOptions[0]!])).toBe(true)
    })

    it('should return false when none selected', () => {
      expect(areSomeSelected(basicOptions, [])).toBe(false)
    })
  })

  describe('getSelectionCountMessage', () => {
    it('should return singular message', () => {
      expect(getSelectionCountMessage([basicOptions[0]!])).toBe('1 item selected')
    })

    it('should return plural message', () => {
      expect(getSelectionCountMessage([basicOptions[0]!, basicOptions[1]!]))
        .toBe('2 items selected')
    })

    it('should return no items message', () => {
      expect(getSelectionCountMessage([])).toBe('No items selected')
    })

    it('should use custom labels', () => {
      expect(getSelectionCountMessage([basicOptions[0]!], { singular: 'tag', plural: 'tags' }))
        .toBe('1 tag selected')
    })
  })
})
