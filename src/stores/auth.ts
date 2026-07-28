'use client'

import axios from 'axios'
import { create } from 'zustand'

import api from '@/apis'

export interface User {
  id: string | number
  username: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  avatar_url?: string | null
  is_verified?: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  hydrate: () => void
  login: (usernameOrEmail: string, password: string) => Promise<void>
  register: (userData: {
    first_name: string
    last_name: string
    username: string
    email: string
    phone: string
    password: string
    password_confirmation: string
  }) => Promise<void>
  logout: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
  clearAuth: () => void
}

const storedToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  hydrate: () => {
    const token = storedToken()
    set({ token, isAuthenticated: !!token })
    if (token) void get().fetchCurrentUser()
  },

  clearAuth: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    set({ user: null, token: null, isAuthenticated: false })
  },

  login: async (usernameOrEmail, password) => {
    set({ loading: true, error: null })
    try {
      const res = await api.auth.login({ usernameOrEmail, password })
      const data = res.data.data
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
      set({ token: data.token, user: data.user, isAuthenticated: true, loading: false })
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Login failed'
        : 'Login failed'
      set({ error: message, loading: false })
      throw err
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null })
    try {
      await api.auth.register(userData)
      set({ loading: false })
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Registration failed'
        : 'Registration failed'
      set({ error: message, loading: false })
      throw err
    }
  },

  logout: async () => {
    try {
      await api.auth.logout()
    } catch {
      // ignore network failures on logout
    } finally {
      get().clearAuth()
    }
  },

  fetchCurrentUser: async () => {
    if (!storedToken()) return
    try {
      const res = await api.user.getCurrentUser()
      set({ user: res.data.data.user })
    } catch {
      get().clearAuth()
    }
  },
}))
