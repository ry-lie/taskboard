// Individual task card shown inside each Kanban column
import type { Task } from '../../types/taskType'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
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