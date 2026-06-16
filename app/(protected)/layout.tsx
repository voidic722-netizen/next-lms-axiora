import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthHydrator } from '@/features/auth/components/auth-hydrator'
import { Sidebar } from '@/components/layout/sidebar'
import { TabBar } from '@/components/layout/tab-bar'
import { Breadcrumb } from '@/components/layout/breadcrumb'
import type { User } from '@/types/user'

const AUTH_TOKEN_COOKIE = process.env.AUTH_TOKEN_COOKIE_NAME ?? 'auth_token'
const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? ''
const IS_MSW_ACTIVE = process.env.NEXT_PUBLIC_MSW === 'true'

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
  return { ...base, id: 1, name: 'Admin Utama', email: 'admin@lms.id', role: '1' }
}

async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)
  if (!token?.value) return null

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })
    if (!res.ok) return null

    const json = await res.json() as {
      data: {
        id: number
        name: string
        email: string
        role: number
        image: string | null
        position: string | null
        nidn: string | null
        nim: string | null
        created_at: string
        updated_at: string
        faculty_id: number | null
        department_id: number | null
        classroom_id: number | null
        subject_id: number | null
        faculty?: { id: number; name: string } | null
        department?: { id: number; name: string } | null
        classroom?: { id: number; name: string } | null
        subject?: { id: number; name: string } | null
      }
    }

    const raw = json.data

    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      role: String(raw.role) as User['role'],
      image: raw.image,
      position: raw.position as User['position'],
      nidn: raw.nidn,
      nim: raw.nim,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      deletedAt: null,
      facultyId: raw.faculty_id,
      departmentId: raw.department_id,
      classroomId: raw.classroom_id,
      subjectId: raw.subject_id,
      faculty: raw.faculty ?? null,
      department: raw.department ?? null,
      classroom: raw.classroom ?? null,
      subject: raw.subject ?? null,
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
    const cookieStore = await cookies()
    const devRole = cookieStore.get('dev_role')?.value ?? 'admin'
    user = getMockUser(devRole)
  } else {
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