'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useAuthStore } from '@/stores/auth'

export default function LoginPage() {
  const { login, loading, error } = useAuthStore()
  const router = useRouter()
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await login(usernameOrEmail, password)
      router.push('/todos')
    } catch {
      // error state is set by the store
    }
  }

  return (
    <div className="tw:flex tw:justify-center tw:py-16 tw:px-4">
      <form
        onSubmit={onSubmit}
        className="tw:card tw:bg-base-100 tw:shadow-lg tw:w-full tw:max-w-sm tw:p-8 tw:space-y-4"
      >
        <h1 className="tw:text-2xl tw:font-bold">Login</h1>
        {error && <div className="tw:alert tw:alert-error tw:text-sm">{error}</div>}
        <input
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          placeholder="Username or email"
          className="tw:input tw:input-bordered tw:w-full"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="tw:input tw:input-bordered tw:w-full"
          required
        />
        <button disabled={loading} className="tw:btn tw:btn-primary tw:w-full" type="submit">
          {loading ? 'Signing in…' : 'Login'}
        </button>
        <div className="tw:text-sm tw:flex tw:justify-between">
          <Link href="/forgot-password" className="tw:link">
            Forgot password?
          </Link>
          <Link href="/register" className="tw:link">
            Create account
          </Link>
        </div>
      </form>
    </div>
  )
}
