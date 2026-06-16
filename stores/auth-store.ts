'use client'

import { create } from 'zustand'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
}

interface AuthActions {
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  clearUser: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  loading: true,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ loading }),
  clearUser: () => set({ user: null, token: null, loading: false }),
}))