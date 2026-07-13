'use client'

import Link from 'next/link'
import { useState } from 'react'

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
    <div className="tw:flex tw:justify-center tw:py-16 tw:px-4">
      <form
        onSubmit={onSubmit}
        className="tw:card tw:bg-base-100 tw:shadow-lg tw:w-full tw:max-w-sm tw:p-8 tw:space-y-4"
      >
        <h1 className="tw:text-2xl tw:font-bold">Forgot password</h1>
        {sent ? (
          <div className="tw:alert tw:alert-success tw:text-sm">
            If the email exists, a reset link has been sent.
          </div>
        ) : (
          <>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Your email"
              className="tw:input tw:input-bordered tw:w-full"
              required
            />
            <button disabled={loading} className="tw:btn tw:btn-primary tw:w-full" type="submit">
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </>
        )}
        <Link href="/login" className="tw:link tw:text-sm">
          Back to login
        </Link>
      </form>
    </div>
  )
}
