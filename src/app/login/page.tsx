'use client'

import { AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    <div className="flex justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>Sign in to your CLIuno account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="usernameOrEmail">Username or email</Label>
              <Input
                id="usernameOrEmail"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Username or email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <Button disabled={loading} className="w-full" type="submit">
              {loading && <Loader2 className="animate-spin" />}
              {loading ? 'Signing in…' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-between text-sm text-muted-foreground">
          <Link href="/forgot-password" className="hover:text-foreground hover:underline">
            Forgot password?
          </Link>
          <Link href="/register" className="hover:text-foreground hover:underline">
            Create account
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
