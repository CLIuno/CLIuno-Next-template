'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import api from '@/apis'
import type { User } from '@/stores/auth'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.user
      .getUsers()
      .then((res) => setUsers(res.data.data.users))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-8 tw:space-y-6">
      <h1 className="tw:text-3xl tw:font-bold">Users</h1>
      {loading && <span className="tw:loading tw:loading-spinner" />}
      <div className="tw:grid tw:grid-cols-1 sm:tw:grid-cols-2 tw:gap-3">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/users/${user.id}`}
            className="tw:card tw:bg-base-100 tw:shadow-sm tw:p-4 hover:tw:shadow-md"
          >
            <p className="tw:font-semibold">
              {user.first_name} {user.last_name}
            </p>
            <p className="tw:text-sm tw:opacity-60">@{user.username}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
