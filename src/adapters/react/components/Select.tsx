import React, { forwardRef, type ReactNode } from 'react'
import { useSelect } from '../hooks/useSelect'
import type { SelectConfig, SelectOption } from '../../../types'

export interface SelectProps<T> extends SelectConfig<T> {
  className?: string
  triggerClassName?: string
  menuClassName?: string
  optionClassName?: string
  renderValue?: (option: SelectOption<T>) => ReactNode
  renderOption?: (option: SelectOption<T>, state: { isSelected: boolean; isHighlighted: boolean }) => ReactNode
  renderEmpty?: () => ReactNode
  renderLoading?: () => ReactNode
}

function SelectInner<T = unknown>(
  props: SelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    className,
    triggerClassName,
    menuClassName,
    optionClassName,
    renderValue,
    renderOption,
    renderEmpty,
    renderLoading,
    ...config
  } = props

  const {
    isOpen,
    isLoading,
    selectedOption,
    filteredOptions,
    highlightedIndex,
    getContainerProps,
    getTriggerProps,
    getMenuProps,
    getOptionProps,
    getClearButtonProps,
    isSelected,
  } = useSelect<T>(config)

  const containerProps = getContainerProps()
  const triggerProps = getTriggerProps()
  const menuProps = getMenuProps()
  const clearButtonProps = getClearButtonProps()

  const defaultRenderValue = (option: SelectOption<T>) => option.label
  const defaultRenderOption = (option: SelectOption<T>) => option.label
  const defaultRenderEmpty = () => {
    const msg = config.noOptionsMessage
    return typeof msg === 'string' ? msg : 'No options'
  }
  const defaultRenderLoading = () => {
    const msg = config.loadingMessage
    return typeof msg === 'string' ? msg : 'Loading...'
  }

  return (
    <div
      {...containerProps}
      ref={(el) => {
        containerProps.ref(el)
        if (typeof ref === 'function') {
          ref(el)
        } else if (ref) {
          ref.current = el
        }
      }}
      className={className}
    >
      <button
        {...triggerProps}
        className={triggerClassName}
        type="button"
      >
        <span>
          {selectedOption
            ? (renderValue ?? defaultRenderValue)(selectedOption)
            : config.placeholder ?? 'Select...'}
        </span>

        {config.clearable && selectedOption && (
          <button
            {...clearButtonProps}
            type="button"
            aria-label="Clear"
          >
            ×
          </button>
        )}
      </button>

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
              const optionIsSelected = isSelected(option)
              const isHighlighted = highlightedIndex === index

              return (
                <li
                  key={String(option.value)}
                  {...optionProps}
                  className={optionClassName}
                >
                  {(renderOption ?? defaultRenderOption)(option, {
                    isSelected: optionIsSelected,
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

export const Select = forwardRef(SelectInner) as <T = unknown>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement
