// Custom hook for loading and managing the current user's tasks from Supabase
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Task } from '../types/taskType'

export function useTasks() {
  // Stores the tasks shown on the board
  const [tasks, setTasks] = useState<Task[]>([])

  // Tracks the loading state while fetching tasks
  const [loading, setLoading] = useState(true)

  // Stores any fetch error message for the UI
  const [error, setError] = useState<string | null>(null)

  // Loads the current user's tasks from Supabase
  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setTasks((data as Task[]) ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  // Fetch tasks once when the board first loads
  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    setTasks,
  }
}