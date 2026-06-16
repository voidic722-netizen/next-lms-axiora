import api from '@/lib/axios'
import { withStorageUrl } from '@/lib/storage'
import type {
  Faculty,
  FacultyDetail,
  CreateFacultyPayload,
  UpdateFacultyPayload,
} from '@/types/faculty'

interface RawFaculty {
  id: number
  name: string
  description: string
  thumbnail: string | null
  created_at: string
  updated_at: string
}

interface RawFacultyDetail extends RawFaculty {
  dean: { id: number; name: string; nidn: string | null } | null
  departments: Array<{ id: number; name: string; description: string; thumbnail: string | null }>
  lecturers: Array<{
    id: number
    name: string
    email: string
    nidn: string | null
    position: string | null
    image: string | null
    department: { id: number; name: string } | null
  }>
  students: Array<{
    id: number
    name: string
    email: string
    nim: string | null
    image: string | null
    department: { id: number; name: string } | null
    classroom: { id: number; name: string } | null
  }>
}

function mapFaculty(raw: RawFaculty): Faculty {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    thumbnail: withStorageUrl(raw.thumbnail),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapFacultyDetail(raw: RawFacultyDetail): FacultyDetail {
  return {
    ...mapFaculty(raw),
    deanUser: raw.dean ?? null,
    departments: raw.departments.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      thumbnail: withStorageUrl(d.thumbnail),
    })),
    teachers: raw.lecturers.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      nidn: p.nidn,
      position: p.position,
      image: withStorageUrl(p.image),
      department: p.department,
    })),
    students: raw.students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      nim: s.nim,
      image: withStorageUrl(s.image),
      department: s.department,
      classroom: s.classroom,
    })),
  }
}

export async function getFacultiesService(): Promise<Faculty[]> {
  const { data } = await api.get<RawFaculty[]>('/faculties')
  return data.map(mapFaculty)
}

export async function getFacultyDetailService(id: number): Promise<FacultyDetail> {
  const { data } = await api.get<RawFacultyDetail>(`/faculties/${id}`)
  return mapFacultyDetail(data)
}

export async function getAvailableFacultiesForDeanService(excludeUserId?: number): Promise<Faculty[]> {
  const params = excludeUserId ? { exclude_user_id: excludeUserId } : {}
  const { data } = await api.get<RawFaculty[]>('/faculties/available-for-dean', { params })
  return data.map(mapFaculty)
}

export async function createFacultyService(payload: CreateFacultyPayload): Promise<Faculty> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('description', payload.description)
  if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
  const { data } = await api.post<RawFaculty>('/faculties', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapFaculty(data)
}

export async function updateFacultyService(id: number, payload: UpdateFacultyPayload): Promise<Faculty> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('description', payload.description)
  if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
  const { data } = await api.put<RawFaculty>(`/faculties/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapFaculty(data)
}

export async function deleteFacultyService(id: number): Promise<void> {
  await api.delete(`/faculties/${id}`)
}