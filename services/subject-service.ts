import api from '@/lib/axios'
import { withStorageUrl } from '@/lib/storage'
import type { Subject, CreateSubjectPayload, UpdateSubjectPayload } from '@/types/subject'

interface RawSubject {
  id: number
  name: string
  type: 'umum' | 'wajib'
  jurusan_id: number | null
  description: string
  thumbnail: string | null
  created_at: string
}

function mapSubject(raw: RawSubject): Subject {
  return {
    id: raw.id,
    name: raw.name,
    type: raw.type,
    departmentId: raw.jurusan_id,
    description: raw.description,
    thumbnail: withStorageUrl(raw.thumbnail),
    createdAt: raw.created_at,
  }
}

export async function getSubjectsService(): Promise<Subject[]> {
  const { data } = await api.get<{ mata_pelajaran: RawSubject[] }>('/mata-pelajaran')
  return data.mata_pelajaran.map(mapSubject)
}

export async function getSubjectByIdService(id: number | string): Promise<Subject> {
  const { data } = await api.get<{ mata_pelajaran: RawSubject }>(`/mata-pelajaran/${id}`)
  return mapSubject(data.mata_pelajaran)
}

export async function createSubjectService(payload: CreateSubjectPayload): Promise<Subject> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('type', payload.type)
  form.append('description', payload.description)
  if (payload.departmentId != null) form.append('jurusan_id', String(payload.departmentId))
  if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
  const { data } = await api.post<{ mataPelajaran: RawSubject }>('/mata-pelajaran', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapSubject(data.mataPelajaran)
}

export async function updateSubjectService(id: number, payload: UpdateSubjectPayload): Promise<Subject> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('type', payload.type)
  form.append('description', payload.description)
  if (payload.departmentId != null) form.append('jurusan_id', String(payload.departmentId))
  if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
  const { data } = await api.put<{ mataPelajaran: RawSubject }>(`/mata-pelajaran/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapSubject(data.mataPelajaran)
}

export async function deleteSubjectService(id: number): Promise<void> {
  await api.delete(`/mata-pelajaran/${id}`)
}
