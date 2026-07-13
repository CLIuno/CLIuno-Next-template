'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuthStore } from '@/stores/auth'

export default function Navbar() {
  const { isAuthenticated, user, logout, hydrate } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  async function onLogout() {
    await logout()
    router.push('/login')
  }

  return (
    <div className="tw:navbar tw:bg-base-100 tw:shadow-sm tw:px-4">
      <div className="tw:flex-1">
        <Link href="/" className="tw:btn tw:btn-ghost tw:text-xl">
          CLIuno
        </Link>
        {isAuthenticated && (
          <>
            <Link href="/todos" className="tw:btn tw:btn-ghost">
              Todos
            </Link>
            <Link href="/posts" className="tw:btn tw:btn-ghost">
              Posts
            </Link>
            <Link href="/users" className="tw:btn tw:btn-ghost">
              Users
            </Link>
          </>
        )}
      </div>
      <div className="tw:flex-none tw:gap-2">
        {isAuthenticated ? (
          <>
            <Link href="/profile" className="tw:btn tw:btn-ghost">
              {user?.username ?? 'Profile'}
            </Link>
            <button onClick={onLogout} className="tw:btn tw:btn-outline tw:btn-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="tw:btn tw:btn-ghost">
              Login
            </Link>
            <Link href="/register" className="tw:btn tw:btn-primary tw:btn-sm">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
