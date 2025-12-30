import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  handleKeyDown,
  handleTab,
  createKeyBindings,
  mergeKeyBindings,
  defaultKeyBindings,
} from '../../../src/features/keyboard'
import { createSelect } from '../../../src/core/select'
import { basicOptions } from '../../fixtures/options'

describe('keyboard', () => {
  describe('handleKeyDown', () => {
    let select: ReturnType<typeof createSelect>

    beforeEach(() => {
      select = createSelect({ options: basicOptions })
    })

    it('should open menu on ArrowDown when closed', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      vi.spyOn(event, 'preventDefault')

      handleKeyDown(select, event)

      expect(select.isOpen()).toBe(true)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('should open menu on Enter when closed', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      vi.spyOn(event, 'preventDefault')

      handleKeyDown(select, event)

      expect(select.isOpen()).toBe(true)
    })

    it('should open menu on Space when closed', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' })
      vi.spyOn(event, 'preventDefault')

      handleKeyDown(select, event)

      expect(select.isOpen()).toBe(true)
    })

    it('should highlight next on ArrowDown when open', () => {
      select.open()
      select.setHighlightedIndex(0)

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      handleKeyDown(select, event)

      expect(select.getHighlightedIndex()).toBe(1)
    })

    it('should highlight previous on ArrowUp when open', () => {
      select.open()
      select.setHighlightedIndex(2)

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      handleKeyDown(select, event)

      expect(select.getHighlightedIndex()).toBe(1)
    })

    it('should highlight first on Home', () => {
      select.open()
      select.setHighlightedIndex(3)

      const event = new KeyboardEvent('keydown', { key: 'Home' })
      handleKeyDown(select, event)

      expect(select.getHighlightedIndex()).toBe(0)
    })

    it('should highlight last on End', () => {
      select.open()
      select.setHighlightedIndex(0)

      const event = new KeyboardEvent('keydown', { key: 'End' })
      handleKeyDown(select, event)

      expect(select.getHighlightedIndex()).toBe(basicOptions.length - 1)
    })

    it('should page down on PageDown', () => {
      select.open()
      select.setHighlightedIndex(0)

      const event = new KeyboardEvent('keydown', { key: 'PageDown' })
      handleKeyDown(select, event)

      // With small list, should go to end
      expect(select.getHighlightedIndex()).toBe(basicOptions.length - 1)
    })

    it('should page up on PageUp', () => {
      select.open()
      select.setHighlightedIndex(4)

      const event = new KeyboardEvent('keydown', { key: 'PageUp' })
      handleKeyDown(select, event)

      expect(select.getHighlightedIndex()).toBe(0)
    })

    it('should select highlighted on Enter', () => {
      select.open()
      select.setHighlightedIndex(1)

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      handleKeyDown(select, event)

      expect(select.getValue()).toBe('banana')
    })

    it('should close on Escape', () => {
      select.open()

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      handleKeyDown(select, event)

      expect(select.isOpen()).toBe(false)
    })

    it('should clear search before closing on Escape', () => {
      select = createSelect({ options: basicOptions, searchable: true })
      select.open()
      select.setSearchValue('test')

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      handleKeyDown(select, event)

      expect(select.getSearchValue()).toBe('')
      expect(select.isOpen()).toBe(true) // Still open, cleared search

      // Escape again closes
      handleKeyDown(select, event)
      expect(select.isOpen()).toBe(false)
    })

    it('should remove last tag on Backspace in multi-select', () => {
      select = createSelect({
        options: basicOptions,
        multiple: true,
        defaultValue: ['apple', 'banana'],
      })
      select.open()

      const event = new KeyboardEvent('keydown', { key: 'Backspace' })
      handleKeyDown(select, event)

      const value = select.getValue() as string[]
      expect(value).toEqual(['apple'])
    })

    it('should not handle when composing', () => {
      select.open()
      // Simulate composing state
      ;(select.getState() as any).isComposing = true
      select['stateManager'].setState({ isComposing: true })

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      const handled = handleKeyDown(select, event)

      expect(handled).toBe(false)
    })

    it('should not handle when disabled', () => {
      select.setDisabled(true)

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      const handled = handleKeyDown(select, event)

      expect(handled).toBe(false)
    })

    it('should not prevent space in searchable mode when open', () => {
      select = createSelect({ options: basicOptions, searchable: true })
      select.open()

      const event = new KeyboardEvent('keydown', { key: ' ' })
      const handled = handleKeyDown(select, event)

      expect(handled).toBe(false) // Let space be typed
    })

    it('should open and start searching on character input', () => {
      select = createSelect({ options: basicOptions, searchable: true })

      const event = new KeyboardEvent('keydown', { key: 'a' })
      vi.spyOn(event, 'preventDefault')

      handleKeyDown(select, event)

      expect(select.isOpen()).toBe(true)
      expect(select.getSearchValue()).toBe('a')
    })

    it('should not open on character with modifier', () => {
      select = createSelect({ options: basicOptions, searchable: true })

      const event = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true })
      handleKeyDown(select, event)

      expect(select.isOpen()).toBe(false)
    })

    it('should create option on Enter when creatable', async () => {
      const onCreate = vi.fn(async (value: string) => ({
        value,
        label: value,
      }))

      select = createSelect({
        options: basicOptions,
        searchable: true,
        creatable: true,
        onCreate,
      })

      select.open()
      select.setSearchValue('newitem')

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      handleKeyDown(select, event)

      // Wait for async create
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(onCreate).toHaveBeenCalledWith('newitem')
    })
  })

  describe('handleTab', () => {
    it('should close menu on Tab', () => {
      const select = createSelect({ options: basicOptions })
      select.open()

      const event = new KeyboardEvent('keydown', { key: 'Tab' })
      handleTab(select, event)

      expect(select.isOpen()).toBe(false)
    })

    it('should return false to allow default behavior', () => {
      const select = createSelect({ options: basicOptions })

      const event = new KeyboardEvent('keydown', { key: 'Tab' })
      const result = handleTab(select, event)

      expect(result).toBe(false)
    })

    it('should return false for non-Tab keys', () => {
      const select = createSelect({ options: basicOptions })

      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      const result = handleTab(select, event)

      expect(result).toBe(false)
    })
  })

  describe('createKeyBindings', () => {
    it('should create bindings from map', () => {
      const bindings = createKeyBindings({
        next: ['j'],
        prev: ['k'],
      })

      expect(bindings).toContainEqual({
        key: 'j',
        action: 'next',
        when: 'always',
      })
      expect(bindings).toContainEqual({
        key: 'k',
        action: 'prev',
        when: 'always',
      })
    })

    it('should handle multiple keys per action', () => {
      const bindings = createKeyBindings({
        select: ['Enter', ' '],
      })

      expect(bindings).toHaveLength(2)
    })
  })

  describe('mergeKeyBindings', () => {
    it('should merge bindings', () => {
      const base = defaultKeyBindings
      const overrides = [{ key: 'j', action: 'next' as const, when: 'open' as const }]

      const merged = mergeKeyBindings(base, overrides)

      expect(merged).toContainEqual(overrides[0])
    })

    it('should override existing bindings', () => {
      const base = [
        { key: 'ArrowDown', action: 'next' as const, when: 'open' as const },
      ]
      const overrides = [
        { key: 'ArrowDown', action: 'pageDown' as const, when: 'open' as const },
      ]

      const merged = mergeKeyBindings(base, overrides)

      expect(merged).toHaveLength(1)
      expect(merged[0]?.action).toBe('pageDown')
    })
  })

  describe('defaultKeyBindings', () => {
    it('should have navigation bindings', () => {
      const actions = defaultKeyBindings.map(b => b.action)

      expect(actions).toContain('next')
      expect(actions).toContain('prev')
      expect(actions).toContain('first')
      expect(actions).toContain('last')
    })

    it('should have selection bindings', () => {
      const actions = defaultKeyBindings.map(b => b.action)

      expect(actions).toContain('select')
      expect(actions).toContain('close')
      expect(actions).toContain('open')
    })
  })
})
