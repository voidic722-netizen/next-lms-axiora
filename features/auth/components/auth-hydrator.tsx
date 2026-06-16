'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import type { User } from '@/types/user'

interface AuthHydratorProps {
  user: User
  children: React.ReactNode
}

/**
 * Thin client wrapper that hydrates the Zustand auth store with the user
 * object fetched server-side in the protected layout.
 * Renders children immediately — no loading flash.
 */
export function AuthHydrator({ user, children }: AuthHydratorProps) {
  const setUser = useAuthStore((s) => s.setUser)
  const setLoading = useAuthStore((s) => s.setLoading)
  const hydrated = useRef(false)

  // Synchronously hydrate on the first render to avoid flicker
  if (!hydrated.current) {
    setUser(user)
    setLoading(false)
    hydrated.current = true
  }

  // Keep in sync if user prop changes (e.g. after profile edit)
  useEffect(() => {
    setUser(user)
  }, [user, setUser])

  return <>{children}</>
}
