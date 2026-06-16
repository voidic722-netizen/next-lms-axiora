'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import type { User } from '@/types/user'

interface AuthHydratorProps {
  user: User
  children: React.ReactNode
}

export function AuthHydrator({ user, children }: AuthHydratorProps) {
  const setUser = useAuthStore((s) => s.setUser)
  const setToken = useAuthStore((s) => s.setToken)
  const setLoading = useAuthStore((s) => s.setLoading)
  const hydrated = useRef(false)

  if (!hydrated.current) {
    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/)
    const token = match ? match[1] : null
    setUser(user)
    if (token) setToken(token)
    setLoading(false)
    hydrated.current = true
  }

  useEffect(() => {
    setUser(user)
  }, [user, setUser])

  return <>{children}</>
}