import type { SelectOption } from '../types'

/**
 * Default filter function - case-insensitive label match
 */
export function defaultFilter<T>(option: SelectOption<T>, search: string): boolean {
  if (!search) return true
  const searchLower = search.toLowerCase()
  const labelLower = option.label.toLowerCase()
  return labelLower.includes(searchLower)
}

/**
 * Filter options by search string
 */
export function filterOptions<T>(
  options: SelectOption<T>[],
  search: string,
  filterFn: (option: SelectOption<T>, search: string) => boolean
): SelectOption<T>[] {
  if (!search) return options
  return options.filter((option) => filterFn(option, search))
}

/**
 * Highlight matching text in a string
 * Returns an array of segments with highlighted flag
 */
export interface HighlightSegment {
  text: string
  highlighted: boolean
}

export function highlightMatch(text: string, search: string): HighlightSegment[] {
  if (!search) {
    return [{ text, highlighted: false }]
  }

  const searchLower = search.toLowerCase()
  const textLower = text.toLowerCase()
  const index = textLower.indexOf(searchLower)

  if (index === -1) {
    return [{ text, highlighted: false }]
  }

  const segments: HighlightSegment[] = []

  if (index > 0) {
    segments.push({ text: text.slice(0, index), highlighted: false })
  }

  segments.push({
    text: text.slice(index, index + search.length),
    highlighted: true,
  })

  if (index + search.length < text.length) {
    segments.push({
      text: text.slice(index + search.length),
      highlighted: false,
    })
  }

  return segments
}

/**
 * Create a fuzzy filter function
 */
export function createFuzzyFilter<T>(
  getSearchableText: (option: SelectOption<T>) => string = (opt) => opt.label
): (option: SelectOption<T>, search: string) => boolean {
  return (option, search) => {
    if (!search) return true

    const text = getSearchableText(option).toLowerCase()
    const searchChars = search.toLowerCase().split('')

    let textIndex = 0
    for (const char of searchChars) {
      const foundIndex = text.indexOf(char, textIndex)
      if (foundIndex === -1) return false
      textIndex = foundIndex + 1
    }

    return true
  }
}

/**
 * Create a multi-field filter function
 */
export function createMultiFieldFilter<T>(
  fields: ((option: SelectOption<T>) => string)[]
): (option: SelectOption<T>, search: string) => boolean {
  return (option, search) => {
    if (!search) return true

    const searchLower = search.toLowerCase()
    return fields.some((getField) => {
      const value = getField(option)
      return value.toLowerCase().includes(searchLower)
    })
  }
}

/**
 * Calculate match score for sorting
 */
export function getMatchScore<T>(option: SelectOption<T>, search: string): number {
  if (!search) return 0

  const label = option.label.toLowerCase()
  const searchLower = search.toLowerCase()

  // Exact match
  if (label === searchLower) return 100

  // Starts with
  if (label.startsWith(searchLower)) return 75

  // Word starts with
  const words = label.split(/\s+/)
  if (words.some((word) => word.startsWith(searchLower))) return 50

  // Contains
  if (label.includes(searchLower)) return 25

  return 0
}

/**
 * Sort options by match score
 */
export function sortByMatchScore<T>(
  options: SelectOption<T>[],
  search: string
): SelectOption<T>[] {
  if (!search) return options

  return [...options].sort((a, b) => {
    const scoreA = getMatchScore(a, search)
    const scoreB = getMatchScore(b, search)
    return scoreB - scoreA
  })
}
