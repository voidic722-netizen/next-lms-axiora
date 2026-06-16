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
  faculty_id: number
  thumbnail: string | null
  created_at: string
  updated_at: string
}

interface RawDepartmentDetail extends RawDepartment {
  faculty: { id: number; name: string } | null
  lecturers: Array<{ id: number; name: string; email: string; nidn: string | null; position: string | null; image: string | null }>
  students: Array<{ id: number; name: string; email: string; nim: string | null; image: string | null; classroom: { id: number; name: string } | null }>
  subjects: Array<{ id: number; name: string; description: string; thumbnail: string | null; type: 'general' | 'compulsory'; teacher: string | null }>
  classrooms: Array<{ id: number; name: string; semester: { id: number; name: string; academic_year: string } | null; subject: { id: number; name: string } | null }>
}

function mapDepartment(raw: RawDepartment): Department {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    facultyId: raw.faculty_id,
    thumbnail: withStorageUrl(raw.thumbnail),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapDepartmentDetail(raw: RawDepartmentDetail): DepartmentDetail {
  return {
    ...mapDepartment(raw),
    faculty: raw.faculty ?? null,
    teachers: raw.lecturers.map((p) => ({
      id: p.id, name: p.name, email: p.email,
      nidn: p.nidn, position: p.position, image: withStorageUrl(p.image),
    })),
    students: raw.students.map((s) => ({
      id: s.id, name: s.name, email: s.email,
      nim: s.nim, image: withStorageUrl(s.image),
      classroom: s.classroom,
    })),
    subjects: raw.subjects.map((mp) => ({
      id: mp.id, name: mp.name, description: mp.description,
      thumbnail: withStorageUrl(mp.thumbnail), type: mp.type, teacher: mp.teacher,
    })),
    classrooms: raw.classrooms.map((k) => ({
      id: k.id, name: k.name,
      semester: k.semester ? { id: k.semester.id, name: k.semester.name, academicYear: k.semester.academic_year } : null,
      subject: k.subject,
    })),
  }
}

export async function getDepartmentsService(): Promise<Department[]> {
  const { data } = await api.get<RawDepartment[]>('/departments')
  return data.map(mapDepartment)
}

export async function getDepartmentDetailService(id: number): Promise<DepartmentDetail> {
  const { data } = await api.get<RawDepartmentDetail>(`/departments/${id}`)
  return mapDepartmentDetail(data)
}

export async function createDepartmentService(payload: CreateDepartmentPayload): Promise<Department> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('description', payload.description)
  form.append('faculty_id', String(payload.facultyId))
  if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
  const { data } = await api.post<RawDepartment>('/departments', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapDepartment(data)
}

export async function updateDepartmentService(id: number, payload: UpdateDepartmentPayload): Promise<Department> {
  const form = new FormData()
  form.append('name', payload.name)
  form.append('description', payload.description)
  form.append('faculty_id', String(payload.facultyId))
  if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
  const { data } = await api.put<RawDepartment>(`/departments/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapDepartment(data)
}

export async function deleteDepartmentService(id: number): Promise<void> {
  await api.delete(`/departments/${id}`)
}