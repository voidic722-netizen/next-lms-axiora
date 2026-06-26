import api from '@/lib/axios'
import { withStorageUrl } from '@/lib/storage'
import type { Subject, CreateSubjectPayload, UpdateSubjectPayload } from '@/types/subject'

interface RawSubject {
  id: number
  name: string
  type: 'general' | 'compulsory'
  department_id: number | null
  description: string
  thumbnail: string | null
  created_at: string
  updated_at: string
}

function mapSubject(raw: RawSubject): Subject {
  return {
    id: raw.id,
    name: raw.name,
    type: raw.type,
    departmentId: raw.department_id,
    description: raw.description,
    thumbnail: withStorageUrl(raw.thumbnail),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

export async function getSubjectsService(): Promise<Subject[]> {
  const { data } = await api.get<RawSubject[]>('/subjects')
  return data.map(mapSubject)
}

export async function getSubjectByIdService(id: number | string): Promise<Subject> {
  const { data } = await api.get<RawSubject>(`/subjects/${id}`)
  return mapSubject(data)
}

export async function createSubjectService(payload: CreateSubjectPayload): Promise<Subject> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('type', payload.type)
  form.append('description', payload.description)
  if (payload.departmentId != null) form.append('department_id', String(payload.departmentId))
  if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
  const { data } = await api.post<RawSubject>('/subjects', form)
  return mapSubject(data)
}

export async function updateSubjectService(id: number, payload: UpdateSubjectPayload): Promise<Subject> {
  const form = new FormData()
  form.append('_method', 'PUT')
  form.append('name', payload.name)
  form.append('type', payload.type)
  form.append('description', payload.description)
  if (payload.departmentId != null) form.append('department_id', String(payload.departmentId))
  if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
  const { data } = await api.post<RawSubject>(`/subjects/${id}`, form)
  return mapSubject(data)
}

export async function deleteSubjectService(id: number): Promise<void> {
  await api.delete(`/subjects/${id}`)
}