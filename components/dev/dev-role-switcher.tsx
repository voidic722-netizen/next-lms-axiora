'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { DEV_USERS } from '@/src/mocks/seed-data'

type DevRole = 'admin' | 'teacher' | 'student'

const ROLE_COLORS: Record<DevRole, string> = {
  admin: 'bg-red-500',
  teacher: 'bg-blue-500',
  student: 'bg-green-500',
}

const ROLE_LABELS: Record<DevRole, string> = {
  admin: 'Admin',
  teacher: 'Teacher',
  student: 'Student',
}

const ROLE_ROUTES: Record<DevRole, string> = {
  admin: '/admin',
  teacher: '/teacher',
  student: '/',
}

/**
 * Widget floating untuk switch role saat development.
 * Hanya muncul jika NEXT_PUBLIC_MSW=true dan NODE_ENV=development.
 * Tidak pernah tampil di production.
 */
export function DevRoleSwitcher() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const setLoading = useAuthStore((s) => s.setLoading)
  const currentUser = useAuthStore((s) => s.user)

  if (process.env.NODE_ENV !== 'development') return null
  if (process.env.NEXT_PUBLIC_MSW !== 'true') return null

  const currentRole: DevRole =
    currentUser?.role === '1' ? 'admin'
    : currentUser?.role === '2' ? 'teacher'
    : 'student'

  function switchRole(role: DevRole) {
    const user = DEV_USERS[role]
    setLoading(false)
    setUser(user)
    // Simpan ke cookie agar MSW /auth/me dan protected layout return user yang tepat
    document.cookie = `dev_role=${role}; path=/`
    router.push(ROLE_ROUTES[role])
    setOpen(false)
  }

  return (
    <div className="fixed bottom-20 right-4 z-[9999] md:bottom-4">
      {open && (
        <div className="mb-2 bg-background border rounded-lg shadow-xl p-3 space-y-1.5 w-44">
          <p className="text-xs font-semibold text-muted-foreground px-1 pb-1 border-b">
            🛠 Dev: Pilih Role
          </p>
          {(['admin', 'teacher', 'student'] as DevRole[]).map((role) => (
            <button
              key={role}
              onClick={() => switchRole(role)}
              className={[
                'w-full text-left px-3 py-1.5 rounded text-sm font-medium text-white transition-opacity',
                ROLE_COLORS[role],
                currentRole === role ? 'opacity-100 ring-2 ring-white ring-offset-1' : 'opacity-75 hover:opacity-100',
              ].join(' ')}
            >
              {currentRole === role ? '✓ ' : ''}{ROLE_LABELS[role]}
            </button>
          ))}
          <p className="text-[10px] text-muted-foreground text-center pt-1">
            Mock data aktif · MSW
          </p>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className={`${ROLE_COLORS[currentRole]} text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform`}
      >
        🛠 {currentRole.toUpperCase()}
      </button>
    </div>
  )
}