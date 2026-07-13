'use client'

import { Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
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
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Todos</h1>

      <form onSubmit={createTodo} className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo title"
          className="flex-1"
          required
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="flex-1"
        />
        <Button type="submit">Add</Button>
      </form>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {!loading && todos.length === 0 && (
        <p className="text-muted-foreground">No todos yet — add your first one.</p>
      )}

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id}>
            <Card className="flex-row items-center gap-3 px-4 py-3">
              <Checkbox
                checked={todo.is_completed}
                onCheckedChange={() => toggle(todo.id)}
                aria-label={`Toggle ${todo.title}`}
              />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/todos/${todo.id}`}
                  className={cn(
                    'font-medium hover:underline',
                    todo.is_completed && 'text-muted-foreground line-through',
                  )}
                >
                  {todo.title}
                </Link>
                {todo.description && (
                  <p className="truncate text-sm text-muted-foreground">{todo.description}</p>
                )}
                {todo.user && (
                  <p className="text-xs text-muted-foreground">by {todo.user.username}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => remove(todo.id)}
                aria-label={`Delete ${todo.title}`}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 />
              </Button>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
