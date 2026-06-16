import api from '@/lib/axios'
import { withStorageUrl } from '@/lib/storage'
import type {
  Department,
  DepartmentDetail,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from '@/types/department'

interface RawDepartment {
  id: number
  name: string
  description: string
  fakultas_id: number
  thumbnail: string | null
  created_at: string
}

interface RawDepartmentDetail extends RawDepartment {
  fakultas: { id: number; name: string } | null
  pengajar: Array<{ id: number; name: string; email: string; nidn: string | null; position: string | null; image: string | null }>
  siswa: Array<{ id: number; name: string; email: string; nim: string | null; image: string | null; kelas: { id: number; name: string } | null }>
  mata_pelajaran: Array<{ id: number; name: string; description: string; thumbnail: string | null; type: 'umum' | 'wajib'; teacher: string | null }>
  kelas: Array<{ id: number; name: string; semester: { id: number; name: string; academic_year: string } | null; mata_pelajaran: { id: number; name: string } | null }>
}

function mapDepartment(raw: RawDepartment): Department {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    facultyId: raw.fakultas_id,
    thumbnail: withStorageUrl(raw.thumbnail),
    createdAt: raw.created_at,
  }
}

function mapDepartmentDetail(raw: RawDepartmentDetail): DepartmentDetail {
  return {
    ...mapDepartment(raw),
    faculty: raw.fakultas ?? null,
    teachers: raw.pengajar.map((p) => ({
      id: p.id, name: p.name, email: p.email,
      nidn: p.nidn, position: p.position, image: withStorageUrl(p.image),
    })),
    students: raw.siswa.map((s) => ({
      id: s.id, name: s.name, email: s.email,
      nim: s.nim, image: withStorageUrl(s.image),
      classroom: s.kelas,
    })),
    subjects: raw.mata_pelajaran.map((mp) => ({
      id: mp.id, name: mp.name, description: mp.description,
      thumbnail: withStorageUrl(mp.thumbnail), type: mp.type, teacher: mp.teacher,
    })),
    classrooms: raw.kelas.map((k) => ({
      id: k.id, name: k.name,
      semester: k.semester ? { id: k.semester.id, name: k.semester.name, academicYear: k.semester.academic_year } : null,
      subject: k.mata_pelajaran,
    })),
  }
}

export async function getDepartmentsService(): Promise<Department[]> {
  const { data } = await api.get<{ jurusan: RawDepartment[] }>('/jurusan')
  return data.jurusan.map(mapDepartment)
}

export async function getDepartmentDetailService(id: number): Promise<DepartmentDetail> {
  const { data } = await api.get<{ jurusan: RawDepartmentDetail }>(`/jurusan/${id}`)
  return mapDepartmentDetail(data.jurusan)
}

export async function createDepartmentService(payload: CreateDepartmentPayload): Promise<Department> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('description', payload.description)
  form.append('fakultas_id', String(payload.facultyId))
  if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
  const { data } = await api.post<{ jurusan: RawDepartment }>('/jurusan', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapDepartment(data.jurusan)
}

export async function updateDepartmentService(id: number, payload: UpdateDepartmentPayload): Promise<Department> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('description', payload.description)
  form.append('fakultas_id', String(payload.facultyId))
  if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
  const { data } = await api.put<{ jurusan: RawDepartment }>(`/jurusan/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapDepartment(data.jurusan)
}

export async function deleteDepartmentService(id: number): Promise<void> {
  await api.delete(`/jurusan/${id}`)
}
