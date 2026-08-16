import type { ReactNode } from 'react'

interface PageContainerProps {
  title: string
  description?: string
  children?: ReactNode
}

export default function PageContainer({ title, description, children }: PageContainerProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg shadow-black/20">
        {children}
      </div>
    </div>
  )
}
