'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
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

  const initial = (user?.username?.[0] ?? 'U').toUpperCase()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center gap-4 px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          CLIuno
        </Link>
        {isAuthenticated && (
          <nav className="flex items-center gap-1">
            <Link href="/todos" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              Todos
            </Link>
            <Link href="/posts" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              Posts
            </Link>
            <Link href="/users" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              Users
            </Link>
          </nav>
        )}
        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Account menu"
                className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'rounded-full')}
              >
                <Avatar>
                  <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>@{user?.username ?? 'me'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/profile" />}>Profile</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={onLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                Login
              </Link>
              <Link href="/register" className={buttonVariants({ size: 'sm' })}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
