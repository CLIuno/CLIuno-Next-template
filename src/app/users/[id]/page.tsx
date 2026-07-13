'use client'

import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

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
      <div className="tw:flex tw:justify-center tw:py-20">
        <span className="tw:loading tw:loading-spinner tw:loading-lg" />
      </div>
    )
  }

  const isMe = me && String(me.id) === String(user.id)

  return (
    <div className="tw:max-w-2xl tw:mx-auto tw:px-4 tw:py-8 tw:space-y-4">
      <div className="tw:card tw:bg-base-100 tw:shadow-lg tw:p-6 tw:flex-row tw:items-center tw:gap-4">
        <div className="tw:avatar tw:placeholder">
          <div className="tw:bg-neutral tw:text-neutral-content tw:w-16 tw:rounded-full">
            <span className="tw:text-xl">{user.first_name?.[0]}</span>
          </div>
        </div>
        <div className="tw:flex-1">
          <h1 className="tw:text-xl tw:font-bold">
            {user.first_name} {user.last_name}
          </h1>
          <p className="tw:opacity-60">@{user.username}</p>
          <p className="tw:text-sm tw:mt-1">
            {followers.length} followers · {following.length} following
          </p>
        </div>
        {!isMe && (
          <button
            onClick={toggleFollow}
            className={`tw:btn ${isFollowing ? 'tw:btn-outline' : 'tw:btn-primary'}`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      {followers.length > 0 && (
        <div className="tw:card tw:bg-base-100 tw:shadow tw:p-4">
          <h2 className="tw:font-bold tw:mb-2">Followers</h2>
          <div className="tw:flex tw:flex-wrap tw:gap-2">
            {followers.map((f) => (
              <span key={f.id} className="tw:badge tw:badge-outline">
                @{f.username}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
