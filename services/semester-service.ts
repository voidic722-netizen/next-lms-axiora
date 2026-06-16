import api from '@/lib/axios'
import type { Semester, CreateSemesterPayload, UpdateSemesterPayload } from '@/types/semester'

interface RawSemester {
  id: number
  name: string
  academic_year: string
  created_at: string
}

function mapSemester(raw: RawSemester): Semester {
  return {
    id: raw.id,
    name: raw.name,
    academicYear: raw.academic_year,
    createdAt: raw.created_at,
  }
}

export async function getSemestersService(): Promise<Semester[]> {
  const { data } = await api.get<{ semesters: RawSemester[] }>('/semester')
  return data.semesters.map(mapSemester)
}

export async function createSemesterService(payload: CreateSemesterPayload): Promise<Semester> {
  const { data } = await api.post<{ semester: RawSemester }>('/semester', {
    name: payload.name,
    academic_year: payload.academicYear,
  })
  return mapSemester(data.semester)
}

export async function updateSemesterService(id: number, payload: UpdateSemesterPayload): Promise<Semester> {
  const { data } = await api.put<{ semester: RawSemester }>(`/semester/${id}`, {
    name: payload.name,
    academic_year: payload.academicYear,
  })
  return mapSemester(data.semester)
}

export async function deleteSemesterService(id: number): Promise<void> {
  await api.delete(`/semester/${id}`)
}
