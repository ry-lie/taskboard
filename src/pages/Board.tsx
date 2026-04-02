import { useState } from 'react'
import Column from '../components/board/Column'
import EmptyState from '../components/board/EmptyState'
import TaskCard from '../components/board/TaskCard'
import { useTasks } from '../hooks/useTasks'
import type { Task, TaskStatus } from '../types/taskType'
import CreateTaskModal from '../components/modal/CreateTaskModal'
import TaskDetailModal from '../components/modal/TaskDetailModal'
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

const columns: { id: TaskStatus; title: string; accent: string; emptyText: string; surface: string; }[] = [
  { 
    id: 'todo', 
    title: 'To Do', 
    accent: 'bg-slate-500', 
    surface: 'bg-slate-50', 
    emptyText: 'Drag tasks here or create a new one.', 
  },
  { 
    id: 'in_progress', 
    title: 'In Progress', 
    accent: 'bg-indigo-500',
    surface: 'bg-blue-50',
    emptyText: 'Drag tasks here to move them forward.', 
  },
  { 
    id: 'in_review', 
    title: 'In Review', 
    accent: 'bg-amber-500', 
    surface: 'bg-amber-50',
    emptyText: "Drag tasks here when they're ready for review.", 
  },
  { 
    id: 'done', 
    title: 'Done', 
    accent: 'bg-emerald-500',
    surface: 'bg-emerald-50',
    emptyText: 'Great job completing your task.', 
  },
]

export default function Board() {
  const { tasks, loading, error, refetch, setTasks } = useTasks()

  // Controls whether the create task modal is open.
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const handleTaskClick = (task: Task) => {
  setSelectedTask(task)
  setIsTaskDetailOpen(true)
  }

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
      <div className="min-h-screen bg-[#f8fafc] px-6 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-600">FlowBoard</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">My Tasks</h1>
              <p className="mt-3 text-lg text-slate-500">
                Track your work visually and keep things moving.
              </p>
            </div>
            {/* Create Task Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              + New Task
            </button>
          </div>

          {loading && <p className="mb-4 text-sm text-gray-500">Loading tasks...</p>}
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {columns.map((column) => {
                const columnTasks = getTasksByStatus(column.id)

                return (
                  <Column
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    count={columnTasks.length}
                    taskIds={columnTasks.map((task) => task.id)}
                    accent={column.accent}
                    surface={column.surface}
                  >
                  {columnTasks.length === 0 ? (
                    <EmptyState title="No tasks yet" description={column.emptyText} />
                    ) : (
                      columnTasks.map((task) => (
                        <TaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} />
                      ))
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

      <TaskDetailModal
        task={selectedTask}
        isOpen={isTaskDetailOpen}
        onClose={() => {
          setIsTaskDetailOpen(false)
          setSelectedTask(null)
        }}
        onTaskUpdated={refetch}
      />
    </>

  )
}