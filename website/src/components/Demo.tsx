import { ReactNode } from 'react'

interface DemoProps {
  title?: string
  description?: string
  children: ReactNode
}

export default function Demo({ title, description, children }: DemoProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      {(title || description) && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
          {title && <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      )}
      <div className="p-6 bg-white dark:bg-gray-900 rounded-b-lg min-h-[200px]">{children}</div>
    </div>
  )
}
