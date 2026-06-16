import { useAuthStore } from '@/stores/auth-store'
import { isAdmin, isStudent, isTeacher, isTeacherOrAdmin } from '@/types/roles'

/**
 * Thin wrapper over the Zustand auth store.
 * Provides the same API as the old useAuth() hook for drop-in compatibility,
 * plus convenience role-check booleans.
 */
export function useAuth() {
  const { user, loading } = useAuthStore()

  return {
    user,
    loading,
    isAdmin: user ? isAdmin(user.role) : false,
    isTeacher: user ? isTeacher(user.role) : false,
    isStudent: user ? isStudent(user.role) : false,
    isTeacherOrAdmin: user ? isTeacherOrAdmin(user.role) : false,
  }
}
