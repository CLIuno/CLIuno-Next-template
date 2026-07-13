'use client'

import { CircleCheck, Loader2 } from 'lucide-react'
import Link from 'next/link'
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
import api from '@/apis'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.auth.forgotPassword(email)
      setSent(true)
    } catch {
      setSent(true) // the API is intentionally silent about unknown emails
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Forgot password</CardTitle>
          <CardDescription>We will email you a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <Alert>
              <CircleCheck />
              <AlertTitle>If the email exists, a reset link has been sent.</AlertTitle>
            </Alert>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Your email"
                  required
                />
              </div>
              <Button disabled={loading} className="w-full" type="submit">
                {loading && <Loader2 className="animate-spin" />}
                {loading ? 'Sending…' : 'Send reset link'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-foreground hover:underline">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
