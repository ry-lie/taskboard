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
}

export default function Column({ id, title, count, taskIds, children }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <section
      ref={setNodeRef}
      className={`rounded-2xl border bg-white p-4 shadow-sm transition ${
        isOver ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200'
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
          {count}
        </span>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="min-h-[120px] space-y-3">{children}</div>
      </SortableContext>    
    </section>
  )
}