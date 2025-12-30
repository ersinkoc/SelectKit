import React, { forwardRef, type ReactNode } from 'react'
import { useMultiSelect } from '../hooks/useMultiSelect'
import type { SelectConfig, SelectOption } from '../../../types'

export interface MultiSelectProps<T> extends Omit<SelectConfig<T>, 'multiple'> {
  className?: string
  triggerClassName?: string
  menuClassName?: string
  optionClassName?: string
  tagClassName?: string
  renderTag?: (option: SelectOption<T>, onRemove: () => void) => ReactNode
  renderOption?: (option: SelectOption<T>, state: { isSelected: boolean; isHighlighted: boolean }) => ReactNode
  renderEmpty?: () => ReactNode
  renderLoading?: () => ReactNode
}

function MultiSelectInner<T = unknown>(
  props: MultiSelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    className,
    triggerClassName,
    menuClassName,
    optionClassName,
    tagClassName,
    renderTag,
    renderOption,
    renderEmpty,
    renderLoading,
    ...config
  } = props

  const {
    isOpen,
    isLoading,
    selectedOptions,
    filteredOptions,
    highlightedIndex,
    getContainerProps,
    getInputProps,
    getMenuProps,
    getOptionProps,
    getTagProps,
    getClearButtonProps,
    deselectOption,
    isSelected,
  } = useMultiSelect<T>(config)

  const containerProps = getContainerProps()
  const inputProps = getInputProps()
  const menuProps = getMenuProps()
  const clearButtonProps = getClearButtonProps()

  const defaultRenderTag = (option: SelectOption<T>, onRemove: () => void) => (
    <span className={tagClassName}>
      {option.label}
      <button onClick={onRemove} type="button" aria-label={`Remove ${option.label}`}>
        ×
      </button>
    </span>
  )

  const defaultRenderOption = (option: SelectOption<T>) => (
    <>
      <span>{option.label}</span>
      {isSelected(option) && <span>✓</span>}
    </>
  )

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
      <div className={triggerClassName}>
        {selectedOptions.map((option, index) => {
          const tagProps = getTagProps(option, index)

          return (
            <span key={String(option.value)} {...tagProps}>
              {(renderTag ?? defaultRenderTag)(option, () => deselectOption(option))}
            </span>
          )
        })}

        {config.searchable !== false && (
          <input {...inputProps} />
        )}

        {config.clearable && selectedOptions.length > 0 && (
          <button {...clearButtonProps} type="button" aria-label="Clear all">
            ×
          </button>
        )}
      </div>

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

export const MultiSelect = forwardRef(MultiSelectInner) as <T = unknown>(
  props: MultiSelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement
