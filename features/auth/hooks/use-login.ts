import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { UseFormSetError } from 'react-hook-form'
import { useAuthStore } from '@/stores/auth-store'
import { loginService } from '@/services/auth-service'
import { USER_ROLE } from '@/types/roles'
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/config'
import type { LoginFormValues } from '@/features/auth/schemas/login-schema'

export function useLogin() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const setToken = useAuthStore((s) => s.setToken)
  const [isLoading, setIsLoading] = useState(false)

  async function login(
    values: LoginFormValues,
    setError: UseFormSetError<LoginFormValues>,
    redirectTo?: string | null,
  ) {
    setIsLoading(true)
    try {
      const { user, token } = await loginService(values.email, values.password)

      if (!token || !user) {
        toast.error('Login gagal. Periksa email dan password Anda.')
        return
      }

      setUser(user)
      setToken(token)

      const isProd = process.env.NODE_ENV === 'production'
      document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=${token}; path=/; SameSite=Lax${isProd ? '; Secure' : ''}`

      const defaultTarget =
        user.role === USER_ROLE.Admin
          ? '/admin'
          : user.role === USER_ROLE.Teacher
            ? '/teacher'
            : user.role === USER_ROLE.Student
              ? '/dashboard'
              : '/'

      const isSafeRedirect = !!redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')

      router.replace(isSafeRedirect ? redirectTo! : defaultTarget)
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } }
        code?: string
      }

      // Surface 422 field-level validation errors on the form
      if (axiosError.response?.status === 422 && axiosError.response.data?.errors) {
        const fieldErrors = axiosError.response.data.errors
        for (const [field, messages] of Object.entries(fieldErrors)) {
          if (field === 'email' || field === 'password') {
            setError(field, { type: 'server', message: messages[0] })
          }
        }
        return
      }

      // Network failure — API unreachable or timeout
      if (!axiosError.response || axiosError.code === 'ERR_NETWORK') {
        toast.error('Gagal terhubung ke server. Periksa koneksi internet Anda.')
        return
      }

      const message =
        axiosError.response.data?.message
        ?? 'Login gagal. Periksa email dan password Anda.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading }
}