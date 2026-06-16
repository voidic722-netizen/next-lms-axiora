export interface Semester {
  id: number
  name: string
  academicYear: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateSemesterPayload {
  name: string
  academicYear: string
  startDate: string
  endDate: string
}

export interface UpdateSemesterPayload {
  name: string
  academicYear: string
  startDate: string
  endDate: string
}