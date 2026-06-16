import api from '@/lib/axios'
import type { User, CreateUserPayload, UpdateUserPayload } from '@/types/user'

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

export async function getUsersService(role?: string): Promise<User[]> {
  const params = role ? { role } : {}
  const { data } = await api.get<{ users: RawUser[] }>('/users', { params })
  return data.users.map(mapUser)
}

export async function createUserService(payload: CreateUserPayload): Promise<User> {
  const body = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
    position: payload.position,
    nidn: payload.nidn,
    nim: payload.nim,
    fakultas_id: payload.facultyId,
    jurusan_id: payload.departmentId,
    kelas_id: payload.classroomId,
    mata_pelajaran_id: payload.subjectId,
  }
  const { data } = await api.post<{ user: RawUser }>('/users', body)
  return mapUser(data.user)
}

export async function updateUserService(
  id: number,
  payload: UpdateUserPayload,
  image?: File,
): Promise<User> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('email', payload.email)
  form.append('role', payload.role)
  if (payload.password) form.append('password', payload.password)
  if (payload.position) form.append('position', payload.position)
  if (payload.nidn) form.append('nidn', payload.nidn)
  if (payload.nim) form.append('nim', payload.nim)
  if (payload.facultyId != null) form.append('fakultas_id', String(payload.facultyId))
  if (payload.departmentId != null) form.append('jurusan_id', String(payload.departmentId))
  if (payload.classroomId != null) form.append('kelas_id', String(payload.classroomId))
  if (payload.subjectId != null) form.append('mata_pelajaran_id', String(payload.subjectId))
  if (image) form.append('image', image)

  const { data } = await api.put<{ user: RawUser }>(`/users/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapUser(data.user)
}

export async function deleteUserService(id: number): Promise<void> {
  await api.delete(`/users/${id}`)
}
