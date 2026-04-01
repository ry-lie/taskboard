// Individual task card shown inside each Kanban column
import type { Task } from '../../types/taskType'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
  useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <article 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners} 
      className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">{task.title}</h3>

        <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">
          {task.priority ?? 'normal'}
        </span>
      </div>

      {task.description && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-500">{task.description}</p>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <span>{task.due_date ? `Due ${task.due_date}` : 'No due date'}</span>
      </div>
    </article>
  )
}