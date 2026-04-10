// Calendar view for displaying tasks by due date.
import { useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import type { EventClickArg, EventContentArg } from '@fullcalendar/core'
import type { Task, TaskPriority, TaskStatus } from '../types/taskType'
import '../calendar.css'

interface CalendarViewProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

type PriorityFilter = 'all' | 'low' | 'normal' | 'high'
type StatusFilter = 'all' | 'todo' | 'in_progress' | 'in_review' | 'done'

const statusColors: Record<TaskStatus, string> = {
  todo: '#f8fafc',
  in_progress: '#eff6ff',
  in_review: '#fffbeb',
  done: '#ecfdf5',
}

const statusBorderColors: Record<TaskStatus, string> = {
  todo: '#64748b',
  in_progress: '#6366f1',
  in_review: '#f59e0b',
  done: '#10b981',
}

const priorityDotColors: Record<TaskPriority, string> = {
  low: 'bg-emerald-500',
  normal: 'bg-blue-500',
  high: 'bg-rose-500',
}

export default function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesPriority =
        priorityFilter === 'all' ? true : (task.priority ?? 'normal') === priorityFilter

      const matchesStatus = statusFilter === 'all' ? true : task.status === statusFilter

      return task.due_date && matchesPriority && matchesStatus
    })
  }, [tasks, priorityFilter, statusFilter])

  const calendarEvents = filteredTasks.map((task) => {
    const status = task.status

    return {
      id: task.id,
      title: task.title,
      start: task.due_date!,
      allDay: true,
      backgroundColor: statusColors[status],
      borderColor: statusBorderColors[status],
      textColor: '#0f172a',
      extendedProps: {
        task,
        priority: task.priority ?? 'normal',
        status,
      },
    }
  })

  const handleEventClick = (info: EventClickArg) => {
    const clickedTask = tasks.find((task) => task.id === info.event.id)
    if (!clickedTask) return

    onTaskClick(clickedTask)
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    const task = eventInfo.event.extendedProps.task as Task
    const priority = (task.priority ?? 'normal') as TaskPriority
    const priorityDotClass = priorityDotColors[priority]

    return (
      <div className="calendar-task-card">
        <span className="calendar-task-title">{task.title}</span>
        <span className={`calendar-task-priority-dot ${priorityDotClass}`} />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={calendarEvents}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        dayMaxEvents={3}
        fixedWeekCount={false}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
      />

      <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
            <span>To Do</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>In Review</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Done</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
              className="calendar-filter-select"
            >
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="calendar-filter-select"
            >
              <option value="all">All statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setPriorityFilter('all')
              setStatusFilter('all')
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}