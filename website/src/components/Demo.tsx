import { ReactNode } from 'react'

interface DemoProps {
  title?: string
  description?: string
  children: ReactNode
}

export default function Demo({ title, description, children }: DemoProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {(title || description) && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          {title && <h3 className="font-medium text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      <div className="p-6 bg-white">{children}</div>
    </div>
  )
}
