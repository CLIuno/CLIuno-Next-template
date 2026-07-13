'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import api from '@/apis'

interface Todo {
  id: string | number
  title: string
  description?: string
  is_completed: boolean
  createdAt?: string
  user?: { id: string | number; username: string }
}

export default function TodoDetailPage() {
  const params = useParams<{ id: string }>()
  const [todo, setTodo] = useState<Todo | null>(null)

  const fetchTodo = useCallback(async () => {
    const res = await api.todo.getTodoById(params.id)
    setTodo(res.data.data.todo)
  }, [params.id])

  useEffect(() => {
    void fetchTodo()
  }, [fetchTodo])

  if (!todo) {
    return (
      <div className="tw:flex tw:justify-center tw:py-20">
        <span className="tw:loading tw:loading-spinner tw:loading-lg" />
      </div>
    )
  }

  return (
    <div className="tw:max-w-2xl tw:mx-auto tw:px-4 tw:py-8 tw:space-y-4">
      <Link href="/todos" className="tw:btn tw:btn-ghost tw:btn-sm">
        ← Back to todos
      </Link>
      <div className="tw:card tw:bg-base-100 tw:shadow-lg tw:p-6 tw:space-y-2">
        <h1 className="tw:text-2xl tw:font-bold">{todo.title}</h1>
        {todo.description && <p className="tw:opacity-80">{todo.description}</p>}
        <p className="tw:text-sm">
          Status:{' '}
          <span className={todo.is_completed ? 'tw:text-success' : 'tw:text-warning'}>
            {todo.is_completed ? 'Completed' : 'Open'}
          </span>
        </p>
        {todo.user && <p className="tw:text-sm tw:opacity-60">Owner: {todo.user.username}</p>}
      </div>
    </div>
  )
}
