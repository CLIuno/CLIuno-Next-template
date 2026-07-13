'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

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
      <div className="tw:flex tw:justify-center tw:py-20">
        <span className="tw:loading tw:loading-spinner tw:loading-lg" />
      </div>
    )
  }

  return (
    <div className="tw:max-w-2xl tw:mx-auto tw:px-4 tw:py-8 tw:space-y-4">
      <Link href="/posts" className="tw:btn tw:btn-ghost tw:btn-sm">
        ← Back to posts
      </Link>

      <div className="tw:card tw:bg-base-100 tw:shadow-lg tw:p-6">
        <h1 className="tw:text-2xl tw:font-bold">{post.title}</h1>
        <p className="tw:mt-2 tw:opacity-80">{post.content}</p>
        {post.user && <p className="tw:text-sm tw:opacity-60 tw:mt-3">by {post.user.username}</p>}
      </div>

      <div className="tw:card tw:bg-base-100 tw:shadow-lg tw:p-6 tw:space-y-3">
        <h2 className="tw:font-bold">Comments ({post.comments?.length ?? 0})</h2>
        <form onSubmit={addComment} className="tw:flex tw:gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment…"
            className="tw:input tw:input-bordered tw:flex-1"
            required
          />
          <button className="tw:btn tw:btn-primary" type="submit">
            Send
          </button>
        </form>
        <ul className="tw:space-y-2">
          {(post.comments ?? []).map((c) => (
            <li key={c.id} className="tw:bg-base-200 tw:rounded tw:p-3">
              <p className="tw:text-sm">{c.content}</p>
              {c.user && <p className="tw:text-xs tw:opacity-60 tw:mt-1">— {c.user.username}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
