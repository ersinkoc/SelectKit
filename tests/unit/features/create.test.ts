import { describe, it, expect, vi } from 'vitest'
import {
  shouldShowCreate,
  getCreateMessage,
  createNewOption,
  createSimpleOption,
  createOptionWithId,
  validateCreateValue,
  validators,
} from '../../../src/features/create'
import { basicOptions } from '../../fixtures/options'

describe('create', () => {
  describe('shouldShowCreate', () => {
    it('should return false for empty search', () => {
      expect(shouldShowCreate('', basicOptions, { onCreate: () => null })).toBe(false)
      expect(shouldShowCreate('  ', basicOptions, { onCreate: () => null })).toBe(false)
    })

    it('should return false without onCreate handler', () => {
      expect(shouldShowCreate('new', basicOptions, {})).toBe(false)
    })

    it('should return false if option exists', () => {
      expect(shouldShowCreate('apple', basicOptions, { onCreate: () => null })).toBe(false)
      expect(shouldShowCreate('Apple', basicOptions, { onCreate: () => null })).toBe(false)
    })

    it('should return true for new value', () => {
      expect(shouldShowCreate('newvalue', basicOptions, { onCreate: () => null })).toBe(true)
    })

    it('should allow duplicates when configured', () => {
      expect(shouldShowCreate(
        'apple',
        basicOptions,
        { onCreate: () => null, allowDuplicates: true }
      )).toBe(true)
    })
  })

  describe('getCreateMessage', () => {
    it('should return default message', () => {
      expect(getCreateMessage('test', {})).toBe('Create "test"')
    })

    it('should return custom string message', () => {
      expect(getCreateMessage('test', { createMessage: 'Add new: test' }))
        .toBe('Add new: test')
    })

    it('should call function message', () => {
      const fn = vi.fn((v: string) => `New: ${v}`)
      expect(getCreateMessage('test', { createMessage: fn })).toBe('New: test')
      expect(fn).toHaveBeenCalledWith('test')
    })
  })

  describe('createNewOption', () => {
    it('should create option from sync handler', async () => {
      const onCreate = vi.fn(() => ({ value: 'new', label: 'New' }))
      const result = await createNewOption('test', { onCreate })

      expect(result).toEqual({ value: 'new', label: 'New' })
      expect(onCreate).toHaveBeenCalledWith('test')
    })

    it('should create option from async handler', async () => {
      const onCreate = vi.fn(async () => ({ value: 'new', label: 'New' }))
      const result = await createNewOption('test', { onCreate })

      expect(result).toEqual({ value: 'new', label: 'New' })
    })

    it('should return null when handler returns null', async () => {
      const onCreate = vi.fn(() => null)
      const result = await createNewOption('test', { onCreate })

      expect(result).toBeNull()
    })

    it('should return null when handler throws', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const onCreate = vi.fn(() => {
        throw new Error('fail')
      })
      const result = await createNewOption('test', { onCreate })

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should return null without onCreate', async () => {
      const result = await createNewOption('test', {})
      expect(result).toBeNull()
    })
  })

  describe('createSimpleOption', () => {
    it('should create option from string', () => {
      const option = createSimpleOption('test')

      expect(option).toEqual({ value: 'test', label: 'test' })
    })
  })

  describe('createOptionWithId', () => {
    it('should create option with generated ID', () => {
      const option = createOptionWithId('Test Label')

      expect(option.label).toBe('Test Label')
      expect(typeof option.value).toBe('string')
      expect((option.value as string).startsWith('created-')).toBe(true)
    })

    it('should use custom prefix', () => {
      const option = createOptionWithId('Test', 'custom')

      expect((option.value as string).startsWith('custom-')).toBe(true)
    })
  })

  describe('validateCreateValue', () => {
    it('should return valid for passing validators', () => {
      const result = validateCreateValue('test', [
        validators.minLength(2),
        validators.maxLength(10),
      ])

      expect(result).toEqual({ valid: true })
    })

    it('should return first failure', () => {
      const result = validateCreateValue('a', [
        validators.minLength(2),
        validators.maxLength(10),
      ])

      expect(result.valid).toBe(false)
      expect((result as { valid: false; message: string }).message).toBe('Must be at least 2 characters')
    })
  })

  describe('validators', () => {
    describe('minLength', () => {
      const validator = validators.minLength(3)

      it('should pass for valid length', () => {
        expect(validator('abc').valid).toBe(true)
        expect(validator('abcd').valid).toBe(true)
      })

      it('should fail for short string', () => {
        expect(validator('ab').valid).toBe(false)
      })
    })

    describe('maxLength', () => {
      const validator = validators.maxLength(5)

      it('should pass for valid length', () => {
        expect(validator('abc').valid).toBe(true)
        expect(validator('abcde').valid).toBe(true)
      })

      it('should fail for long string', () => {
        expect(validator('abcdef').valid).toBe(false)
      })
    })

    describe('pattern', () => {
      const validator = validators.pattern(/^[a-z]+$/, 'Lowercase only')

      it('should pass for matching pattern', () => {
        expect(validator('abc').valid).toBe(true)
      })

      it('should fail for non-matching pattern', () => {
        const result = validator('ABC')
        expect(result.valid).toBe(false)
        expect((result as { valid: false; message: string }).message).toBe('Lowercase only')
      })
    })

    describe('noWhitespace', () => {
      it('should pass for no whitespace', () => {
        expect(validators.noWhitespace('abc').valid).toBe(true)
      })

      it('should fail for whitespace', () => {
        expect(validators.noWhitespace('a b c').valid).toBe(false)
      })
    })

    describe('trimmed', () => {
      it('should pass for trimmed string', () => {
        expect(validators.trimmed('abc').valid).toBe(true)
      })

      it('should fail for untrimmed string', () => {
        expect(validators.trimmed(' abc').valid).toBe(false)
        expect(validators.trimmed('abc ').valid).toBe(false)
      })
    })

    describe('email', () => {
      it('should pass for valid email', () => {
        expect(validators.email('test@example.com').valid).toBe(true)
      })

      it('should fail for invalid email', () => {
        expect(validators.email('invalid').valid).toBe(false)
        expect(validators.email('test@').valid).toBe(false)
      })
    })
  })
})
