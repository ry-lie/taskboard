// Reusable board column container (for each Kanban status section)
import type { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface ColumnProps {
  id: string
  title: string
  count: number
  taskIds: string[]
  children: ReactNode
  accent: string
  surface: string
}

export default function Column({ id, title, count, taskIds, children, accent, surface }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <section
      ref={setNodeRef}
      className={`overflow-hidden rounded-xl border shadow-sm transition-all ${
        isOver ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'
      } ${surface}`}
    >
      {/* Accent strip */}
      <div className={`h-1.5 w-full ${accent}`} />

      {/* Content area */}
      <div className="px-4 pb-4 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
          {/* Task Count Badge */}
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-700 shadow-sm">
            {count}
          </span>
        </div>

        {/* Tasks */}
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="min-h-[160px] space-y-3">{children}</div>
        </SortableContext>    
      </div>
    </section>
  )
}