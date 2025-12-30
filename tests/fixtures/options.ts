import type { SelectOption, GroupedOptions } from '../../src/types'

export const basicOptions: SelectOption<string>[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
]

export const optionsWithDisabled: SelectOption<string>[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', disabled: true },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date', disabled: true },
  { value: 'elderberry', label: 'Elderberry' },
]

export const optionsWithData: SelectOption<string>[] = [
  { value: 'john', label: 'John Doe', data: { email: 'john@example.com' } },
  { value: 'jane', label: 'Jane Smith', data: { email: 'jane@example.com' } },
  { value: 'bob', label: 'Bob Johnson', data: { email: 'bob@example.com' } },
]

export const groupedOptions: GroupedOptions<string>[] = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'broccoli', label: 'Broccoli' },
      { value: 'spinach', label: 'Spinach' },
    ],
  },
]

export const optionsWithGroups: SelectOption<string>[] = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'banana', label: 'Banana', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
  { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
  { value: 'other', label: 'Other' }, // No group
]

export const numericOptions: SelectOption<number>[] = [
  { value: 1, label: 'One' },
  { value: 2, label: 'Two' },
  { value: 3, label: 'Three' },
  { value: 4, label: 'Four' },
  { value: 5, label: 'Five' },
]

export const largeOptionsList: SelectOption<number>[] = Array.from(
  { length: 1000 },
  (_, i) => ({
    value: i,
    label: `Option ${i}`,
  })
)

export const optionsWithIcons: SelectOption<string>[] = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'work', label: 'Work', icon: '💼' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
]

export const optionsWithDescriptions: SelectOption<string>[] = [
  { value: 'standard', label: 'Standard', description: '5-7 days' },
  { value: 'express', label: 'Express', description: '2-3 days' },
  { value: 'overnight', label: 'Overnight', description: 'Next day' },
]
