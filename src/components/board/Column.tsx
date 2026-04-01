// Reusable board column container (for each Kanban status section)
import type { ReactNode } from 'react'

interface ColumnProps {
  title: string
  count: number
  children: ReactNode
}

export default function Column({ title, count, children }: ColumnProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
          {count}
        </span>
      </div>

      <div className="space-y-3">{children}</div>
    </section>
  )
}