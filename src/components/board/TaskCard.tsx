// Individual task card shown inside each Kanban column
import type { Task, TaskPriority } from '../../types/taskType'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { CalendarDays } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onClick: () => void
}

// Task priority color (row, normal, high)
const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-emerald-100 text-emerald-600',
  normal: 'bg-blue-100 text-blue-600',
  high: 'bg-rose-100 text-rose-600',
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
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

  const priority = task.priority ?? 'normal'
  const priorityClass = priorityStyles[priority]

  return (
    <article 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners} 
      onClick={onClick}
      className={`cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Task Title */}
        <h3 className="text-sm font-semibold text-gray-900">{task.title}</h3>
        {/* Task Priority */}
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClass}`}>
          {priority}
        </span>
      </div>
      {/* Task Description */}
      {task.description && (
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{task.description}</p>
      )}
      {/* Task Due Date */}
      <div className="mt-2 flex items-center justify-between">
        <DueDateBadge dueDate={task.due_date} />
      </div>
    </article>
  )
}

// Due Date Text
function DueDateBadge({ dueDate }: { dueDate: string | null }) {
  if (!dueDate) {
    return (
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
        No due date
      </span>
    )
  }

  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  let textClass = 'text-slate-500'

  if (diffDays < 0) {
    textClass = 'text-rose-600'
  } else if (diffDays <= 2) {
    textClass = 'text-amber-600'
  }

  const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${textClass}`}>
      <CalendarDays className="h-4 w-4" />
      <span>{formattedDate}</span>
    </div>
  )
}