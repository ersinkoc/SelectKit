import { useMemo, type ReactNode } from 'react'
import { useSelect } from '../hooks/useSelect'
import { SelectContext, type SelectContextValue } from '../context'
import type { SelectConfig } from '../../../types'

export interface SelectProviderProps<T> extends SelectConfig<T> {
  children: ReactNode
}

export function SelectProvider<T = unknown>({
  children,
  ...config
}: SelectProviderProps<T>) {
  const { select, state } = useSelect<T>(config)

  const contextValue = useMemo<SelectContextValue<T>>(
    () => ({ select, state }),
    [select, state]
  )

  return (
    <SelectContext.Provider value={contextValue as SelectContextValue<unknown>}>
      {children}
    </SelectContext.Provider>
  )
}
