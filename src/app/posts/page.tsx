'use client'

import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import api from '@/apis'
import { useImageUpload } from '@/hooks/useImageUpload'

interface Post {
  id: string | number
  title: string
  content: string
  image_url?: string | null
  user?: { id: string | number; username: string }
  comments?: unknown[]
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState('')
  const { uploading, uploadError, uploadImage } = useImageUpload()
  const imageInputRef = useRef<HTMLInputElement>(null)

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

  async function onImagePicked(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    if (url) setImageUrl(url)
    input.value = ''
  }

  async function createPost(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    await api.post.createPost({ title, content, ...(imageUrl ? { image_url: imageUrl } : {}) })
    setTitle('')
    setContent('')
    setImageUrl('')
    await fetchPosts()
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Posts</h1>

      <Card>
        <CardContent>
          <form onSubmit={createPost} className="flex flex-col gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              required
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
              required
            />
            <div className="flex items-center gap-3">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={onImagePicked}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => imageInputRef.current?.click()}
              >
                {uploading ? 'Uploading…' : imageUrl ? 'Replace image' : 'Add image'}
              </Button>
              {imageUrl && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setImageUrl('')}>
                  Remove
                </Button>
              )}
            </div>
            {imageUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={imageUrl}
                alt="Selected preview"
                className="max-h-40 rounded-md border object-cover"
              />
            )}
            {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
            <Button type="submit" className="self-end">
              Publish
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {!loading && posts.length === 0 && <p className="text-muted-foreground">No posts yet.</p>}

      <div className="space-y-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`} className="block">
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">{post.content}</CardDescription>
              </CardHeader>
              {post.image_url && (
                <CardContent>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="max-h-64 w-full rounded-md border object-cover"
                  />
                </CardContent>
              )}
              <CardContent className="flex items-center gap-2 text-xs text-muted-foreground">
                {post.user && <Badge variant="secondary">@{post.user.username}</Badge>}
                <span>{post.comments?.length ?? 0} comments</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
