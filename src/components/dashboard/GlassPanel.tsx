import type { ReactNode } from 'react'

interface GlassPanelProps {
  children: ReactNode
  className?: string
}

export default function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return (
    <div
      className={`rounded-2xl border border-border/60 bg-surface/70 backdrop-blur-xl shadow-lg shadow-black/30 ${className}`}
    >
      {children}
    </div>
  )
}
