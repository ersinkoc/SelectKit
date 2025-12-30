import React, { forwardRef, type ReactNode, type HTMLAttributes } from 'react'
import { useSelectContext, useSelectState, useSelectProps } from '../context'
import type { SelectOption as SelectOptionType, GroupedOptions } from '../../../types'

// ============ SelectTrigger ============

export interface SelectTriggerProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'ref'> {
  children: ReactNode
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, ...props }, ref) => {
    const { getTriggerProps } = useSelectProps()
    const triggerProps = getTriggerProps()

    return (
      <button
        {...props}
        {...triggerProps}
        ref={(el) => {
          triggerProps.ref(el)
          if (typeof ref === 'function') {
            ref(el)
          } else if (ref) {
            ref.current = el
          }
        }}
        type="button"
      >
        {children}
      </button>
    )
  }
)
SelectTrigger.displayName = 'SelectTrigger'

// ============ SelectValue ============

export interface SelectValueProps<T = unknown> {
  placeholder?: string
  children?: (option: SelectOptionType<T>) => ReactNode
}

export function SelectValue<T = unknown>({ placeholder, children }: SelectValueProps<T>) {
  const state = useSelectState<T>()
  const selectedOption = state.selectedOptions[0]

  if (!selectedOption) {
    return <span>{placeholder ?? 'Select...'}</span>
  }

  if (children) {
    return <>{children(selectedOption)}</>
  }

  return <span>{selectedOption.label}</span>
}

// ============ SelectInput ============

export interface SelectInputProps extends Omit<HTMLAttributes<HTMLInputElement>, 'ref' | 'onChange'> {
  placeholder?: string
}

export const SelectInput = forwardRef<HTMLInputElement, SelectInputProps>(
  ({ placeholder, ...props }, ref) => {
    const { getInputProps } = useSelectProps()
    const inputProps = getInputProps()

    return (
      <input
        {...props}
        {...inputProps}
        ref={(el) => {
          inputProps.ref(el)
          if (typeof ref === 'function') {
            ref(el)
          } else if (ref) {
            ref.current = el
          }
        }}
        placeholder={placeholder ?? inputProps.placeholder}
      />
    )
  }
)
SelectInput.displayName = 'SelectInput'

// ============ SelectClear ============

export interface SelectClearProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'ref'> {
  children?: ReactNode
}

export const SelectClear = forwardRef<HTMLButtonElement, SelectClearProps>(
  ({ children, ...props }, ref) => {
    const { getClearButtonProps } = useSelectProps()
    const state = useSelectState()
    const clearProps = getClearButtonProps()

    if (state.selectedOptions.length === 0) {
      return null
    }

    return (
      <button {...props} {...clearProps} ref={ref} type="button">
        {children ?? '×'}
      </button>
    )
  }
)
SelectClear.displayName = 'SelectClear'

// ============ SelectMenu ============

export interface SelectMenuProps<T = unknown> extends Omit<HTMLAttributes<HTMLUListElement>, 'ref' | 'children'> {
  children: ReactNode | ((filteredOptions: SelectOptionType<T>[]) => ReactNode)
}

export const SelectMenu = forwardRef<HTMLUListElement, SelectMenuProps>(
  ({ children, ...props }, ref) => {
    const { getMenuProps } = useSelectProps()
    const state = useSelectState()
    const menuProps = getMenuProps()

    if (!state.isOpen) {
      return null
    }

    const content = typeof children === 'function'
      ? children(state.filteredOptions)
      : children

    return (
      <ul
        {...props}
        {...menuProps}
        ref={(el) => {
          menuProps.ref(el)
          if (typeof ref === 'function') {
            ref(el)
          } else if (ref) {
            ref.current = el
          }
        }}
      >
        {content}
      </ul>
    )
  }
)
SelectMenu.displayName = 'SelectMenu'

// ============ SelectOption ============

export interface SelectOptionProps<T = unknown> extends Omit<HTMLAttributes<HTMLLIElement>, 'ref' | 'children'> {
  option: SelectOptionType<T>
  index: number
  children: ReactNode | ((state: { isSelected: boolean; isHighlighted: boolean; isDisabled: boolean }) => ReactNode)
}

const SelectOptionBase = forwardRef<HTMLLIElement, SelectOptionProps>(
  ({ option, index, children, ...props }, ref) => {
    const { select } = useSelectContext()
    const { getOptionProps } = useSelectProps()
    const state = useSelectState()
    const optionProps = getOptionProps(option, index)

    const isSelected = select.isSelected(option)
    const isHighlighted = state.highlightedIndex === index
    const isDisabled = option.disabled ?? false

    const content = typeof children === 'function'
      ? children({ isSelected, isHighlighted, isDisabled })
      : children

    return (
      <li
        {...props}
        {...optionProps}
        ref={(el) => {
          optionProps.ref(el)
          if (typeof ref === 'function') {
            ref(el)
          } else if (ref) {
            ref.current = el
          }
        }}
      >
        {content}
      </li>
    )
  }
)

SelectOptionBase.displayName = 'SelectOption'

export const SelectOption = SelectOptionBase as <T = unknown>(
  props: SelectOptionProps<T> & { ref?: React.ForwardedRef<HTMLLIElement> }
) => React.ReactElement

