'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import api from '@/apis'

interface Post {
  id: string | number
  title: string
  content: string
  user?: { id: string | number; username: string }
  comments?: unknown[]
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchPosts = useCallback(async () => {
    try {
      const res = await api.post.getAllPosts()
      setPosts(res.data.data.posts)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchPosts()
  }, [fetchPosts])

  async function createPost(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    await api.post.createPost({ title, content })
    setTitle('')
    setContent('')
    await fetchPosts()
  }

  return (
    <div className="tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-8 tw:space-y-6">
      <h1 className="tw:text-3xl tw:font-bold">Posts</h1>

      <form
        onSubmit={createPost}
        className="tw:card tw:bg-base-100 tw:shadow-sm tw:p-4 tw:space-y-2"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="tw:input tw:input-bordered tw:w-full"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="tw:textarea tw:textarea-bordered tw:w-full"
          rows={3}
          required
        />
        <button className="tw:btn tw:btn-primary tw:self-end" type="submit">
          Publish
        </button>
      </form>

      {loading && <span className="tw:loading tw:loading-spinner" />}
      {!loading && posts.length === 0 && <p>No posts yet.</p>}

      <div className="tw:space-y-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="tw:card tw:bg-base-100 tw:shadow-sm tw:p-4 tw:block hover:tw:shadow-md"
          >
            <h2 className="tw:font-semibold tw:text-lg">{post.title}</h2>
            <p className="tw:text-sm tw:opacity-70 tw:line-clamp-2">{post.content}</p>
            <p className="tw:text-xs tw:opacity-60 tw:mt-2">
              {post.user?.username} · {post.comments?.length ?? 0} comments
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
