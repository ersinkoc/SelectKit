import { describe, it, expect, vi } from 'vitest'
import { createSelect } from '../../src/core/select'
import { handleKeyDown, handleTab, defaultKeyBindings } from '../../src/features/keyboard'
import { basicOptions, groupedOptions, disabledOptions } from '../fixtures/options'

describe('Keyboard Integration', () => {
  describe('opening and closing', () => {
    it('should open on Enter key when closed', () => {
      const select = createSelect({ options: basicOptions })

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      const prevented = handleKeyDown(select, event)

      expect(prevented).toBe(true)
      expect(select.getState().isOpen).toBe(true)
    })

    it('should open on Space key when closed', () => {
      const select = createSelect({ options: basicOptions })

      const event = new KeyboardEvent('keydown', { key: ' ' })
      const prevented = handleKeyDown(select, event)

      expect(prevented).toBe(true)
      expect(select.getState().isOpen).toBe(true)
    })

    it('should open on ArrowDown key when closed', () => {
      const select = createSelect({ options: basicOptions })

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      const prevented = handleKeyDown(select, event)

      expect(prevented).toBe(true)
      expect(select.getState().isOpen).toBe(true)
    })

    it('should open on ArrowUp key when closed', () => {
      const select = createSelect({ options: basicOptions })

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      const prevented = handleKeyDown(select, event)

      expect(prevented).toBe(true)
      expect(select.getState().isOpen).toBe(true)
    })

    it('should close on Escape key', () => {
      const select = createSelect({ options: basicOptions })
      select.open()

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      const prevented = handleKeyDown(select, event)

      expect(prevented).toBe(true)
      expect(select.getState().isOpen).toBe(false)
    })

    it('should close on Tab key using handleTab', () => {
      const select = createSelect({ options: basicOptions })
      select.open()

      const event = new KeyboardEvent('keydown', { key: 'Tab' })
      const prevented = handleTab(select, event)

      // handleTab returns false to allow normal tab behavior
      expect(prevented).toBe(false)
      expect(select.getState().isOpen).toBe(false)
    })
  })

  describe('navigation', () => {
    it('should navigate down with ArrowDown', () => {
      const select = createSelect({ options: basicOptions })
      select.open()
      select.setHighlightedIndex(0)

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      handleKeyDown(select, event)

      expect(select.getState().highlightedIndex).toBe(1)
    })

    it('should navigate up with ArrowUp', () => {
      const select = createSelect({ options: basicOptions })
      select.open()
      select.setHighlightedIndex(2)

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      handleKeyDown(select, event)

      expect(select.getState().highlightedIndex).toBe(1)
    })

    it('should wrap around when navigating past end', () => {
      const select = createSelect({ options: basicOptions })
      select.open()
      select.setHighlightedIndex(basicOptions.length - 1)

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      handleKeyDown(select, event)

      expect(select.getState().highlightedIndex).toBe(0)
    })

    it('should wrap around when navigating past beginning', () => {
      const select = createSelect({ options: basicOptions })
      select.open()
      select.setHighlightedIndex(0)

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      handleKeyDown(select, event)

      expect(select.getState().highlightedIndex).toBe(basicOptions.length - 1)
    })

    it('should go to first option with Home', () => {
      const select = createSelect({ options: basicOptions })
      select.open()
      select.setHighlightedIndex(3)

      const event = new KeyboardEvent('keydown', { key: 'Home' })
      handleKeyDown(select, event)

      expect(select.getState().highlightedIndex).toBe(0)
    })

    it('should go to last option with End', () => {
      const select = createSelect({ options: basicOptions })
      select.open()
      select.setHighlightedIndex(0)

      const event = new KeyboardEvent('keydown', { key: 'End' })
      handleKeyDown(select, event)

      expect(select.getState().highlightedIndex).toBe(basicOptions.length - 1)
    })

    it('should navigate by page with PageDown', () => {
      const select = createSelect({ options: basicOptions })
      select.open()
      select.setHighlightedIndex(0)

      const event = new KeyboardEvent('keydown', { key: 'PageDown' })
      handleKeyDown(select, event)

      // PageDown should move by 10 or to the end
      const expectedIndex = Math.min(10, basicOptions.length - 1)
      expect(select.getState().highlightedIndex).toBe(expectedIndex)
    })

    it('should navigate by page with PageUp', () => {
      const select = createSelect({ options: basicOptions })
      select.open()
      select.setHighlightedIndex(basicOptions.length - 1)

      const event = new KeyboardEvent('keydown', { key: 'PageUp' })
      handleKeyDown(select, event)

      // PageUp should move by 10 or to the beginning
      const expectedIndex = Math.max(basicOptions.length - 1 - 10, 0)
      expect(select.getState().highlightedIndex).toBe(expectedIndex)
    })
  })

  describe('selection', () => {
    it('should select highlighted option on Enter', () => {
      const select = createSelect({ options: basicOptions })
      select.open()
      select.setHighlightedIndex(1)

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      handleKeyDown(select, event)

      expect(select.getState().value).toBe('banana')
      expect(select.getState().isOpen).toBe(false)
    })

    it('should select highlighted option on Space when not searchable', () => {
      const select = createSelect({ options: basicOptions, searchable: false })
      select.open()
      select.setHighlightedIndex(2)

      const event = new KeyboardEvent('keydown', { key: ' ' })
      handleKeyDown(select, event)

      expect(select.getState().value).toBe('cherry')
      expect(select.getState().isOpen).toBe(false)
    })

    it('should toggle selection in multiple mode', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        defaultValue: ['apple'],
      })
      select.open()
      select.setHighlightedIndex(0)

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      handleKeyDown(select, event)

      // Should deselect apple
      expect(select.getState().value).toEqual([])
    })

    it('should keep menu open in multiple mode after selection', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        closeOnSelect: false,
      })
      select.open()
      select.setHighlightedIndex(0)

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      handleKeyDown(select, event)

      expect(select.getState().isOpen).toBe(true)
    })
  })

  describe('clearing', () => {
    it('should remove last tag on Backspace in multiple mode with empty search', () => {
      const select = createSelect({
        options: basicOptions,
        multiple: true,
        defaultValue: ['apple', 'banana'],
      })
      select.open()

      const event = new KeyboardEvent('keydown', { key: 'Backspace' })
      handleKeyDown(select, event)

      expect(select.getState().value).toEqual(['apple'])
    })

    it('should clear value on Delete when clearable', () => {
      const select = createSelect({
        options: basicOptions,
        clearable: true,
        defaultValue: 'apple',
      })

      const event = new KeyboardEvent('keydown', { key: 'Delete' })
      handleKeyDown(select, event)

      expect(select.getState().value).toBeNull()
    })

    it('should not clear when not clearable', () => {
      const select = createSelect({
        options: basicOptions,
        clearable: false,
        defaultValue: 'apple',
      })

      const event = new KeyboardEvent('keydown', { key: 'Delete' })
      handleKeyDown(select, event)

      expect(select.getState().value).toBe('apple')
    })
  })

  describe('disabled state', () => {
    it('should not handle keys when disabled', () => {
      const select = createSelect({
        options: basicOptions,
        disabled: true,
      })

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      const prevented = handleKeyDown(select, event)

      expect(prevented).toBe(false)
      expect(select.getState().isOpen).toBe(false)
    })
  })

  describe('searchable mode', () => {
    it('should allow typing space in searchable mode when open', () => {
      const select = createSelect({
        options: basicOptions,
        searchable: true,
      })
      select.open()

      const event = new KeyboardEvent('keydown', { key: ' ' })
      const prevented = handleKeyDown(select, event)

      // Space should not be prevented in searchable mode (allow typing)
      expect(prevented).toBe(false)
    })

    it('should handle navigation in searchable mode', () => {
      const select = createSelect({
        options: basicOptions,
        searchable: true,
      })
      select.open()
      select.setHighlightedIndex(0)

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      handleKeyDown(select, event)

      expect(select.getState().highlightedIndex).toBe(1)
    })

    it('should clear search on Escape before closing', () => {
      const select = createSelect({
        options: basicOptions,
        searchable: true,
      })
      select.open()
      select.setSearchValue('test')

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      handleKeyDown(select, event)

      // First Escape clears search
      expect(select.getState().searchValue).toBe('')
      expect(select.getState().isOpen).toBe(true)

      // Second Escape closes
      handleKeyDown(select, event)
      expect(select.getState().isOpen).toBe(false)
    })

    it('should open and start typing on character key when closed', () => {
      const select = createSelect({
        options: basicOptions,
        searchable: true,
      })

      const event = new KeyboardEvent('keydown', { key: 'a' })
      const prevented = handleKeyDown(select, event)

      expect(prevented).toBe(true)
      expect(select.getState().isOpen).toBe(true)
      expect(select.getState().searchValue).toBe('a')
    })
  })

  describe('composing state', () => {
    it('should not handle keys during IME composition', () => {
      const select = createSelect({ options: basicOptions })
      // Simulate composing state
      select.setComposing(true)

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      const prevented = handleKeyDown(select, event)

      expect(prevented).toBe(false)
      expect(select.getState().isOpen).toBe(false)
    })
  })

  describe('create option', () => {
    it('should create option on Enter when creatable and no match', async () => {
      const onCreate = vi.fn(async (input: string) => ({ value: input, label: input }))
      const select = createSelect({
        options: basicOptions,
        creatable: true,
        searchable: true,
        onCreate,
      })
      select.open()
      select.setSearchValue('newitem')
      select.setHighlightedIndex(-1) // No option highlighted

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      handleKeyDown(select, event)

      // Wait for async onCreate to be called
      await vi.waitFor(() => {
        expect(onCreate).toHaveBeenCalledWith('newitem')
      })
    })
  })

  describe('type-ahead in non-searchable mode', () => {
    it('should not type-ahead in non-searchable mode', () => {
      const select = createSelect({
        options: basicOptions,
        searchable: false,
      })

      const event = new KeyboardEvent('keydown', { key: 'b' })
      const prevented = handleKeyDown(select, event)

      // Should not handle character input in non-searchable mode when closed
      expect(prevented).toBe(false)
    })
  })
})
