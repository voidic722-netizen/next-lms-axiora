import api from '@/lib/axios'
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/config'
import type { User } from '@/types/user'

interface RawUser {
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

function mapUser(raw: RawUser): User {
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
}

export async function loginService(email: string, password: string): Promise<{ user: User; token: string }> {
  const { data } = await api.post<{ user: RawUser; token: string }>('/auth/login', { email, password })
  return { user: mapUser(data.user), token: data.token }
}

export async function getMeService(): Promise<User | null> {
  try {
    const { data } = await api.get<RawUser>('/auth/me')
    return mapUser(data)
  } catch {
    return null
  }
}

export async function logoutService(): Promise<void> {
  await api.post('/auth/logout')
  const isProd = process.env.NODE_ENV === 'production'
  document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${isProd ? '; Secure' : ''}`
}

export async function updateProfileService(payload: { name: string; email: string }): Promise<void> {
  await api.patch('/auth/profile', payload)
}