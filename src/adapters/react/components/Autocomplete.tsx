import React, { forwardRef, useState, type ReactNode } from 'react'
import { useCombobox, type UseComboboxConfig } from '../hooks/useCombobox'
import type { SelectOption } from '../../../types'

export interface AutocompleteProps<T> extends Omit<UseComboboxConfig<T>, 'onSelect' | 'value'> {
  className?: string
  inputClassName?: string
  menuClassName?: string
  optionClassName?: string
  value?: string
  onInputChange?: (value: string) => void
  onSelect?: (option: SelectOption<T> | null, inputValue: string) => void
  freeSolo?: boolean
  autoHighlight?: boolean
  renderOption?: (option: SelectOption<T>, state: { isSelected: boolean; isHighlighted: boolean }) => ReactNode
  renderEmpty?: () => ReactNode
  renderLoading?: () => ReactNode
}

function AutocompleteInner<T = unknown>(
  props: AutocompleteProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    className,
    inputClassName,
    menuClassName,
    optionClassName,
    value: controlledValue,
    onInputChange,
    onSelect,
    freeSolo = false,
    autoHighlight = true,
    renderOption,
    renderEmpty,
    renderLoading,
    ...config
  } = props

  const [internalValue, setInternalValue] = useState('')
  const inputValue = controlledValue ?? internalValue

  const handleInputChange = (value: string) => {
    if (controlledValue === undefined) {
      setInternalValue(value)
    }
    onInputChange?.(value)
  }

  const handleSelect = (option: SelectOption<T>) => {
    const newValue = option.label
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onInputChange?.(newValue)
    onSelect?.(option, newValue)
  }

  const {
    isOpen,
    isLoading,
    filteredOptions,
    highlightedIndex,
    selectedOption,
    setInputValue,
    getInputProps,
    getMenuProps,
    getOptionProps,
  } = useCombobox<T>({
    ...config,
    onSelect: handleSelect,
    clearOnSelect: false,
  })

  // Sync input value
  React.useEffect(() => {
    setInputValue(inputValue)
  }, [inputValue, setInputValue])

  const baseInputProps = getInputProps()
  const menuProps = getMenuProps()

  const inputProps = {
    ...baseInputProps,
    value: inputValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      handleInputChange(e.target.value)
    },
  }

  const defaultRenderOption = (option: SelectOption<T>) => option.label
  const defaultRenderEmpty = () => {
    const msg = config.noOptionsMessage
    return typeof msg === 'string' ? msg : 'No results'
  }
  const defaultRenderLoading = () => {
    const msg = config.loadingMessage
    return typeof msg === 'string' ? msg : 'Loading...'
  }

  // Handle blur for freeSolo mode
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    baseInputProps.onBlur(e as unknown as FocusEvent)

    if (freeSolo && inputValue && !selectedOption) {
      onSelect?.(null, inputValue)
    }
  }

  return (
    <div ref={ref} className={className}>
      <input
        {...inputProps}
        onBlur={handleBlur}
        className={inputClassName}
      />

      {isOpen && (
        <ul {...menuProps} className={menuClassName}>
          {isLoading ? (
            <li role="presentation">
              {(renderLoading ?? defaultRenderLoading)()}
            </li>
          ) : filteredOptions.length === 0 ? (
            freeSolo && inputValue ? null : (
              <li role="presentation">
                {(renderEmpty ?? defaultRenderEmpty)()}
              </li>
            )
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

export const Autocomplete = forwardRef(AutocompleteInner) as <T = unknown>(
  props: AutocompleteProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement
