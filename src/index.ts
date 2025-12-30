// Main exports
export { createSelect, Select } from './core/select'
export { EventEmitter } from './core/events'
export { StateManager, createInitialState, getHighlightedOption, getNextHighlightedIndex } from './core/state'
export {
  normalizeOptions,
  flattenOptions,
  groupOptionsByProperty,
  findOptionByValue,
  findOptionsByValue,
  isOptionSelected,
  addToSelection,
  removeFromSelection,
  toggleSelection,
  getValuesFromOptions,
  areOptionsEqual,
  getOptionIndex,
} from './core/options'

// Types
export type {
  SelectOption,
  GroupedOptions,
  Options,
  SelectConfig,
  SelectState,
  FormatContext,
  ChangeAction,
  SelectEvent,
  SelectEvents,
  Select as SelectInterface,
  ContainerProps,
  TriggerProps,
  InputProps,
  MenuProps,
  OptionProps,
  GroupProps,
  GroupLabelProps,
  ClearButtonProps,
  TagProps,
  TagRemoveProps,
  VirtualState,
  VirtualItem,
} from './types'

// Type guards
export { isGroupedOptions, isSelectOption } from './types'

// Features
export {
  defaultFilter,
  filterOptions,
  highlightMatch,
  createFuzzyFilter,
  createMultiFieldFilter,
  getMatchScore,
  sortByMatchScore,
  type HighlightSegment,
} from './features/search'

export {
  canAddSelection,
  canRemoveSelection,
  getRemainingSelections,
  selectMultiple,
  deselectMultiple,
  selectAll,
  deselectAll,
  toggleSelectAll,
  areAllSelected,
  areSomeSelected,
  getSelectionCountMessage,
  type MultiSelectConfig,
} from './features/multi'

export {
  shouldShowCreate,
  getCreateMessage,
  createNewOption,
  createSimpleOption,
  createOptionWithId,
  validateCreateValue,
  validators,
  type CreateConfig,
  type ValidationResult,
} from './features/create'

export {
  AsyncLoader,
  createCachedLoader,
  createFetchLoader,
  combineLoaders,
  withRetry,
  type AsyncConfig,
  type AsyncState,
} from './features/async'

export {
  calculateVirtualWindow,
  getItemOffset,
  getItemHeight,
  getTotalHeight,
  getVirtualItems,
  findIndexAtOffset,
  scrollToIndex,
  createHeightEstimator,
  VirtualScroller,
  type VirtualConfig,
} from './features/virtualize'

export {
  handleKeyDown,
  handleTab,
  createKeyBindings,
  mergeKeyBindings,
  defaultKeyBindings,
  type KeyAction,
  type KeyBinding,
} from './features/keyboard'

// Utilities
export { generateId, resetIdCounter, getOptionId, getMenuId, getTriggerId, getInputId, getGroupLabelId } from './utils/id'
export { debounce, type DebouncedFunction } from './utils/debounce'
export { isElementVisible, scrollIntoView, getScrollParent, containsElement, focusElement, blurElement, isBrowser, preventEvent } from './utils/dom'
export { scrollToIndex as scrollToIndexInContainer, scrollToElement, getVisibleRange } from './utils/scroll'
