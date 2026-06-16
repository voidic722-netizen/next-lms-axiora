import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { loginService } from '@/services/auth-service'
import { USER_ROLE } from '@/types/roles'
import type { LoginFormValues } from '@/features/auth/schemas/login-schema'

export function useLogin() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const setToken = useAuthStore((s) => s.setToken)
  const [isLoading, setIsLoading] = useState(false)

  async function login(values: LoginFormValues) {
    setIsLoading(true)
    try {
      const { user, token } = await loginService(values.email, values.password)

      setUser(user)
      setToken(token)
      document.cookie = `auth_token=${token}; path=/; SameSite=Lax`

      const target =
        user.role === USER_ROLE.Admin
          ? '/admin'
          : user.role === USER_ROLE.Teacher
            ? '/teacher'
            : '/'

      router.replace(target)
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Login gagal. Periksa email dan password Anda.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading }
}