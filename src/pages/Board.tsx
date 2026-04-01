import Column from '../components/board/Column'
import TaskCard from '../components/board/TaskCard'
import { useTasks } from '../hooks/useTasks'
import type { TaskStatus } from '../types/taskType'

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'in_review', title: 'In Review' },
  { id: 'done', title: 'Done' },
]

export default function Board() {
  const { tasks, loading, error } = useTasks()

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">FlowBoard</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="mt-2 text-sm text-gray-500">
              Track your work visually and keep things moving.
            </p>
          </div>

          <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
            + New Task
          </button>
        </div>

        {loading && <p className="mb-4 text-sm text-gray-500">Loading tasks...</p>}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id)

            return (
              <Column key={column.id} title={column.title} count={columnTasks.length}>
                {columnTasks.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 p-4 text-sm text-gray-400">
                    No tasks yet
                  </div>
                ) : (
                  columnTasks.map((task) => <TaskCard key={task.id} task={task} />)
                )}
              </Column>
            )
          })}
        </div>
      </div>
    </div>
  )
}