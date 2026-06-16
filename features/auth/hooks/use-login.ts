import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { loginService } from '@/services/auth-service'
import { USER_ROLE } from '@/types/roles'
import type { LoginFormValues } from '../schemas/login-schema'

/**
 * Handles the login flow.
 *
 * FIX applied: The old useLogin navigated to "/home" for non-admin users,
 * which is a non-existent route. Correct targets are:
 *   Admin   → /admin
 *   Teacher → /teacher
 *   Student → /
 */
export function useLogin() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [isLoading, setIsLoading] = useState(false)

  async function login(values: LoginFormValues) {
    setIsLoading(true)
    try {
      const user = await loginService(values.email, values.password)

      // Write to Zustand store — no second getMeApi() call needed
      setUser(user)

      // Role-based redirect — fixed from original "/home" bug
      const target =
        user.role === USER_ROLE.Admin
          ? '/admin'
          : user.role === USER_ROLE.Teacher
            ? '/teacher'
            : '/'

      router.replace(target)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Login gagal. Periksa email dan password Anda.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading }
}
