import api from '@/lib/axios'
import type { Semester, CreateSemesterPayload, UpdateSemesterPayload } from '@/types/semester'

interface RawSemester {
  id: number
  name: string
  academic_year: string
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

function mapSemester(raw: RawSemester): Semester {
  return {
    id: raw.id,
    name: raw.name,
    academicYear: raw.academic_year,
    startDate: raw.start_date,
    endDate: raw.end_date,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

export async function getSemestersService(): Promise<Semester[]> {
  const { data } = await api.get<RawSemester[]>('/semesters')
  return data.map(mapSemester)
}

export async function createSemesterService(payload: CreateSemesterPayload): Promise<Semester> {
  const { data } = await api.post<RawSemester>('/semesters', {
    name: payload.name,
    academic_year: payload.academicYear,
    start_date: payload.startDate,
    end_date: payload.endDate,
  })
  return mapSemester(data)
}

export async function updateSemesterService(id: number, payload: UpdateSemesterPayload): Promise<Semester> {
  const { data } = await api.put<RawSemester>(`/semesters/${id}`, {
    name: payload.name,
    academic_year: payload.academicYear,
    start_date: payload.startDate,
    end_date: payload.endDate,
  })
  return mapSemester(data)
}

export async function deleteSemesterService(id: number): Promise<void> {
  await api.delete(`/semesters/${id}`)
}