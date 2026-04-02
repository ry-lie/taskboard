// Modal for viewing, editing, and deleting an existing task.
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Task, TaskPriority, TaskStatus } from '../../types/taskType'

interface TaskDetailModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onTaskUpdated: () => void
}

export default function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onTaskUpdated,
}: TaskDetailModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('normal')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync form state whenever a new task is selected.
  useEffect(() => {
    if (!task) return

    setTitle(task.title)
    setDescription(task.description ?? '')
    setPriority(task.priority ?? 'normal')
    setStatus(task.status)
    setDueDate(task.due_date ?? '')
    setError(null)
  }, [task])

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!task) return

    if (!title.trim()) {
      setError('Title is required.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('tasks')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          priority,
          status,
          due_date: dueDate || null,
        })
        .eq('id', task.id)

      if (error) throw error

      onTaskUpdated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!task) return

    const confirmed = window.confirm('Are you sure you want to delete this task?')
    if (!confirmed) return

    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.from('tasks').delete().eq('id', task.id)

      if (error) throw error

      onTaskUpdated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">Task Details</p>
            <h2 className="mt-1 text-xl font-semibold text-gray-900">View or edit task</h2>
            <p className="mt-2 text-sm text-gray-500">
              Update task details or remove the task from your board.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleUpdate}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              Delete
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}