// ============ SelectGroup ============

export interface SelectGroupProps<T = unknown> extends Omit<HTMLAttributes<HTMLDivElement>, 'ref'> {
  group: GroupedOptions<T>
  index: number
  children: ReactNode
}

const SelectGroupBase = forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ group, index, children, ...props }, ref) => {
    const { getGroupProps } = useSelectProps()
    const groupProps = getGroupProps(group, index)

    return (
      <div {...props} {...groupProps} ref={ref}>
        {children}
      </div>
    )
  }
)

SelectGroupBase.displayName = 'SelectGroup'

export const SelectGroup = SelectGroupBase as <T = unknown>(
  props: SelectGroupProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement

// ============ SelectGroupLabel ============

export interface SelectGroupLabelProps<T = unknown> extends Omit<HTMLAttributes<HTMLDivElement>, 'ref'> {
  group: GroupedOptions<T>
  index: number
  children?: ReactNode
}

const SelectGroupLabelBase = forwardRef<HTMLDivElement, SelectGroupLabelProps>(
  ({ group, index, children, ...props }, ref) => {
    const { getGroupLabelProps } = useSelectProps()
    const labelProps = getGroupLabelProps(group, index)

    return (
      <div {...props} {...labelProps} ref={ref}>
        {children ?? group.label}
      </div>
    )
  }
)

SelectGroupLabelBase.displayName = 'SelectGroupLabel'

export const SelectGroupLabel = SelectGroupLabelBase as <T = unknown>(
  props: SelectGroupLabelProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement

// ============ SelectTag ============

export interface SelectTagProps<T = unknown> extends Omit<HTMLAttributes<HTMLSpanElement>, 'ref'> {
  option: SelectOptionType<T>
  index: number
  children: ReactNode
}

const SelectTagBase = forwardRef<HTMLSpanElement, SelectTagProps>(
  ({ option, index, children, ...props }, ref) => {
    const { getTagProps } = useSelectProps()
    const tagProps = getTagProps(option, index)

    return (
      <span {...props} {...tagProps} ref={ref}>
        {children}
      </span>
    )
  }
)

SelectTagBase.displayName = 'SelectTag'

export const SelectTag = SelectTagBase as <T = unknown>(
  props: SelectTagProps<T> & { ref?: React.ForwardedRef<HTMLSpanElement> }
) => React.ReactElement

// ============ SelectTagRemove ============

export interface SelectTagRemoveProps<T = unknown> extends Omit<HTMLAttributes<HTMLButtonElement>, 'ref'> {
  option: SelectOptionType<T>
  children?: ReactNode
}

const SelectTagRemoveBase = forwardRef<HTMLButtonElement, SelectTagRemoveProps>(
  ({ option, children, ...props }, ref) => {
    const { getTagRemoveProps } = useSelectProps()
    const removeProps = getTagRemoveProps(option)

    return (
      <button {...props} {...removeProps} ref={ref} type="button">
        {children ?? '×'}
      </button>
    )
  }
)

SelectTagRemoveBase.displayName = 'SelectTagRemove'

export const SelectTagRemove = SelectTagRemoveBase as <T = unknown>(
  props: SelectTagRemoveProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> }
) => React.ReactElement

// ============ SelectEmpty ============

export interface SelectEmptyProps extends HTMLAttributes<HTMLLIElement> {
  children: ReactNode
}

export function SelectEmpty({ children, ...props }: SelectEmptyProps) {
  const state = useSelectState()

  if (state.isLoading || state.filteredOptions.length > 0) {
    return null
  }

  return (
    <li {...props} role="presentation">
      {children}
    </li>
  )
}

// ============ SelectLoading ============

export interface SelectLoadingProps extends HTMLAttributes<HTMLLIElement> {
  children: ReactNode
}

export function SelectLoading({ children, ...props }: SelectLoadingProps) {
  const state = useSelectState()

  if (!state.isLoading) {
    return null
  }

  return (
    <li {...props} role="presentation">
      {children}
    </li>
  )
}

// ============ SelectCreate ============

export interface SelectCreateProps extends Omit<HTMLAttributes<HTMLLIElement>, 'ref' | 'children'> {
  children: ReactNode | ((inputValue: string) => ReactNode)
}

const SelectCreateInner = forwardRef<HTMLLIElement, SelectCreateProps>(
  ({ children, ...props }, ref) => {
    const { select } = useSelectContext()
    const state = useSelectState()

    // Check if we should show create option
    const config = select.getConfig()
    if (!config.creatable) {
      return null
    }

    const searchValue = state.searchValue.trim()
    if (!searchValue) {
      return null
    }

    // Check if option with same label exists
    const exists = state.filteredOptions.some(
      (opt) => opt.label.toLowerCase() === searchValue.toLowerCase()
    )
    if (exists) {
      return null
    }

    const content = typeof children === 'function'
      ? children(searchValue)
      : children

    const handleClick = () => {
      select.createOption(searchValue)
    }

    return (
      <li
        {...props}
        ref={ref}
        role="option"
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleClick()
          }
        }}
        tabIndex={-1}
      >
        {content}
      </li>
    )
  }
)

SelectCreateInner.displayName = 'SelectCreate'

export { SelectCreateInner as SelectCreate }
