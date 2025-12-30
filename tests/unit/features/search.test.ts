import { describe, it, expect } from 'vitest'
import {
  defaultFilter,
  filterOptions,
  highlightMatch,
  createFuzzyFilter,
  createMultiFieldFilter,
  getMatchScore,
  sortByMatchScore,
} from '../../../src/features/search'
import { basicOptions, optionsWithData } from '../../fixtures/options'

describe('search', () => {
  describe('defaultFilter', () => {
    it('should match case-insensitively', () => {
      expect(defaultFilter(basicOptions[0]!, 'apple')).toBe(true)
      expect(defaultFilter(basicOptions[0]!, 'APPLE')).toBe(true)
      expect(defaultFilter(basicOptions[0]!, 'Apple')).toBe(true)
    })

    it('should match partial strings', () => {
      expect(defaultFilter(basicOptions[0]!, 'app')).toBe(true)
      expect(defaultFilter(basicOptions[0]!, 'ple')).toBe(true)
    })

    it('should return false for no match', () => {
      expect(defaultFilter(basicOptions[0]!, 'xyz')).toBe(false)
    })

    it('should return true for empty search', () => {
      expect(defaultFilter(basicOptions[0]!, '')).toBe(true)
    })
  })

  describe('filterOptions', () => {
    it('should filter options', () => {
      const result = filterOptions(basicOptions, 'a', defaultFilter)

      expect(result.length).toBeGreaterThan(0)
      expect(result.every(opt => opt.label.toLowerCase().includes('a'))).toBe(true)
    })

    it('should return all for empty search', () => {
      const result = filterOptions(basicOptions, '', defaultFilter)

      expect(result).toEqual(basicOptions)
    })

    it('should return empty array for no matches', () => {
      const result = filterOptions(basicOptions, 'xyz', defaultFilter)

      expect(result).toEqual([])
    })
  })

  describe('highlightMatch', () => {
    it('should create segments for matching text', () => {
      const segments = highlightMatch('Apple', 'App')

      expect(segments).toEqual([
        { text: 'App', highlighted: true },
        { text: 'le', highlighted: false },
      ])
    })

    it('should handle match in middle', () => {
      const segments = highlightMatch('Banana', 'nan')

      expect(segments).toEqual([
        { text: 'Ba', highlighted: false },
        { text: 'nan', highlighted: true },
        { text: 'a', highlighted: false },
      ])
    })

    it('should handle no match', () => {
      const segments = highlightMatch('Apple', 'xyz')

      expect(segments).toEqual([
        { text: 'Apple', highlighted: false },
      ])
    })

    it('should handle empty search', () => {
      const segments = highlightMatch('Apple', '')

      expect(segments).toEqual([
        { text: 'Apple', highlighted: false },
      ])
    })

    it('should handle full match', () => {
      const segments = highlightMatch('App', 'App')

      expect(segments).toEqual([
        { text: 'App', highlighted: true },
      ])
    })
  })

  describe('createFuzzyFilter', () => {
    it('should match fuzzy patterns', () => {
      const filter = createFuzzyFilter()

      expect(filter(basicOptions[0]!, 'apl')).toBe(true) // a_p_l_e
      expect(filter(basicOptions[0]!, 'ae')).toBe(true) // a____e
    })

    it('should not match out of order', () => {
      const filter = createFuzzyFilter()

      expect(filter(basicOptions[0]!, 'lpa')).toBe(false)
    })

    it('should use custom text getter', () => {
      const filter = createFuzzyFilter((opt) => opt.data?.email as string ?? opt.label)

      expect(filter(optionsWithData[0]!, 'john@')).toBe(true)
    })
  })

  describe('createMultiFieldFilter', () => {
    it('should search across multiple fields', () => {
      const filter = createMultiFieldFilter([
        (opt) => opt.label,
        (opt) => (opt.data?.email as string) ?? '',
      ])

      // Match by label
      expect(filter(optionsWithData[0]!, 'John')).toBe(true)

      // Match by email
      expect(filter(optionsWithData[0]!, 'john@example')).toBe(true)
    })

    it('should return true if any field matches', () => {
      const filter = createMultiFieldFilter([
        (opt) => opt.label,
        (opt) => (opt.data?.email as string) ?? '',
      ])

      expect(filter(optionsWithData[0]!, 'Doe')).toBe(true)
    })

    it('should return false if no field matches', () => {
      const filter = createMultiFieldFilter([
        (opt) => opt.label,
      ])

      expect(filter(optionsWithData[0]!, 'xyz')).toBe(false)
    })
  })

  describe('getMatchScore', () => {
    it('should return 100 for exact match', () => {
      expect(getMatchScore({ value: 'a', label: 'apple' }, 'apple')).toBe(100)
    })

    it('should return 75 for starts with', () => {
      expect(getMatchScore({ value: 'a', label: 'apple' }, 'app')).toBe(75)
    })

    it('should return 50 for word starts with', () => {
      expect(getMatchScore({ value: 'a', label: 'red apple' }, 'app')).toBe(50)
    })

    it('should return 25 for contains', () => {
      expect(getMatchScore({ value: 'a', label: 'apple' }, 'ppl')).toBe(25)
    })

    it('should return 0 for no match', () => {
      expect(getMatchScore({ value: 'a', label: 'apple' }, 'xyz')).toBe(0)
    })

    it('should return 0 for empty search', () => {
      expect(getMatchScore({ value: 'a', label: 'apple' }, '')).toBe(0)
    })
  })

  describe('sortByMatchScore', () => {
    it('should sort by match score descending', () => {
      const options = [
        { value: 1, label: 'red apple' },
        { value: 2, label: 'apple' },
        { value: 3, label: 'applesauce' },
        { value: 4, label: 'pineapple' },
      ]

      const sorted = sortByMatchScore(options, 'apple')

      expect(sorted[0]?.label).toBe('apple') // Exact match
      expect(sorted[1]?.label).toBe('applesauce') // Starts with
    })

    it('should return original order for empty search', () => {
      const sorted = sortByMatchScore(basicOptions, '')

      expect(sorted).toEqual(basicOptions)
    })
  })
})
