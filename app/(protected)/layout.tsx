import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthHydrator } from '@/features/auth/components/auth-hydrator'
import { Sidebar } from '@/components/layout/sidebar'
import { TabBar } from '@/components/layout/tab-bar'
import { Breadcrumb } from '@/components/layout/breadcrumb'
import type { User } from '@/types/user'

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? 'laravel_session'
const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? ''
const IS_MSW_ACTIVE = process.env.NEXT_PUBLIC_MSW === 'true'

// ── Dev mode: ambil mock user berdasarkan dev_role cookie ────────────────────
function getMockUser(role: string): User {
  const base = {
    image: null, position: null, nidn: null, nim: null,
    facultyId: null, departmentId: null, classroomId: null, subjectId: null,
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', deletedAt: null,
  } as const

  if (role === 'teacher') {
    return {
      ...base, id: 2, name: 'Dr. Budi Santoso', email: 'budi@lms.id', role: '2',
      position: 'dosen', nidn: '0012345678',
      facultyId: 1, departmentId: 1, subjectId: 1,
      faculty: { id: 1, name: 'Fakultas Teknik' },
      department: { id: 1, name: 'Teknik Informatika' },
      subject: { id: 1, name: 'Algoritma & Pemrograman' },
    }
  }
  if (role === 'student') {
    return {
      ...base, id: 3, name: 'Siti Rahayu', email: 'siti@lms.id', role: '3',
      nim: '2024001001', classroomId: 1,
      facultyId: 1, departmentId: 1,
      faculty: { id: 1, name: 'Fakultas Teknik' },
      department: { id: 1, name: 'Teknik Informatika' },
      classroom: { id: 1, name: 'TI-A 2024' },
    }
  }
  // default: admin
  return { ...base, id: 1, name: 'Admin Utama', email: 'admin@lms.id', role: '1' }
}

// ── Production: ambil user dari backend via session cookie ────────────────────
async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  if (!session?.value) return null

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Cookie: `${SESSION_COOKIE}=${session.value}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })
    if (!res.ok) return null

    const raw = await res.json() as {
      user: {
        id: number; name: string; email: string; role: string
        image: string | null; position: string | null; nidn: string | null
        nim: string | null; createdAt: string; updatedAt: string; deletedAt: string | null
        fakultas_id: number | null; jurusan_id: number | null
        kelas_id: number | null; mata_pelajaran_id: number | null
        jurusan?: { id: number; name: string } | null
        fakultas?: { id: number; name: string } | null
        kelas?: { id: number; name: string } | null
        mata_pelajaran?: { id: number; name: string } | null
      }
    }

    return {
      id: raw.user.id,
      name: raw.user.name,
      email: raw.user.email,
      role: raw.user.role as User['role'],
      image: raw.user.image,
      position: raw.user.position as User['position'],
      nidn: raw.user.nidn,
      nim: raw.user.nim,
      createdAt: raw.user.createdAt,
      updatedAt: raw.user.updatedAt,
      deletedAt: raw.user.deletedAt,
      facultyId: raw.user.fakultas_id,
      departmentId: raw.user.jurusan_id,
      classroomId: raw.user.kelas_id,
      subjectId: raw.user.mata_pelajaran_id,
      faculty: raw.user.fakultas ?? null,
      department: raw.user.jurusan ?? null,
      classroom: raw.user.kelas ?? null,
      subject: raw.user.mata_pelajaran ?? null,
    }
  } catch {
    return null
  }
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user: User | null = null

  if (IS_MSW_ACTIVE) {
    // Dev mode: pakai mock user dari cookie dev_role
    const cookieStore = await cookies()
    const devRole = cookieStore.get('dev_role')?.value ?? 'admin'
    user = getMockUser(devRole)
  } else {
    // Production: autentikasi via backend
    user = await getCurrentUser()
    if (!user) redirect('/login')
  }

  return (
    <AuthHydrator user={user!}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar user={user!} />
        <div className="flex flex-1 flex-col min-w-0">
          <Breadcrumb />
          <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
            {children}
          </main>
        </div>
        <TabBar user={user!} />
      </div>
    </AuthHydrator>
  )
}