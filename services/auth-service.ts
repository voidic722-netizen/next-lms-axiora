import api from '@/lib/axios'
import type { User } from '@/types/user'

// ── Internal backend response shapes ──────────────────────────────────────
interface RawUser {
  id: number
  name: string
  email: string
  role: string
  image: string | null
  position: string | null
  nidn: string | null
  nim: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  fakultas_id: number | null
  jurusan_id: number | null
  kelas_id: number | null
  mata_pelajaran_id: number | null
  jurusan?: { id: number; name: string } | null
  fakultas?: { id: number; name: string } | null
  kelas?: { id: number; name: string } | null
  mata_pelajaran?: { id: number; name: string } | null
}

function mapUser(raw: RawUser): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role as User['role'],
    image: raw.image,
    position: raw.position as User['position'],
    nidn: raw.nidn,
    nim: raw.nim,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    deletedAt: raw.deletedAt,
    facultyId: raw.fakultas_id,
    departmentId: raw.jurusan_id,
    classroomId: raw.kelas_id,
    subjectId: raw.mata_pelajaran_id,
    faculty: raw.fakultas ?? null,
    department: raw.jurusan ?? null,
    classroom: raw.kelas ?? null,
    subject: raw.mata_pelajaran ?? null,
  }
}

export async function loginService(email: string, password: string): Promise<User> {
  const { data } = await api.post<{ user: RawUser }>('/auth/login', { email, password })
  return mapUser(data.user)
}

export async function getMeService(): Promise<User | null> {
  try {
    const { data } = await api.get<{ user: RawUser }>('/auth/me')
    return mapUser(data.user)
  } catch {
    return null
  }
}

export async function logoutService(): Promise<void> {
  await api.post('/auth/logout')
}

export async function updateProfileService(payload: {
  name: string
  email: string
}): Promise<void> {
  await api.patch('/auth/profile', payload)
}
