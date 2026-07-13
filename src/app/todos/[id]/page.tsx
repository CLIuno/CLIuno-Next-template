'use client'

import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
      <Link href="/todos" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
        <ArrowLeft />
        Back to todos
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{todo.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {todo.description && <p className="text-muted-foreground">{todo.description}</p>}
          <div className="flex items-center gap-2 text-sm">
            <span>Status:</span>
            <Badge variant={todo.is_completed ? 'default' : 'secondary'}>
              {todo.is_completed ? 'Completed' : 'Open'}
            </Badge>
          </div>
          {todo.user && (
            <p className="text-sm text-muted-foreground">Owner: {todo.user.username}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
