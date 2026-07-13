'use client'

import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/apis'
import { useAuthStore, type User } from '@/stores/auth'

export default function UserProfilePage() {
  const params = useParams<{ id: string }>()
  const { user: me } = useAuthStore()
  const [user, setUser] = useState<User | null>(null)
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [isFollowing, setIsFollowing] = useState(false)

  const load = useCallback(async () => {
    const [u, fr, fw, isF] = await Promise.all([
      api.user.getUserById(params.id),
      api.follow.getFollowers(params.id),
      api.follow.getFollowing(params.id),
      api.follow.isFollowing(params.id),
    ])
    setUser(u.data.data.user)
    setFollowers(fr.data.data.followers)
    setFollowing(fw.data.data.following)
    setIsFollowing(isF.data.data.isFollowing)
  }, [params.id])

  useEffect(() => {
    void load()
  }, [load])

  async function toggleFollow() {
    if (isFollowing) {
      await api.follow.unfollow(params.id)
    } else {
      await api.follow.follow(params.id)
    }
    await load()
  }

  if (!user) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const isMe = me && String(me.id) === String(user.id)

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
      <Card className="flex-row items-center gap-4 px-6 py-6">
        <Avatar className="size-16">
          <AvatarFallback className="text-xl">
            {(user.first_name?.[0] ?? 'U').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-muted-foreground">@{user.username}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {followers.length} followers · {following.length} following
          </p>
        </div>
        {!isMe && (
          <Button onClick={toggleFollow} variant={isFollowing ? 'outline' : 'default'}>
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </Card>

      {followers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Followers</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {followers.map((f) => (
              <Badge key={f.id} variant="outline">
                @{f.username}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
