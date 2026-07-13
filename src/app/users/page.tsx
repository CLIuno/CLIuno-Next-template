'use client'

import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
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
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {users.map((user) => (
          <Link key={user.id} href={`/users/${user.id}`} className="block">
            <Card className="flex-row items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
              <Avatar>
                <AvatarFallback>{(user.username?.[0] ?? 'U').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {user.first_name} {user.last_name}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  @{user.username} · {user.email}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
