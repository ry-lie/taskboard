import { useState } from 'react'
import Column from '../components/board/Column'
import TaskCard from '../components/board/TaskCard'
import { useTasks } from '../hooks/useTasks'
import type { TaskStatus } from '../types/taskType'
import CreateTaskModal from '../components/modal/CreateTaskModal'
// drag and drop
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core' // *type-only import
import { supabase } from '../lib/supabase'

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'in_review', title: 'In Review' },
  { id: 'done', title: 'Done' },
]

export default function Board() {
  const { tasks, loading, error, refetch, setTasks } = useTasks()

  // Controls whether the create task modal is open.
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  )

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status)
  }

  const findColumnByTaskId = (taskId: string): TaskStatus | null => {
    const task = tasks.find((item) => item.id === taskId)
    return task?.status ?? null
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const activeTaskId = String(active.id)
    const targetId = String(over.id)

    const activeColumn = findColumnByTaskId(activeTaskId)

    let targetColumn: TaskStatus | null = null

    if (columns.some((column) => column.id === targetId)) {
      targetColumn = targetId as TaskStatus
    } else {
      targetColumn = findColumnByTaskId(targetId)
    }

    if (!activeColumn || !targetColumn || activeColumn === targetColumn) return

    const updatedTasks = tasks.map((task) =>
      task.id === activeTaskId ? { ...task, status: targetColumn } : task
    )

    setTasks(updatedTasks)

    const { error } = await supabase
      .from('tasks')
      .update({ status: targetColumn })
      .eq('id', activeTaskId)

    if (error) {
      await refetch()
    }
  }

  return (
    <>
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
            {/* Create Task Button */}
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >+ New Task</button>
          </div>

          {loading && <p className="mb-4 text-sm text-gray-500">Loading tasks...</p>}
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {columns.map((column) => {
                const columnTasks = getTasksByStatus(column.id)

                return (
                  <Column
                    id={column.id}
                    title={column.title}
                    count={columnTasks.length}
                    taskIds={columnTasks.map((task) => task.id)}
                  >                  
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
          </DndContext>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={refetch}
      />
    </>

  )
}