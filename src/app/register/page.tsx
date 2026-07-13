'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useAuthStore } from '@/stores/auth'

export default function RegisterPage() {
  const { register, loading, error } = useAuthStore()
  const router = useRouter()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  })

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await register(form)
      router.push('/login')
    } catch {
      // error state is set by the store
    }
  }

  return (
    <div className="tw:flex tw:justify-center tw:py-12 tw:px-4">
      <form
        onSubmit={onSubmit}
        className="tw:card tw:bg-base-100 tw:shadow-lg tw:w-full tw:max-w-md tw:p-8 tw:space-y-3"
      >
        <h1 className="tw:text-2xl tw:font-bold">Create account</h1>
        {error && <div className="tw:alert tw:alert-error tw:text-sm">{error}</div>}
        <div className="tw:grid tw:grid-cols-2 tw:gap-3">
          <input
            value={form.first_name}
            onChange={update('first_name')}
            placeholder="First name"
            className="tw:input tw:input-bordered tw:w-full"
            required
          />
          <input
            value={form.last_name}
            onChange={update('last_name')}
            placeholder="Last name"
            className="tw:input tw:input-bordered tw:w-full"
            required
          />
        </div>
        <input
          value={form.username}
          onChange={update('username')}
          placeholder="Username"
          className="tw:input tw:input-bordered tw:w-full"
          required
        />
        <input
          value={form.email}
          onChange={update('email')}
          type="email"
          placeholder="Email"
          className="tw:input tw:input-bordered tw:w-full"
          required
        />
        <input
          value={form.phone}
          onChange={update('phone')}
          placeholder="Phone"
          className="tw:input tw:input-bordered tw:w-full"
        />
        <input
          value={form.password}
          onChange={update('password')}
          type="password"
          placeholder="Password"
          className="tw:input tw:input-bordered tw:w-full"
          required
        />
        <input
          value={form.password_confirmation}
          onChange={update('password_confirmation')}
          type="password"
          placeholder="Confirm password"
          className="tw:input tw:input-bordered tw:w-full"
          required
        />
        <button disabled={loading} className="tw:btn tw:btn-primary tw:w-full" type="submit">
          {loading ? 'Creating…' : 'Register'}
        </button>
        <p className="tw:text-sm">
          Already have an account?{' '}
          <Link href="/login" className="tw:link">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
