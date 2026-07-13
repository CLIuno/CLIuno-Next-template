'use client'

import { CircleCheck, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/apis'
import { useAuthStore } from '@/stores/auth'

export default function ProfilePage() {
  const { user, fetchCurrentUser } = useAuthStore()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    void fetchCurrentUser()
  }, [fetchCurrentUser])

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name)
      setLastName(user.last_name)
    }
  }, [user])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    await api.user.updateCurrentUser({ first_name: firstName, last_name: lastName })
    await fetchCurrentUser()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!user) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">My profile</h1>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="text-xl">
              {(user.username?.[0] ?? 'U').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium">
              {user.first_name} {user.last_name}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              @{user.username} · {user.email}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            {saved && (
              <Alert>
                <CircleCheck />
                <AlertTitle>Saved.</AlertTitle>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="first_name">First name</Label>
              <Input
                id="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last name</Label>
              <Input
                id="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
