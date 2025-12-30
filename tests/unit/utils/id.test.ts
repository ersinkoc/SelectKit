import { describe, it, expect, beforeEach } from 'vitest'
import {
  generateId,
  resetIdCounter,
  getOptionId,
  getMenuId,
  getTriggerId,
  getInputId,
  getGroupLabelId,
} from '../../../src/utils/id'

describe('id utilities', () => {
  beforeEach(() => {
    resetIdCounter()
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      const id3 = generateId()

      expect(id1).not.toBe(id2)
      expect(id2).not.toBe(id3)
      expect(id1).not.toBe(id3)
    })

    it('should use default prefix', () => {
      const id = generateId()
      expect(id).toMatch(/^selectkit-\d+$/)
    })

    it('should use custom prefix', () => {
      const id = generateId('custom')
      expect(id).toMatch(/^custom-\d+$/)
    })

    it('should increment counter', () => {
      const id1 = generateId()
      const id2 = generateId()

      const num1 = parseInt(id1.split('-')[1]!, 10)
      const num2 = parseInt(id2.split('-')[1]!, 10)

      expect(num2).toBe(num1 + 1)
    })
  })

  describe('resetIdCounter', () => {
    it('should reset the counter', () => {
      generateId()
      generateId()
      resetIdCounter()

      const id = generateId()
      expect(id).toBe('selectkit-1')
    })
  })

  describe('getOptionId', () => {
    it('should generate option ID', () => {
      const id = getOptionId('base', 0)
      expect(id).toBe('base-option-0')
    })

    it('should handle different indices', () => {
      expect(getOptionId('base', 5)).toBe('base-option-5')
      expect(getOptionId('base', 100)).toBe('base-option-100')
    })
  })

  describe('getMenuId', () => {
    it('should generate menu ID', () => {
      const id = getMenuId('base')
      expect(id).toBe('base-menu')
    })
  })

  describe('getTriggerId', () => {
    it('should generate trigger ID', () => {
      const id = getTriggerId('base')
      expect(id).toBe('base-trigger')
    })
  })

  describe('getInputId', () => {
    it('should generate input ID', () => {
      const id = getInputId('base')
      expect(id).toBe('base-input')
    })
  })

  describe('getGroupLabelId', () => {
    it('should generate group label ID', () => {
      const id = getGroupLabelId('base', 0)
      expect(id).toBe('base-group-0')
    })

    it('should handle different indices', () => {
      expect(getGroupLabelId('base', 3)).toBe('base-group-3')
    })
  })
})
