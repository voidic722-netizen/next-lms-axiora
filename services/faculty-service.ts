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
  dean: string
  thumbnail: string | null
  created_at: string
}

interface RawFacultyDetail extends RawFaculty {
  dekan: { id: number; name: string; nidn: string | null } | null
  jurusan: Array<{ id: number; name: string; description: string; thumbnail: string | null }>
  pengajar: Array<{
    id: number
    name: string
    email: string
    nidn: string | null
    position: string | null
    image: string | null
    jurusan: { id: number; name: string } | null
  }>
  siswa: Array<{
    id: number
    name: string
    email: string
    nim: string | null
    image: string | null
    jurusan: { id: number; name: string } | null
    kelas: { id: number; name: string } | null
  }>
}

function mapFaculty(raw: RawFaculty): Faculty {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    dean: raw.dean,
    thumbnail: withStorageUrl(raw.thumbnail),
    createdAt: raw.created_at,
  }
}

function mapFacultyDetail(raw: RawFacultyDetail): FacultyDetail {
  return {
    ...mapFaculty(raw),
    deanUser: raw.dekan ?? null,
    departments: raw.jurusan.map((j) => ({
      id: j.id,
      name: j.name,
      description: j.description,
      thumbnail: withStorageUrl(j.thumbnail),
    })),
    teachers: raw.pengajar.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      nidn: p.nidn,
      position: p.position,
      image: withStorageUrl(p.image),
      department: p.jurusan,
    })),
    students: raw.siswa.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      nim: s.nim,
      image: withStorageUrl(s.image),
      department: s.jurusan,
      classroom: s.kelas,
    })),
  }
}

export async function getFacultiesService(): Promise<Faculty[]> {
  const { data } = await api.get<{ fakultas: RawFaculty[] }>('/fakultas')
  return data.fakultas.map(mapFaculty)
}

export async function getFacultyDetailService(id: number): Promise<FacultyDetail> {
  const { data } = await api.get<{ fakultas: RawFacultyDetail }>(`/fakultas/${id}`)
  return mapFacultyDetail(data.fakultas)
}

export async function getAvailableFacultiesForDeanService(excludeUserId?: number): Promise<Faculty[]> {
  const params = excludeUserId ? { exclude_user_id: excludeUserId } : {}
  const { data } = await api.get<{ fakultas: RawFaculty[] }>('/fakultas/available-for-dekan', { params })
  return data.fakultas.map(mapFaculty)
}

export async function createFacultyService(payload: CreateFacultyPayload): Promise<Faculty> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('description', payload.description)
  if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
  const { data } = await api.post<{ fakultas: RawFaculty }>('/fakultas', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapFaculty(data.fakultas)
}

export async function updateFacultyService(id: number, payload: UpdateFacultyPayload): Promise<Faculty> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('description', payload.description)
  if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
  const { data } = await api.put<{ fakultas: RawFaculty }>(`/fakultas/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapFaculty(data.fakultas)
}

export async function deleteFacultyService(id: number): Promise<void> {
  await api.delete(`/fakultas/${id}`)
}
