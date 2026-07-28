'use client'

import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import api from '@/apis'

interface Comment {
  id: string | number
  content: string
  user?: { id: string | number; username: string }
}

interface Post {
  id: string | number
  title: string
  content: string
  image_url?: string | null
  user?: { id: string | number; username: string }
  comments?: Comment[]
}

export default function PostDetailPage() {
  const params = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [comment, setComment] = useState('')

  const fetchPost = useCallback(async () => {
    const res = await api.post.getPostById(params.id)
    setPost(res.data.data.post)
  }, [params.id])

  useEffect(() => {
    void fetchPost()
  }, [fetchPost])

  async function addComment(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim()) return
    await api.post.createComment(params.id, { content: comment })
    setComment('')
    await fetchPost()
  }

  if (!post) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
      <Link href="/posts" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
        <ArrowLeft />
        Back to posts
      </Link>

      <Card>
        <CardContent>
          <article className="space-y-3">
            <h1 className="text-2xl font-bold tracking-tight">{post.title}</h1>
            <p className="text-muted-foreground">{post.content}</p>
            {post.image_url && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={post.image_url}
                alt={post.title}
                className="mt-3 max-h-96 w-full rounded-md border object-cover"
              />
            )}
            {post.user && <Badge variant="secondary">@{post.user.username}</Badge>}
          </article>

          <Separator className="my-4" />

          <div className="space-y-3">
            <h2 className="font-semibold">Comments ({post.comments?.length ?? 0})</h2>
            <form onSubmit={addComment} className="flex gap-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment…"
                className="flex-1"
                required
              />
              <Button type="submit">Send</Button>
            </form>
            <ul className="space-y-2">
              {(post.comments ?? []).map((c) => (
                <li key={c.id} className="rounded-lg bg-muted p-3">
                  <p className="text-sm">{c.content}</p>
                  {c.user && (
                    <p className="mt-1 text-xs text-muted-foreground">— {c.user.username}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
