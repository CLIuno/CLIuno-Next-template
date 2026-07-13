'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import api from '@/apis'

interface Todo {
  id: string | number
  title: string
  description?: string
  is_completed: boolean
  user?: { id: string | number; username: string }
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchTodos = useCallback(async () => {
    try {
      const res = await api.todo.getAllTodos()
      setTodos(res.data.data.todos)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchTodos()
  }, [fetchTodos])

  async function createTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    await api.todo.createTodo({ title, description })
    setTitle('')
    setDescription('')
    await fetchTodos()
  }

  async function toggle(id: Todo['id']) {
    await api.todo.toggleTodo(String(id))
    await fetchTodos()
  }

  async function remove(id: Todo['id']) {
    await api.todo.deleteTodo(String(id))
    await fetchTodos()
  }

  return (
    <div className="tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-8 tw:space-y-6">
      <h1 className="tw:text-3xl tw:font-bold">Todos</h1>

      <form onSubmit={createTodo} className="tw:flex tw:gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo title"
          className="tw:input tw:input-bordered tw:flex-1"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="tw:input tw:input-bordered tw:flex-1"
        />
        <button className="tw:btn tw:btn-primary" type="submit">
          Add
        </button>
      </form>

      {loading && <span className="tw:loading tw:loading-spinner" />}
      {!loading && todos.length === 0 && <p>No todos yet — add your first one.</p>}

      <ul className="tw:space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="tw:card tw:bg-base-100 tw:shadow-sm tw:p-4 tw:flex-row tw:items-center tw:gap-3"
          >
            <input
              type="checkbox"
              checked={todo.is_completed}
              onChange={() => toggle(todo.id)}
              className="tw:checkbox"
            />
            <div className="tw:flex-1">
              <Link
                href={`/todos/${todo.id}`}
                className={todo.is_completed ? 'tw:line-through tw:opacity-60' : ''}
              >
                {todo.title}
              </Link>
              {todo.user && <p className="tw:text-xs tw:opacity-60">by {todo.user.username}</p>}
            </div>
            <button
              onClick={() => remove(todo.id)}
              className="tw:btn tw:btn-ghost tw:btn-xs tw:text-error"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
