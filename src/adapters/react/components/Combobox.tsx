import React, { forwardRef, type ReactNode } from 'react'
import { useCombobox, type UseComboboxConfig } from '../hooks/useCombobox'
import type { SelectOption } from '../../../types'

export interface ComboboxProps<T> extends UseComboboxConfig<T> {
  className?: string
  inputClassName?: string
  menuClassName?: string
  optionClassName?: string
  renderOption?: (option: SelectOption<T>, state: { isSelected: boolean; isHighlighted: boolean }) => ReactNode
  renderEmpty?: () => ReactNode
  renderLoading?: () => ReactNode
}

function ComboboxInner<T = unknown>(
  props: ComboboxProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    className,
    inputClassName,
    menuClassName,
    optionClassName,
    renderOption,
    renderEmpty,
    renderLoading,
    ...config
  } = props

  const {
    isOpen,
    isLoading,
    filteredOptions,
    highlightedIndex,
    selectedOption,
    getInputProps,
    getMenuProps,
    getOptionProps,
  } = useCombobox<T>(config)

  const inputProps = getInputProps()
  const menuProps = getMenuProps()

  const defaultRenderOption = (option: SelectOption<T>) => option.label
  const defaultRenderEmpty = () => {
    const msg = config.noOptionsMessage
    return typeof msg === 'string' ? msg : 'No results'
  }
  const defaultRenderLoading = () => {
    const msg = config.loadingMessage
    return typeof msg === 'string' ? msg : 'Loading...'
  }

  return (
    <div ref={ref} className={className}>
      <input
        {...inputProps}
        className={inputClassName}
      />

      {isOpen && (
        <ul {...menuProps} className={menuClassName}>
          {isLoading ? (
            <li role="presentation">
              {(renderLoading ?? defaultRenderLoading)()}
            </li>
          ) : filteredOptions.length === 0 ? (
            <li role="presentation">
              {(renderEmpty ?? defaultRenderEmpty)()}
            </li>
          ) : (
            filteredOptions.map((option, index) => {
              const optionProps = getOptionProps(option, index)
              const isSelected = selectedOption?.value === option.value
              const isHighlighted = highlightedIndex === index

              return (
                <li
                  key={String(option.value)}
                  {...optionProps}
                  className={optionClassName}
                >
                  {(renderOption ?? defaultRenderOption)(option, {
                    isSelected,
                    isHighlighted,
                  })}
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}

export const Combobox = forwardRef(ComboboxInner) as <T = unknown>(
  props: ComboboxProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement
