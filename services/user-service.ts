import api from '@/lib/axios'
import type { User, CreateUserPayload, UpdateUserPayload } from '@/types/user'

interface RawUser {
  id: number
  name: string
  email: string
  role: number
  image: string | null
  position: string | null
  nidn: string | null
  nim: string | null
  faculty_id: number | null
  department_id: number | null
  classroom_id: number | null
  subject_id: number | null
  faculty?: { id: number; name: string } | null
  department?: { id: number; name: string } | null
  classroom?: { id: number; name: string } | null
  subject?: { id: number; name: string } | null
  created_at: string
  updated_at: string
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

export async function getUsersService(role?: string): Promise<User[]> {
  const params = role ? { role } : {}
  const { data } = await api.get<RawUser[]>('/users', { params })
  return data.map(mapUser)
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
    faculty_id: payload.facultyId,
    department_id: payload.departmentId,
    classroom_id: payload.classroomId,
    subject_id: payload.subjectId,
  }
  const { data } = await api.post<RawUser>('/users', body)
  return mapUser(data)
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
  if (payload.facultyId != null) form.append('faculty_id', String(payload.facultyId))
  if (payload.departmentId != null) form.append('department_id', String(payload.departmentId))
  if (payload.classroomId != null) form.append('classroom_id', String(payload.classroomId))
  if (payload.subjectId != null) form.append('subject_id', String(payload.subjectId))
  if (image) form.append('image', image)

  const { data } = await api.put<RawUser>(`/users/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapUser(data)
}

export async function deleteUserService(id: number): Promise<void> {
  await api.delete(`/users/${id}`)
}