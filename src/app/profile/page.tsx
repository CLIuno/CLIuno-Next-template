'use client'

import { useEffect, useState } from 'react'

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
      <div className="tw:flex tw:justify-center tw:py-20">
        <span className="tw:loading tw:loading-spinner tw:loading-lg" />
      </div>
    )
  }

  return (
    <div className="tw:max-w-xl tw:mx-auto tw:px-4 tw:py-8 tw:space-y-4">
      <h1 className="tw:text-3xl tw:font-bold">My profile</h1>
      <form onSubmit={save} className="tw:card tw:bg-base-100 tw:shadow-lg tw:p-6 tw:space-y-3">
        {saved && <div className="tw:alert tw:alert-success tw:text-sm">Saved.</div>}
        <p className="tw:text-sm tw:opacity-60">
          @{user.username} · {user.email}
        </p>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          className="tw:input tw:input-bordered tw:w-full"
        />
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
          className="tw:input tw:input-bordered tw:w-full"
        />
        <button className="tw:btn tw:btn-primary tw:self-end" type="submit">
          Save
        </button>
      </form>
    </div>
  )
}
